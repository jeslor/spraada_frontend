import React, { Ref } from "react";
import { Icon } from "@iconify/react";

type MoreMessagesHereIndicatorProps = {
  ref?: React.PropsWithoutRef<{}> & React.RefAttributes<HTMLDivElement>;
  handleLoadMoreMessages: () => void;
};

const MoreMessagesHereIndicator = ({
  ref,
  handleLoadMoreMessages,
}: MoreMessagesHereIndicatorProps) => {
  return (
    <div
      onClick={handleLoadMoreMessages}
      //   ref={ref}
      className="flex flex-col items-center justify-center my-4 select-none"
    >
      <span className="block text-[10px] animate-pulse font-semibold mb-2 bg-primary-600/20 text-primary-600 px-2 py-1 rounded-full cursor-pointer">
        {" "}
        click to load more
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
