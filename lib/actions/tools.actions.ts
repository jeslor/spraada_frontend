"use server";

import { custom } from "zod";
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

    console.log(formToolData);

    //Save the tool photos first
    const uploadedToolPhotosResponse = await uploadResources(
      toolInfo.ownerId,
      formToolData,
      RESOURCE_FOLDER
    );

    console.log(uploadedToolPhotosResponse);

    if (!uploadedToolPhotosResponse.success) {
      throw new Error(
        uploadedToolPhotosResponse.error || "Failed to upload tool photos"
      );
    }

    // const savedToolResponse = await customFetch(
    //   `${
    //     process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
    //   }/tools`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       ...otherData,
    //       toolPhotos: uploadedToolPhotosResponse.data,
    //     }),
    //   }
    // );

    console.log(uploadedToolPhotosResponse.data);
  } catch (error) {
    throw error;
  }
};
