"use server";

import { uploadResources } from "./resources.actions";
import customFetch from "../customFetch";
import { ToolInfo, ToolPhoto } from "@/types/tool.types";

const RESOURCE_FOLDER = "tool-images";

export const saveTool = async ({
  toolInfo,
  toolPhotos,
}: {
  toolInfo: ToolInfo;
  toolPhotos: ToolPhoto[];
}): Promise<void> => {
  try {
    const formToolData = new FormData();
    toolPhotos.forEach((photo: ToolPhoto) => {
      formToolData.append("images", photo.file);
    });

    //Save the tool photos first using profileId
    const uploadedToolPhotosResponse = await uploadResources(
      toolInfo.profileId,
      formToolData,
      RESOURCE_FOLDER
    );

    if (!uploadedToolPhotosResponse.success) {
      throw new Error(
        uploadedToolPhotosResponse.error || "Failed to upload tool photos"
      );
    }

    const savedToolResponse = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/tools`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...toolInfo,
          toolPhotos: uploadedToolPhotosResponse.data.map(
            (photo: { key: string; url: string }) => ({
              photoUrl: photo.url,
              photoKey: photo.key,
            })
          ),
        }),
      }
    );

    if (!savedToolResponse.ok) {
      throw new Error(
        savedToolResponse.data?.message ||
          savedToolResponse.data?.error ||
          savedToolResponse.error ||
          "Failed to save tool"
      );
    }

    console.log(savedToolResponse);
  } catch (error) {
    throw error;
  }
};
