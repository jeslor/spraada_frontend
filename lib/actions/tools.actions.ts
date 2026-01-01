"use server";

import { uploadResources } from "./resources.actions";
import customFetch from "../customFetch";
import { Tool, ToolInfo, ToolPhoto } from "@/types/tool.types";

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
      formToolData.append("images", photo.file as File);
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

export const getToolsByOwner = async (ownerId: number) => {
  try {
    const response = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/tools/owner/${ownerId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to fetch tools"
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getToolById = async (toolId: string): Promise<Tool | null> => {
  try {
    const response = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/tools/${toolId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to fetch tool"
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTool = async ({
  toolId,
  toolInfo,
  newPhotos,
  existingPhotos,
}: {
  toolId: string;
  toolInfo: Partial<ToolInfo>;
  newPhotos?: ToolPhoto[];
  existingPhotos?: { photoUrl: string; photoKey: string }[];
}): Promise<Tool> => {
  try {
    let allPhotos: { photoUrl: string; photoKey: string }[] = [
      ...(existingPhotos || []),
    ];

    // Upload new photos if any
    if (newPhotos && newPhotos.length > 0) {
      const formToolData = new FormData();
      newPhotos.forEach((photo: ToolPhoto) => {
        if (photo.file) {
          formToolData.append("images", photo.file);
        }
      });

      const uploadedToolPhotosResponse = await uploadResources(
        toolInfo.profileId!,
        formToolData,
        RESOURCE_FOLDER
      );

      if (!uploadedToolPhotosResponse.success) {
        throw new Error(
          uploadedToolPhotosResponse.error || "Failed to upload tool photos"
        );
      }

      // Add newly uploaded photos
      const newUploadedPhotos = uploadedToolPhotosResponse.data.map(
        (photo: { key: string; url: string }) => ({
          photoUrl: photo.url,
          photoKey: photo.key,
        })
      );
      allPhotos = [...allPhotos, ...newUploadedPhotos];
    }

    const updatePayload: any = { ...toolInfo };
    if (allPhotos.length > 0) {
      updatePayload.toolPhotos = allPhotos;
    }

    const response = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/tools/${toolId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      }
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to update tool"
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTool = async (toolId: string): Promise<void> => {
  try {
    const response = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/tools/${toolId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to delete tool"
      );
    }
  } catch (error) {
    throw error;
  }
};
