"use client";
import { signOut } from "@/lib/actions/Auth.actions";
import { Button } from "./ui/button";

const AppBar = () => {
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
        <Button className="spraada-primary-button " onClick={signOut}>
          Sign out
        </Button>
      </nav>
    </header>
  );
};

export default AppBar;
