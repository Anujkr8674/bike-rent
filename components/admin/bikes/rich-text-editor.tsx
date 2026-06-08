"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  Bold,
  Code2,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
  className?: string;
};

function runCommand(command: string, value?: string) {
  if (typeof document === "undefined") return;
  document.execCommand(command, false, value);
}

function emitCurrentHtml(ref: RefObject<HTMLDivElement | null>, onChange: (value: string) => void) {
  onChange(ref.current?.innerHTML || "");
}

export function RichTextEditor({ label, value, onChange, placeholder, helper, className }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if ((editor.innerHTML || "") !== value) {
      editor.innerHTML = value || "<p><br /></p>";
    }
  }, [value]);

  const apply = (command: string, commandValue?: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    runCommand(command, commandValue);
    emitCurrentHtml(editorRef, onChange);
  };

  const insertLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    apply("createLink", url);
  };

  const insertImage = () => {
    const url = window.prompt("Enter image URL");
    if (!url) return;
    apply("insertImage", url);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          {helper ? <p className="text-xs text-zinc-400">{helper}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => apply("formatBlock", "h2")}>
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => apply("formatBlock", "p")}>
            <Type className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => apply("bold")}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => apply("italic")}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => apply("underline")}>
            <Underline className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => apply("insertUnorderedList")}>
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => apply("insertOrderedList")}>
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={insertLink}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={insertImage}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => apply("undo")}>
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => apply("redo")}>
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => apply("formatBlock", "pre")}>
            <Code2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#111111] shadow-xl shadow-black/40">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="min-h-[180px] rounded-2xl px-4 py-3 text-sm leading-7 text-zinc-200 outline-none"
          onInput={() => emitCurrentHtml(editorRef, onChange)}
          onBlur={() => emitCurrentHtml(editorRef, onChange)}
          data-placeholder={placeholder || "Write content here..."}
          style={{ whiteSpace: "normal" }}
        />
      </div>
    </div>
  );
}
