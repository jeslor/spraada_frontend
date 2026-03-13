"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface QuillEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (event: any) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  minHeight?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value = "",
  onChange,
  onBlur,
  placeholder = "Start typing...",
  disabled = false,
  error = false,
  className,
  minHeight = "150px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isInternalChange = useRef(false);
  const onChangeRef = useRef(onChange);
  const onBlurRef = useRef(onBlur);

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);

  // Initialize Quill editor once
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder,
        readOnly: disabled,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            ["clean"],
          ],
        },
      });
      if (value) {
        isInternalChange.current = true;
        quillRef.current.root.innerHTML = value;
        isInternalChange.current = false;
      }

      quillRef.current.on("text-change", () => {
        if (quillRef.current && !isInternalChange.current) {
          const html = quillRef.current.root.innerHTML;
          const cleanHtml = html === "<p><br></p>" ? "" : html;
          onChangeRef.current?.(cleanHtml);
        }
      });

      // Handle blur
      quillRef.current.root.addEventListener("blur", (event) => {
        onBlurRef.current?.(event);
      });
    }
  }, [placeholder, disabled]);

  // Sync external value changes
  useEffect(() => {
    if (quillRef.current) {
      const currentHtml = quillRef.current.root.innerHTML;
      const normalizedCurrent =
        currentHtml === "<p><br></p>" ? "" : currentHtml;

      if (value !== normalizedCurrent) {
        isInternalChange.current = true;
        quillRef.current.root.innerHTML = value || "";
        isInternalChange.current = false;
      }
    }
  }, [value]);

  // Update disabled state
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!disabled);
    }
  }, [disabled]);

  return (
    <div
      className={cn(
        "quill-wrapper rounded-lg overflow-hidden border-2 transition-colors",
        error
          ? "border-red-500"
          : "border-primary-200 dark:border-primary-700 focus-within:border-primary-500",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      style={
        {
          "--quill-min-height": minHeight,
        } as React.CSSProperties
      }
    >
      <div ref={editorRef} />
      <style jsx global>{`
        .quill-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid oklch(0.9 0.002 198) !important;
          background: oklch(0.97 0.01 198);
          padding: 8px 12px !important;
        }

        .dark .quill-wrapper .ql-toolbar {
          background: oklch(0.2 0.02 198);
          border-bottom-color: oklch(0.3 0.03 198) !important;
        }

        .quill-wrapper .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 14px;
        }

        .quill-wrapper .ql-editor {
          min-height: var(--quill-min-height, 150px);
          padding: 12px 16px;
          color: oklch(0.28 0.04 198);
          background: white;
        }

        .dark .quill-wrapper .ql-editor {
          background: oklch(0.16 0.018 198);
          color: oklch(0.95 0.004 198);
        }

        .quill-wrapper .ql-editor.ql-blank::before {
          color: oklch(0.5 0.008 198);
          font-style: normal;
          left: 16px;
          right: 16px;
        }

        .dark .quill-wrapper .ql-editor.ql-blank::before {
          color: oklch(0.5 0.012 198);
        }

        .quill-wrapper .ql-toolbar .ql-stroke {
          stroke: oklch(0.5 0.008 198);
        }

        .quill-wrapper .ql-toolbar .ql-fill {
          fill: oklch(0.5 0.008 198);
        }

        .quill-wrapper .ql-toolbar .ql-picker {
          color: oklch(0.5 0.008 198);
        }

        .dark .quill-wrapper .ql-toolbar .ql-stroke {
          stroke: oklch(0.7 0.012 198);
        }

        .dark .quill-wrapper .ql-toolbar .ql-fill {
          fill: oklch(0.7 0.012 198);
        }

        .dark .quill-wrapper .ql-toolbar .ql-picker {
          color: oklch(0.7 0.012 198);
        }

        .quill-wrapper .ql-toolbar button:hover .ql-stroke,
        .quill-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: oklch(0.52 0.055 198);
        }

        .quill-wrapper .ql-toolbar button:hover .ql-fill,
        .quill-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: oklch(0.52 0.055 198);
        }

        .quill-wrapper .ql-toolbar .ql-picker-label:hover,
        .quill-wrapper .ql-toolbar .ql-picker-label.ql-active {
          color: oklch(0.52 0.055 198);
        }

        .dark .quill-wrapper .ql-toolbar button:hover .ql-stroke,
        .dark .quill-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: oklch(0.7 0.065 198);
        }

        .dark .quill-wrapper .ql-toolbar button:hover .ql-fill,
        .dark .quill-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: oklch(0.7 0.065 198);
        }

        .quill-wrapper .ql-toolbar .ql-picker-options {
          background: white;
          border: 1px solid oklch(0.9 0.002 198);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 4px;
        }

        .dark .quill-wrapper .ql-toolbar .ql-picker-options {
          background: oklch(0.2 0.02 198);
          border-color: oklch(0.3 0.03 198);
        }

        .quill-wrapper .ql-toolbar .ql-picker-item {
          padding: 4px 8px;
          border-radius: 4px;
        }

        .quill-wrapper .ql-toolbar .ql-picker-item:hover {
          background: oklch(0.97 0.01 198);
          color: oklch(0.52 0.055 198);
        }

        .dark .quill-wrapper .ql-toolbar .ql-picker-item:hover {
          background: oklch(0.25 0.02 198);
          color: oklch(0.7 0.065 198);
        }

        .quill-wrapper .ql-editor a {
          color: oklch(0.52 0.055 198);
        }

        .dark .quill-wrapper .ql-editor a {
          color: oklch(0.7 0.065 198);
        }

        .quill-wrapper .ql-snow .ql-tooltip {
          background: white;
          border: 1px solid oklch(0.9 0.002 198);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          color: oklch(0.28 0.04 198);
        }

        .dark .quill-wrapper .ql-snow .ql-tooltip {
          background: oklch(0.2 0.02 198);
          border-color: oklch(0.3 0.03 198);
          color: oklch(0.95 0.004 198);
        }

        .quill-wrapper .ql-snow .ql-tooltip input[type="text"] {
          border: 1px solid oklch(0.9 0.002 198);
          border-radius: 4px;
          padding: 4px 8px;
        }

        .dark .quill-wrapper .ql-snow .ql-tooltip input[type="text"] {
          background: oklch(0.16 0.018 198);
          border-color: oklch(0.3 0.03 198);
          color: oklch(0.95 0.004 198);
        }
      `}</style>
    </div>
  );
};

export default QuillEditor;
