import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Superscript from "@tiptap/extension-superscript";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

export default function TitapViewer({ content }) {
  const commentContent = useEditor({
    content: JSON.parse(content),
    editable: false,
    extensions: [
      StarterKit,
      Superscript,
      Placeholder.configure({
        placeholder: 'Text (optional)',
      }),
      Link.configure({ openOnClick: true }),
    ],
  })

  return <EditorContent editor={commentContent} />;
}