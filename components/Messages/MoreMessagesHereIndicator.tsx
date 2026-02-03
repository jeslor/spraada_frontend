import React, { Ref } from "react";
import { Icon } from "@iconify/react";
import { useMessageStore } from "@/store";
import { SpraadaButton } from "../ui/SpraadaButton";

type MoreMessagesHereIndicatorProps = {
  ref?: React.PropsWithoutRef<{}> & React.RefAttributes<HTMLDivElement>;
  handleLoadMoreMessages: () => void;
};

const MoreMessagesHereIndicator = ({
  ref,
  handleLoadMoreMessages,
}: MoreMessagesHereIndicatorProps) => {
  const isFetchingOlderMessages = useMessageStore(
    (state) => state.isFetchingOlderMessages,
  );
  return (
    <>
      {isFetchingOlderMessages ? (
        <div className="flex flex-col items-center justify-center my-4 select-none">
          <Icon
            icon="mdi:loading"
            className="text-primary-500 dark:text-primary-200 animate-spin"
            width={28}
            height={28}
          />
        </div>
      ) : (
        <SpraadaButton
          onClick={handleLoadMoreMessages}
          //   ref={ref}
          className="mb-2 select-none w-fit mx-auto text-[10px] font-semibold bg-primary-600/20 text-primary-600 px-2 py-1 rounded-full hover:bg-primary-600/30 transition-colors"
        >
          Load more messages
        </SpraadaButton>
      )}
    </>
  );
};

export default MoreMessagesHereIndicator;
