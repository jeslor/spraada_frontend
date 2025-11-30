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
  console.log(response);

  if (!response || response instanceof String) {
    throw new Error("Failed to fetch profile data");
  }
  const myprofileData = await response.json();
  console.log("profile page", myprofileData);

  return <div>page</div>;
};

export default page;
