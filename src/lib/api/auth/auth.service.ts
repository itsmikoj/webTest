import { api } from "@/lib/api//client";
import {
  UpdateResponse,
  Update,
  ChangePasswordData,
} from "@/types";

export async function updateUser(userData: Update): Promise<UpdateResponse> {
  try {
    const response = await api.put<UpdateResponse>("/auth/update", userData);
    return response;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error updating user";
    console.error("[Update User Error]:", message);
    throw new Error(message);
  }
}

export async function changePassword(
  passwordData: ChangePasswordData,
): Promise<{ message: string }> {
  try {
    const response = await api.put<{ message: string }>("/auth/update", {
      password: passwordData.new_password,
      method: "email",
    });
    return response;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error changing password";
    console.error("[Change Password Error]:", message);
    throw new Error(message);
  }
}
