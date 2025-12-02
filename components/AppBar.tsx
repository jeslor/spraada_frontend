"use client";
import { Session } from "@/lib/session/session";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const AppBar = ({ session }: { session: Session | null }) => {
  const Router = useRouter();
  const handleSignOut = async () => {
    const response = await fetch("/api/auth/signout", { method: "GET" });
    if (!response.ok) {
      console.error("Sign out failed:", await response.text());
      return;
    }
    window.location.href = "/signin";
  };

  return (
    <header className="w-full fixed top-0 flex justify-center ">
      <nav className="flex justify-around max-w-[1200px] w-full px-4 py-2 items-center border-b border-gray-300  bg-white z-10">
        <div className="text-xl font-bold">Spraada</div>
        <ul className="flex justify-between gap-x-5">
          <li className="">
            <a href="/">Home</a>
          </li>
          <li className="">
            <a href="/profile/1">Profile</a>
          </li>
          <li className="">
            <a href="/settings">Settings</a>
          </li>
        </ul>
        {session ? (
          <Button className="spraada-primary-button " onClick={handleSignOut}>
            Sign out
          </Button>
        ) : (
          <Button
            className="spraada-primary-button "
            onClick={() => Router.push("/signin")}
          >
            Sign in
          </Button>
        )}
      </nav>
    </header>
  );
};

export default AppBar;
