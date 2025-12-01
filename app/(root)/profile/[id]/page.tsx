import customFetch from "@/lib/customFetch";
import { getSession } from "@/lib/session/session";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await getSession();
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

  if (!response || response instanceof String) {
    throw new Error("Failed to fetch profile data");
  }
  const myprofileData = await response.json();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-2xl font-bold">Profile</h1>
    </div>
  );
};

export default page;
