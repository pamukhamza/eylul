"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useMemo } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export default function Editor({ value, onChange }: Props) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({ placeholder: "Bugün ne yazalım?" }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    []
  );

  const editor = useEditor({
    extensions,
    content: value || "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "ProseMirror prose-eylul max-w-none px-4 py-5 sm:px-6 sm:py-6 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-6 text-stone-400">
        Editör yükleniyor…
      </div>
    );
  }

  function setLink() {
    const url = window.prompt("Bağlantı URL:");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt("Görsel URL:");
    if (url) editor!.chain().focus().setImage({ src: url }).run();
  }

  const btn =
    "p-2 rounded-md hover:bg-stone-100 text-stone-700 data-[active=true]:bg-amber-100 data-[active=true]:text-amber-900";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-stone-200 bg-stone-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive("bold")}
          className={btn}
          title="Kalın"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive("italic")}
          className={btn}
          title="İtalik"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          data-active={editor.isActive("strike")}
          className={btn}
          title="Üstü çizili"
        >
          <Strikethrough size={16} />
        </button>
        <span className="w-px bg-stone-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          data-active={editor.isActive("heading", { level: 1 })}
          className={btn}
          title="Başlık 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          data-active={editor.isActive("heading", { level: 2 })}
          className={btn}
          title="Başlık 2"
        >
          <Heading2 size={16} />
        </button>
        <span className="w-px bg-stone-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive("bulletList")}
          className={btn}
          title="Madde işaretli liste"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive("orderedList")}
          className={btn}
          title="Numaralı liste"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          data-active={editor.isActive("blockquote")}
          className={btn}
          title="Alıntı"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          data-active={editor.isActive("codeBlock")}
          className={btn}
          title="Kod bloğu"
        >
          <Code size={16} />
        </button>
        <span className="w-px bg-stone-200 mx-1" />
        <button type="button" onClick={setLink} className={btn} title="Bağlantı">
          <LinkIcon size={16} />
        </button>
        <button type="button" onClick={addImage} className={btn} title="Görsel">
          <ImageIcon size={16} />
        </button>
        <span className="w-px bg-stone-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          data-active={editor.isActive({ textAlign: "left" })}
          className={btn}
          title="Sola hizala"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          data-active={editor.isActive({ textAlign: "center" })}
          className={btn}
          title="Ortala"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          data-active={editor.isActive({ textAlign: "right" })}
          className={btn}
          title="Sağa hizala"
        >
          <AlignRight size={16} />
        </button>
        <span className="w-px bg-stone-200 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={btn}
          title="Geri al"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={btn}
          title="İleri al"
        >
          <Redo2 size={16} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
