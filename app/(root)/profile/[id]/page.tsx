import customFetch from "@/lib/customFetch";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const response = await customFetch(
    `${process.env.BACKEND_API_URL}/profile/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      redirect("/signin");
    }
    throw new Error(response.error || "Failed to fetch profile data");
  }
  const myprofileData = response.data;
  console.log("myprofileData", myprofileData);
  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-2xl font-bold">Profile</h1>
    </div>
  );
};

export default page;
