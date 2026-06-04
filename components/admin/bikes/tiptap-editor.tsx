"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Blockquote from "@tiptap/extension-blockquote";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TiptapEditorProps = {
  label: string;
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export function TiptapEditor({ label, value, onChange, placeholder, className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        link: false,
        underline: false,
      }),
      Blockquote,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "Write here..." }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap-editor-body rich-html-content min-h-[180px] max-w-none px-4 py-3 text-sm focus:outline-none [&_h2]:text-xl [&_h2]:font-bold [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li>p]:m-0 [&_li>p]:inline [&_p]:my-3",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.isFocused) return;
    const next = value?.trim() ? value : "<p></p>";
    const current = editor.getHTML();
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const toolBtn = (active: boolean, onClick: () => void, children: ReactNode, title: string) => (
    <Button
      type="button"
      variant="outline"
      size="sm"
      title={title}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn("h-8 w-8 p-0", active && "border-[#FF653F]/40 bg-[#FF653F]/10 text-[#FF653F]")}
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-semibold text-zinc-900">{label}</p>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="flex flex-wrap gap-1 border-b border-zinc-100 bg-zinc-50 p-2">
          {toolBtn(editor.isActive("heading", { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), <Heading1 className="h-4 w-4" />, "H1")}
          {toolBtn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="h-4 w-4" />, "H2")}
          {toolBtn(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="h-4 w-4" />, "H3")}
          {toolBtn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold className="h-4 w-4" />, "Bold")}
          {toolBtn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic className="h-4 w-4" />, "Italic")}
          {toolBtn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="h-4 w-4" />, "Underline")}
          {toolBtn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="h-4 w-4" />, "Bullet list")}
          {toolBtn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="h-4 w-4" />, "Ordered list")}
          {toolBtn(editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run(), <AlignLeft className="h-4 w-4" />, "Align left")}
          {toolBtn(editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run(), <AlignCenter className="h-4 w-4" />, "Align center")}
          {toolBtn(editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run(), <AlignRight className="h-4 w-4" />, "Align right")}
          {toolBtn(editor.isActive("link"), setLink, <LinkIcon className="h-4 w-4" />, "Link")}
          {toolBtn(false, addImage, <ImageIcon className="h-4 w-4" />, "Image")}
          {toolBtn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="h-4 w-4" />, "Quote")}
          {toolBtn(editor.isActive("codeBlock"), () => editor.chain().focus().toggleCodeBlock().run(), <Code2 className="h-4 w-4" />, "Code")}
          {toolBtn(false, () => editor.chain().focus().undo().run(), <Undo2 className="h-4 w-4" />, "Undo")}
          {toolBtn(false, () => editor.chain().focus().redo().run(), <Redo2 className="h-4 w-4" />, "Redo")}
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
