// src/lib/api.ts

import axios, { AxiosError } from "axios";
import type { ComplaintRequest, ComplaintResponse } from "@/types/complaint";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

export async function submitComplaint(
  data: ComplaintRequest
): Promise<ComplaintResponse> {
  try {
    const response = await apiClient.post<ComplaintResponse>(
      "/complaints",
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Failed to submit complaint";
      throw new Error(msg);
    }
    throw new Error("An unexpected error occurred");
  }
}
