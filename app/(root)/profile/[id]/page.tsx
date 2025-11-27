import { getSession } from "@/lib/session/session";

const page = async () => {
  const session = await getSession();
  console.log(session);

  const myprofile = await fetch(`${process.env.BACKEND_API_URL}/profile/1`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  }).then((res) => res.json());
  console.log("profile page", myprofile);

  return <div>page</div>;
};

export default page;
