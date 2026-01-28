import React from "react";
import { Icon } from "@iconify/react";

const MoreMessagesHereIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center my-4 select-none">
      <span className="block text-[10px] animate-pulse font-semibold mb-2">
        {" "}
        loading more messages...
      </span>
      <Icon
        icon="mdi:loading"
        className="text-primary-500 dark:text-primary-200 animate-spin"
        width={28}
        height={28}
      />
    </div>
  );
};

export default MoreMessagesHereIndicator;
