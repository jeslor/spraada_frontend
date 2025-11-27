"use server";
import AppBar from "@/components/AppBar";
import { getSession } from "@/lib/session/session";

const page = async () => {
  const session = await getSession();
  console.log(session);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <AppBar />
      <h1 className="text-[40px] ">Welcome to Spraada!</h1>
    </div>
  );
};

export default page;
