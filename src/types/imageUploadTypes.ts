export type UploadContext = "profile" | "hotel" | "room" | "other";

export interface UploadImageArgs {
  file: File;
  context: UploadContext;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}
