"use client";

import { Icon } from "@iconify/react";
import { useEffect } from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemName: string;
  itemType?: string;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal = ({
  isOpen,
  itemName,
  itemType = "item",
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onConfirm();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {isDeleting && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-primary-900 p-6 rounded-lg shadow-lg flex items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 " />
            <span className="text-primary-900 dark:text-primary-100 font-medium">
              Deleting your tool...
            </span>
          </div>
        </div>
      )}
      <div
        className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={handleModalClick}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
            <Icon
              icon="solar:trash-bin-2-bold"
              className="text-primary-600"
              width={28}
            />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-primary-800 text-center mb-2">
          Delete {itemType}
        </h3>
        <p className="text-[13px] text-gray-500 text-center mb-6">
          Are you sure you want to delete your booking of{" "}
          <span className="font-bold text-primary-800">"{itemName}"</span>? This
          action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="spraada-btn-secondary flex-1 font-medium rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="spraada-btn-destructive flex-1"
          >
            {isDeleting ? (
              <>
                <Icon
                  icon="solar:refresh-bold"
                  className="animate-spin"
                  width={16}
                />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
