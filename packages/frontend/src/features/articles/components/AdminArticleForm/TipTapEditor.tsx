// @ts-nocheck
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon, Heading1, Heading2, List, ListOrdered, Video } from 'lucide-react';
import { useCallback } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}
interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
}

const ToolbarButton = ({ onClick, isActive, children }: ToolbarButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded-lg font-bold transition-colors ${isActive ? 'bg-[#1a241b] text-[#f7ebc6]' : 'text-[#1a241b] hover:bg-[#d4c38d]'}`}
  >
    {children}
  </button>
);
export function TipTapEditor({ content, onChange, onImageUpload }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'เริ่มเขียนเนื้อหาบทความที่นี่...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[300px] outline-none text-[#1a241b] p-4 bg-[#e8d7a5] border-t-0 border border-[#d4c38d] rounded-b-xl',
      },
    },
  });

  const addImage = useCallback(async () => {
    if (!onImageUpload) {
      const url = window.prompt('URL รูปภาพ:');
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && editor) {
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch (err) {
          console.error('Image upload failed', err);
          alert('อัปโหลดรูปไม่สำเร็จ');
        }
      }
    };
    input.click();
  }, [editor, onImageUpload]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL:', previousUrl);
    
    if (url === null) return; // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addYoutubeVideo = useCallback(() => {
    const url = prompt('วางลิงก์ YouTube ที่นี่:');
    if (url && editor) {
      // @ts-expect-error tiptap type issue
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="w-full flex flex-col rounded-xl overflow-hidden shadow-sm">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#f7ebc6] border border-[#d4c38d] rounded-t-xl">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
          <ListOrdered size={18} />
        </ToolbarButton>
        <div className="w-px h-6 bg-[#d4c38d] mx-1" />
        <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
          <LinkIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage}>
          <ImageIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={addYoutubeVideo}>
          <Video size={18} />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
