"use server";

import { redirect } from "next/navigation";

export async function uploadFileAction({ formData }: { formData: FormData }) {
  try {
    const response = await fetch("http://backend:8000/upload-zip", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = (await response.json()) as { file_id: string };
    redirect(`/data/${result.file_id}`);
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}
