import { API_BASE } from "@/lib/api/client";
import { ApiError, type ApiErrorBody } from "@/types/api";

export interface UploadResponse {
  url: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiErrorBody;
    if (Array.isArray(data.message)) return data.message.join(", ");
    if (typeof data.message === "string") return data.message;
  } catch {
    // ignore parse errors
  }
  return response.statusText || "Upload failed";
}

export const uploadApi = {
  upload: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(await parseErrorMessage(response), response.status);
    }

    return response.json() as Promise<UploadResponse>;
  },
};
