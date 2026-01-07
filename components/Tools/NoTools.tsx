"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SpraadaButton } from "../ui/SpraadaButton";
import { Icon } from "@iconify/react";

const NoTools = ({
  type,
}: {
  type: "owned" | "rented" | "borrowed" | "all";
}) => {
  const Router = useRouter();

  const emptyMessages = {
    owned: {
      icon: "solar:box-bold-duotone",
      title: "Your toolbox is empty",
      description: "Start by adding your first tool to share with others.",
      action: "Add Your First Tool",
    },
    rented: {
      icon: "solar:hand-money-bold-duotone",
      title: "No rentals yet",
      description: "Tools you rent out will appear here.",
      action: "Browse Tools",
    },
    borrowed: {
      icon: "solar:delivery-bold-duotone",
      title: "No borrowed tools",
      description: "Tools you borrow from others will appear here.",
      action: "Browse Tools",
    },
    all: {
      icon: "solar:box-bold-duotone",
      title: "No tools available",
      description: "There are currently no tools listed. Check back later!",
      action: "Browse Tools",
    },
  };

  const message = emptyMessages[type];

  return (
    <div className="mt-8 flex flex-col items-center justify-center py-16 px-4">
      <div className="p-4 bg-primary-100 dark:bg-primary-800 rounded-full mb-4">
        <Icon
          icon={message.icon}
          className="text-primary-400 dark:text-primary-500"
          width={48}
        />
      </div>
      <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-100">
        {message.title}
      </h3>
      <p className="text-primary-500 dark:text-primary-400 mt-1 text-center max-w-md">
        {message.description}
      </p>
      {type === "owned" ? (
        <SpraadaButton
          className="mt-6"
          onClick={() => {
            Router.push("/create");
          }}
        >
          <Icon icon="solar:add-square-bold" className="mr-2 text-[22px]" />
          {message.action}
        </SpraadaButton>
      ) : (
        <button
          className="mt-6 spraada-secondary-button"
          onClick={() => {
            Router.push("/toolbox");
          }}
        >
          {message.action}
        </button>
      )}
    </div>
  );
};

export default NoTools;
