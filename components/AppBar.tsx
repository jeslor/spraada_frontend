"use client";
import { signOut } from "@/lib/actions/Auth.actions";
import { Button } from "./ui/button";

const AppBar = () => {
  return (
    <div className="flex justify-between max-w-[1200px] w-full px-4 py-2 items-center border-b border-gray-300 fixed top-0 bg-white z-10">
      <div className="text-xl font-bold">Spraada</div>
      <Button className="spraada-primary-button " onClick={signOut}>
        Sign out
      </Button>
    </div>
  );
};

export default AppBar;
