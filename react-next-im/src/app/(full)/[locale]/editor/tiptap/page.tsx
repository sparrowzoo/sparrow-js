"use client";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageUp,
  Italic,
  Lightbulb,
  Strikethrough,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  const addImage = () => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };
  const ACTIVE_CLASS_NAME = "bg-foreground text-background";
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 }) ? ACTIVE_CLASS_NAME : ""
        }
      >
        <Heading1 className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 }) ? ACTIVE_CLASS_NAME : ""
        }
      >
        <Heading2 className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 }) ? ACTIVE_CLASS_NAME : ""
        }
      >
        <Heading3 className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? ACTIVE_CLASS_NAME : ""}
      >
        <Bold className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? ACTIVE_CLASS_NAME : ""}
      >
        <Italic className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? ACTIVE_CLASS_NAME : ""}
      >
        <Strikethrough className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive("highlight") ? ACTIVE_CLASS_NAME : ""}
      >
        <Lightbulb className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" }) ? ACTIVE_CLASS_NAME : ""
        }
      >
        <AlignLeft className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={
          editor.isActive({ textAlign: "center" }) ? ACTIVE_CLASS_NAME : ""
        }
      >
        <AlignCenter className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" }) ? ACTIVE_CLASS_NAME : ""
        }
      >
        <AlignRight className={"cursor-pointer"} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={
          editor.isActive({ textAlign: "justify" }) ? ACTIVE_CLASS_NAME : ""
        }
      >
        <AlignJustify className={"cursor-pointer"} />
      </button>

      <button onClick={addImage}>
        <ImageUp className={"cursor-pointer"} />
      </button>
    </div>
  );
};

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Image,
    ],
    content: `<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>`,
  });
  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}
