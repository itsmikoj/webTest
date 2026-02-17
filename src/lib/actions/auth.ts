"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, STORAGE_KEYS } from "@/config/constants";
import { AuthResponse } from "@/types";

const ACCESS_TOKEN_MAX_AGE = 2 * 60 * 60;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60;

async function setAuthTokens(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set(STORAGE_KEYS.token, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  cookieStore.set(STORAGE_KEYS.refresh, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function loginAction(email: string, password: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Credenciales inválidas",
        success: false,
      };
    }

    const data: AuthResponse = await response.json();

    await setAuthTokens(data.data.access_token, data.data.refresh_token)

    return {
      success: true,
      data: {
        email: data.data.email,
        full_name: data.data.full_name,
      },
    };
  } catch (error: any) {
    console.error("❌ Error en loginAction:", error);
    return {
      error: "Error al iniciar sesión",
      success: false,
    };
  }
}

export async function refreshTokenAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(STORAGE_KEYS.refresh)?.value;

    if (!refreshToken) {
      return { success: false, error: "No refresh token" };
    }

    const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to refresh token" };
    }

    const data: AuthResponse = await response.json();

    await setAuthTokens(data.data.access_token, data.data.refresh_token)

    return { success: true };
  } catch (error: any) {
    console.error("❌ Error en refreshTokenAction:", error);
    return { success: false, error: "Error al refrescar token" };
  }
}

export async function serverLogout() {
  const cookieStore = await cookies();
  cookieStore.set(STORAGE_KEYS.token, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  cookieStore.set(STORAGE_KEYS.refresh, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
  redirect("/login");
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(STORAGE_KEYS.token);
  return accessToken?.value || null;
}
