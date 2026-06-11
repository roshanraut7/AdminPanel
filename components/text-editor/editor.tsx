"use client";

import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type RichTextValue = {
  html: string;
  text: string;
  json: unknown;
};

type AdminRichTextEditorProps = {
  value: string;
  onChange: (value: RichTextValue) => void;
  placeholder?: string;
};

export function AdminRichTextEditor({
  value,
  onChange,
  placeholder = "Write your post content...",
}: AdminRichTextEditorProps) {
  const [characterCount, setCharacterCount] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      CharacterCount,
    ],
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] w-full px-5 py-4 text-sm leading-7 text-foreground outline-none focus:outline-none",
      },
    },
    onCreate: ({ editor }) => {
      setCharacterCount(editor.storage.characterCount.characters());
    },
    onUpdate: ({ editor }) => {
      setCharacterCount(editor.storage.characterCount.characters());

      onChange({
        html: editor.getHTML(),
        text: editor.getText(),
        json: editor.getJSON(),
      });
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.getHTML();

    if (value !== currentHtml) {
      editor.commands.setContent(value || "<p></p>", {
        emitUpdate: false,
      });

      setCharacterCount(editor.storage.characterCount.characters());
    }
  }, [editor, value]);

  const setLink = () => {
    if (!editor) return;

    const currentUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", currentUrl ?? "https://");

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) {
    return (
      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 rounded-t-2xl border border-border bg-muted/40 p-2">
        <Button
          type="button"
          size="icon"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          className="size-9 rounded-xl"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          className="size-9 rounded-xl"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          className="size-9 rounded-xl"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="size-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          size="icon"
          variant={
            editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"
          }
          className="size-9 rounded-xl"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="size-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={
            editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"
          }
          className="size-9 rounded-xl"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="size-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          size="icon"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          className="size-9 rounded-xl"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          className="size-9 rounded-xl"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          className="size-9 rounded-xl"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button
          type="button"
          size="icon"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          className="size-9 rounded-xl"
          onClick={setLink}
        >
          <Link2 className="size-4" />
        </Button>

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-9 rounded-xl"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 className="size-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-9 rounded-xl"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 className="size-4" />
          </Button>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="border-x border-border bg-background [&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-primary [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted-foreground [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6"
      />

      <div className="flex items-center justify-between rounded-b-2xl border border-border bg-muted/30 px-4 py-2">
        <p className="text-xs text-muted-foreground">Rich text post editor</p>

        <p className="text-xs font-medium text-muted-foreground">
          {characterCount} characters
        </p>
      </div>
    </>
  );
}