"use client";

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface QuillEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (event: any) => void;
  onReady?: () => void;
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
  onReady,
  placeholder = "Start typing...",
  disabled = false,
  error = false,
  className,
  minHeight = "150px",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isInternalChange = useRef(false);
  const isReadyRef = useRef(false);
  const onChangeRef = useRef(onChange);
  const onBlurRef = useRef(onBlur);
  const onReadyRef = useRef(onReady);

  /**
   * Use Quill's own clipboard parser instead of direct innerHTML assignment.
   * This correctly handles Quill 2.x internal formats (data-list, ql-ui spans, etc.)
   * and works reliably in production builds.
   */
  const setQuillHTML = (quill: Quill, html: string) => {
    if (!html || html.trim() === "") {
      quill.setContents([], "silent");
      return;
    }
    const delta = quill.clipboard.convert({ html });
    quill.setContents(delta, "silent");
  };

  // Keep refs updated with latest callbacks
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onBlurRef.current = onBlur;
  }, [onBlur]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Initialize Quill editor once
  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

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

    quillRef.current.on("text-change", () => {
      if (quillRef.current && !isInternalChange.current) {
        // getSemanticHTML() returns clean HTML without Quill's internal ql-ui spans
        const html = quillRef.current.getSemanticHTML();
        const cleanHtml =
          html === "<p><br></p>" || html.trim() === "" ? "" : html;
        onChangeRef.current?.(cleanHtml);
      }
    });

    quillRef.current.root.addEventListener("blur", (event) => {
      onBlurRef.current?.(event);
    });

    // Set initial value through Quill's clipboard API (production-safe)
    if (value) {
      setQuillHTML(quillRef.current, value);
    }

    isReadyRef.current = true;

    // Notify parent after DOM is fully painted
    requestAnimationFrame(() => {
      onReadyRef.current?.();
    });

    return () => {
      quillRef.current = null;
      isReadyRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync external value changes after editor is ready
  useEffect(() => {
    if (!quillRef.current || !isReadyRef.current) return;

    const currentHtml = quillRef.current.getSemanticHTML();
    const normalizedCurrent =
      currentHtml === "<p><br></p>" ? "" : currentHtml.trim();
    const normalizedValue = value ? value.trim() : "";

    if (normalizedValue !== normalizedCurrent) {
      setQuillHTML(quillRef.current, normalizedValue);
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
