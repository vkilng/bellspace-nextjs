/* eslint-disable @next/next/no-img-element */
import { useCallback, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder'
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image"

import ToggleButton from '@mui/material/ToggleButton';
import { styled } from '@mui/material/styles';
import TextB from "@phosphor-icons/react/TextB";
import TextItalic from "@phosphor-icons/react/TextItalic";
import TextStrikethrough from "@phosphor-icons/react/TextStrikethrough";
import SuperscriptOutlinedIcon from '@mui/icons-material/SuperscriptOutlined';
import LinkIcon from "@phosphor-icons/react/Link";
import Code from "@phosphor-icons/react/Code";
import CodeBlock from "@phosphor-icons/react/CodeBlock";
import Quotes from "@phosphor-icons/react/Quotes";
import ListBullets from "@phosphor-icons/react/ListBullets";
import ListNumbers from "@phosphor-icons/react/ListNumbers";
import TextHOne from "@phosphor-icons/react/dist/icons/TextHOne";
import TextHTwo from "@phosphor-icons/react/dist/icons/TextHTwo";
import TextHThree from "@phosphor-icons/react/dist/icons/TextHThree";
import ImageIcon from "@phosphor-icons/react/dist/icons/Image";
import Broom from "@phosphor-icons/react/dist/icons/Broom";
import Trash from "@phosphor-icons/react/dist/icons/Trash";

import Carousel from 'react-material-ui-carousel'
import { v4 as uuidv4 } from "uuid";
import IconButton from '@mui/material/IconButton'
import { useThemeStore } from "@/lib/store";


export default function TiptapEditor({ options: {
  type,
  functions: [
    handleSetContent,
    handleSetImageFiles
  ],
} }) {
  const mode = useThemeStore((state) => state.theme);
  const MenuButton = styled(ToggleButton)(mode === 'light'
    ? {
      border: 0,
      backgroundColor: '#fafaf9',
      '&.Mui-selected': { backgroundColor: '#a8a29e', }
    }
    : {
      border: 0,
      backgroundColor: '#3f3f46',
      '&:hover': { backgroundColor: '#27272a' },
      '&.Mui-selected': { backgroundColor: '#09090b', }
    })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Superscript,
      Placeholder.configure({
        placeholder: type === 'comment' ? 'What are your thoughts ?' : 'Text (optional)',
      }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true })
    ],
    autofocus: (type === 'comment' ? false : true),
    editorProps: {
      attributes: {
        class: 'm-5 focus:outline-none',
      }
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      const body = JSON.stringify(json);
      type === 'post' ? handleSetContent(body) : handleSetContent(body, editor.isEmpty);
    },
  });

  const [files, setFiles] = useState([]);
  const [urlList, setUrlList] = useState([]);
  const addImages = (e) => {
    const newFiles = Array.from(files);
    Array.from(e.target.files).map(newFile => newFiles.push(newFile))
    setFiles(newFiles);
  }

  // helper function that return a promise upon reading file
  const readAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onerror = reject
      fr.onload = function () {
        resolve(fr.result)
      }
      fr.readAsDataURL(file)
    })
  }

  useEffect(() => {
    (async () => {
      try {
        const urls = await Promise.all(Array.from(files).map(readAsDataURL));
        setUrlList(urls);
      } catch (error) {
        console.error(error);
      }
    })();
    handleSetImageFiles(files);
  }, [files])

  const deleteFile = (index) => {
    const duplicateFilesArray = Array.from(files);
    duplicateFilesArray.splice(index, 1);
    // if (duplicateFilesArray.length === 0) 
    setFiles(duplicateFilesArray)
  }

  const toggleLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  const buttonSize = window.screen.width > 768 ? 16 : 10;

  if (editor) return (
    <div className="border-2 border-solid border-stone-300 rounded-md w-full focus-within:border-1 focus-within:border-stone-400 bg-white dark:bg-zinc-950 dark:text-white dark:border-zinc-800">
      <div className="p-2 flex gap-x-5 gap-y-2 flex-wrap bg-stone-100 rounded-t-sm dark:bg-zinc-800 dark:text-white">
        <div className="flex gap-1">
          <MenuButton size="small" selected={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()} value="check"
          >
            <TextB size={buttonSize} />
          </MenuButton>
          <MenuButton size="small" selected={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()} value="check"
          >
            <TextItalic size={buttonSize} />
          </MenuButton>
          <MenuButton size="small" selected={editor.isActive('strike')}
            onClick={() => editor.chain().focus().toggleStrike().run()} value="check"
          >
            <TextStrikethrough size={buttonSize} />
          </MenuButton>
        </div>
        <div className="flex gap-1">
          <MenuButton size="small" selected={editor.isActive('superscript')}
            onClick={() => editor.chain().focus().toggleSuperscript().run()} value="check"
          >
            <SuperscriptOutlinedIcon sx={{ fontSize: buttonSize }} />
          </MenuButton>
          <MenuButton size="small" selected={editor.isActive('link')}
            onClick={toggleLink} value="check"
          >
            <LinkIcon size={buttonSize} />
          </MenuButton>
        </div>
        <div className="flex gap-1">
          <MenuButton size="small" selected={editor.isActive('code')}
            onClick={() => editor.chain().focus().toggleCode().run()} value="check"
          >
            <Code size={buttonSize} />
          </MenuButton>
          <MenuButton size="small" selected={editor.isActive('codeBlock')}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()} value="check"
          >
            <CodeBlock size={buttonSize} />
          </MenuButton>
          <MenuButton size="small" selected={editor.isActive('blockquote')}
            onClick={() => editor.chain().focus().toggleBlockquote().run()} value="check"
          >
            <Quotes size={buttonSize} />
          </MenuButton>
        </div>
        <div className="flex gap-1">
          <MenuButton size="small" selected={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()} value="check"
          >
            <ListBullets size={buttonSize} />
          </MenuButton>
          <MenuButton size="small" selected={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()} value="check"
          >
            <ListNumbers size={buttonSize} />
          </MenuButton>
        </div>
        <div className="flex gap-1">
          <MenuButton size="small" selected={editor.isActive('heading', { level: 1 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} value="check"
          >
            <TextHOne size={buttonSize} />
          </MenuButton>
          <MenuButton size="small" selected={editor.isActive('heading', { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} value="check"
          >
            <TextHTwo size={buttonSize} />
          </MenuButton>
          <MenuButton size="small" selected={editor.isActive('heading', { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} value="check"
          >
            <TextHThree size={buttonSize} />
          </MenuButton>
        </div>
        <div className="flex gap-1">
          {type === 'post' && <MenuButton size="small" value="check"
            onClick={() => document.querySelector('#file-input-label').click()}
          >
            <ImageIcon size={buttonSize} />
          </MenuButton>}
          <MenuButton size="small" value="check"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          >
            <Broom size={buttonSize} />
          </MenuButton>
        </div>
      </div>
      <div>
        {type === 'post' &&
          <label id="file-input-label" htmlFor="editor-file-input" className="hidden">
            <input type="file" id="editor-file-input" hidden accept=".png,.jpg,.jpeg" multiple
              onClick={(e) => e.target.value = null} onChange={addImages}
            />
          </label>
        }
        {urlList.length > 0 &&
          <div className="m-4 p-5 h-40">
            <Carousel autoPlay={false} navButtonsAlwaysVisible={true} fullHeightHover={false}>
              {
                urlList.map((url, index) => {
                  return (
                    <div key={uuidv4()} className="flex items-center justify-center bg-stone-900">
                      <IconButton onClick={() => deleteFile(index)} color="error" className="absolute left-0 top-0">
                        <Trash size={buttonSize} weight="fill" />
                      </IconButton>
                      <img src={url ?? '#'} alt='error uploading image' height={160} />
                    </div>
                  )
                })
              }
            </Carousel>
          </div>
        }
        <EditorContent editor={editor} />
      </div>
    </div>
  )

  return <>Loading editor ...</>;
}
