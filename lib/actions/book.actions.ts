"use server";
import customFetch from "../customFetch";

interface CreateBookingProps {
  toolId: string;
  borrowerId: number; // The person borrowing the tool
  toolOwnerId: number; // The person who owns the tool (renter)
  pickUpDate: Date;
  returnDate: Date;
  totalPrice: number;
}

export type BookStatus = "pending" | "confirmed" | "cancelled" | "completed";

enum BookingStatus {
  pending = "PENDING",
  confirmed = "CONFIRMED",
  completed = "COMPLETED",
  cancelled = "CANCELLED",
}

export const createBooking = async ({
  toolId,
  borrowerId,
  toolOwnerId,
  pickUpDate,
  returnDate,
  totalPrice,
}: CreateBookingProps): Promise<{
  success: boolean;
  data: any;
}> => {
  try {
    const response = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/bookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId,
          rentedById: toolOwnerId, // Owner is the renter
          borrowedById: borrowerId, // User borrowing
          pickUpDate,
          returnDate,
          totalPrice,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to create booking"
      );
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      data: (error as Error).message,
    };
  }
};

export const getBookingsByProfile = async (profileId: number) => {
  try {
    const response = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/bookings/profile/${profileId}`,
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
          "Failed to fetch bookings"
      );
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  currentStatus: BookStatus
): Promise<{
  success: boolean;
  data: any;
}> => {
  try {
    const response = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/bookings/${bookingId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status:
            BookingStatus[
              currentStatus.toLowerCase() as keyof typeof BookingStatus
            ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to approve booking"
      );
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      data: (error as Error).message,
    };
  }
};

export const getBookingsByTool = async (toolId: string) => {
  try {
    const response = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/bookings/tool/${toolId}`,
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
          "Failed to fetch bookings for tool"
      );
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching bookings for tool:", error);
    return [];
  }
};
