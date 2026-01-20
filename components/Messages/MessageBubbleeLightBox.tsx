import { Message } from "@/store";
import { Icon } from "@iconify/react";

interface MessageBubbleeLightBoxProps {
  closeLightbox: () => void;
  msg: Message;
  lightboxIndex: number;
  nextImage: () => void;
  prevImage: () => void;
}

const MessageBubbleeLightBox = ({
  closeLightbox,
  msg,
  lightboxIndex,
  nextImage,
  prevImage,
}: MessageBubbleeLightBoxProps) => {
  console.log(msg);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={closeLightbox}
    >
      <div
        className="relative max-w-[600px] max-h-[80vh] flex items-center justify-center h-full w-full p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={msg.mediaFiles ? msg.mediaFiles[lightboxIndex].mediaUrl : ""}
          alt="media-large"
          className=" object-cover h-full rounded-xl shadow-2xl border-2 border-white/40 cursor-pointer"
        />
        <button
          className="absolute top-2 -right-2 bg-white/40 hover:bg-primary-200 bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl cursor-pointer hover:bg-opacity-80"
          onClick={closeLightbox}
          title="Close"
        >
          <Icon icon="ic:round-close" width={20} />
        </button>
        {msg.mediaFiles && msg.mediaFiles.length > 1 && lightboxIndex > 0 && (
          <button
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-primary-600 bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl hover:bg-opacity-80"
            onClick={prevImage}
            title="Previous"
          >
            &#8592;
          </button>
        )}
        {msg.mediaFiles &&
          msg.mediaFiles.length > 1 &&
          lightboxIndex < msg.mediaFiles.length - 1 && (
            <button
              className="absolute top-1/2 right-0 -translate-y-1/2 bg-primary-600 bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl hover:bg-opacity-80"
              onClick={nextImage}
              title="Next"
            >
              &#8594;
            </button>
          )}
      </div>
    </div>
  );
};

export default MessageBubbleeLightBox;
