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

export const approveBooking = async (
  bookingId: string
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
          status: "CONFIRMED",
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
