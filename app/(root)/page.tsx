"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/Auth.actions";
import { deleteSession } from "@/lib/session/session";
import React from "react";

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Button className="spraada-primary-button " onClick={signOut}>
        Sign out
      </Button>
    </div>
  );
};

export default page;
