// import { getSession } from "@/lib/session/session";
// import { NextRequest, NextResponse } from "next/server";

// const API_URL = process.env.BACKEND_API_URL || "http://localhost:4444";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await params;

//     const response = await fetch(`${API_URL}/auth/${id}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session.accessToken}`,
//       },
//     });

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "Failed to fetch profile" },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const session = await getSession();
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await params;
//     const body = await request.json();

//     const response = await fetch(`${API_URL}/profile/${id}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${session.accessToken}`,
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: "Failed to update profile" },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
