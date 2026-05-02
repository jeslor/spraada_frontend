"use server";

import { deleteResource, uploadResources } from "./resources.actions";
import customFetch, { normalCustomFetch } from "../customFetch";
import {
  SearchToolsParams,
  SearchToolsResponse,
  Tool,
  ToolInfo,
  ToolPhoto,
} from "@/store";

const RESOURCE_FOLDER = "tool-images";
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444";

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
      toolInfo.userId!,
      formToolData,
      RESOURCE_FOLDER
    );

    if (!uploadedToolPhotosResponse.success) {
      throw new Error(
        uploadedToolPhotosResponse.error || "Failed to upload tool photos"
      );
    }

    const savedToolResponse = await customFetch(`${BACKEND_API_URL}/tools`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...toolInfo,
        toolPhotos: uploadedToolPhotosResponse.data.map(
          (photo: { key: string; url: string }) => ({
            photoUrl: photo.url,
            photoUrlKey: photo.key,
          })
        ),
      }),
    });

    if (!savedToolResponse.ok) {
      throw new Error(
        savedToolResponse.data?.message ||
          savedToolResponse.data?.error ||
          savedToolResponse.error ||
          "Failed to save tool"
      );
    }
  } catch (error) {
    throw error;
  }
};

export const getToolsByOwner = async (ownerId: number) => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_API_URL}/tools/owner/${ownerId}`,
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
          "Failed to fetch tools"
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRandomTools = async (count: number) => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_API_URL}/tools/random?count=${count}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 30 },
      }
    );
    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to fetch random tools"
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchTools = async (
  params: SearchToolsParams
): Promise<SearchToolsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.searchTerm) queryParams.set("searchTerm", params.searchTerm);
    if (params.category) queryParams.set("category", params.category);
    if (params.sortBy) queryParams.set("sortBy", params.sortBy);
    if (params.availability)
      queryParams.set("availability", params.availability);
    if (params.page) queryParams.set("page", params.page.toString());
    if (params.limit) queryParams.set("limit", params.limit.toString());

    const response = await fetch(
      `${BACKEND_API_URL}/tools/search?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText || "Failed to search tools");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getAllTools = async (limit?: number) => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_API_URL}/tools${limit ? `?limit=${limit}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

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
    const response = await normalCustomFetch(
      `${BACKEND_API_URL}/tools/${toolId}`,
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
  userId,
  toolInfo,
  newPhotos,
  existingPhotos,
  deletedPhotos,
}: {
  toolId: string;
  userId: number;
  toolInfo: Partial<ToolInfo>;
  newPhotos?: ToolPhoto[];
  existingPhotos: ToolPhoto[];
  deletedPhotos: ToolPhoto[];
}): Promise<Tool> => {
  try {
    if (!toolId || !toolInfo.profileId) {
      throw new Error("Tool ID and Profile ID are required for updating tool");
    }
    //Delete the photos deleted by user from database and from the profile
    if (deletedPhotos.length > 0) {
      const someOldPhototosDeleteResponse = await deleteResource({
        userId: userId,
        keys: deletedPhotos.map((photo) => photo.photoUrlKey!),
        profileId: toolInfo.profileId,
      });

      if (!someOldPhototosDeleteResponse.success) {
        throw new Error(
          someOldPhototosDeleteResponse.error ||
            "Failed to delete old tool photos"
        );
      }
    }

    let allPhotos: ToolPhoto[] = [...(existingPhotos || [])];
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
          photoUrlKey: photo.key,
        })
      );
      allPhotos = [...allPhotos, ...newUploadedPhotos];
    }

    const updatePayload: any = { ...toolInfo };
    if (allPhotos.length > 0) {
      updatePayload.toolPhotos = allPhotos;
    }

    // Update the tool details with the combined photos
    const response = await customFetch(`${BACKEND_API_URL}/tools/${toolId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

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

export const deleteTool = async (
  tool: Tool,
  profileId: number
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await customFetch(`${BACKEND_API_URL}/tools/${tool.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profileId }),
    });

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to delete tool"
      );
    }

    return {
      success: true,
      data: "Tool deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: error instanceof Error ? error.message : "Failed to delete tool",
    };
  }
};

export const updateToolAvailabilityStatus = async (
  toolId: string,
  availabilityStatus: boolean,
  profileId: number
): Promise<{ success: boolean; data: boolean }> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_API_URL}/tools/${toolId}/availability`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          available: availabilityStatus,
          profileId: profileId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to update tool availability status"
      );
    }

    return {
      success: true,
      data: response.data.available,
    };
  } catch (error) {
    throw error;
  }
};

// Get tools that a user has rented out to others
export const getRentedTools = async (profileId: number): Promise<Tool[]> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_API_URL}/bookings/rented/profile/${profileId}`,
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
          "Failed to fetch rented tools"
      );
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching rented tools:", error);
    return [];
  }
};

// Get tools that a user has borrowed from others
export const getBorrowedTools = async (profileId: number): Promise<Tool[]> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_API_URL}/bookings/borrowed/profile/${profileId}`,
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
          "Failed to fetch borrowed tools"
      );
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching borrowed tools:", error);
    return [];
  }
};
