export type StatusType = "active" | "inactive" | "dev" | "beta";

export interface ApiResponse<T> {
  ok: boolean;
  message: string;
  data: T;
  dateTime?: string;
  detail?: string;
}
