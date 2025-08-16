'use client';
import React, { useEffect, useState } from "react";
import 'quill/dist/quill.snow.css';
import { useQuill } from 'react-quilljs';
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from '@/app/hooks/useStore';

const TextEditorSummary = (props: any) => {

  const [summary, setSummery] = useState<{ defaultValue: string, sendDate: (data: any) => void } | null>(props)
  const theme = 'snow';

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],

      [{ align: [] }],

      [{ list: 'ordered' }, { list: 'bullet' }],

      [{ indent: '-1' }, { indent: '+1' }],

      [{ 'direction': 'rtl' }],

      [{ size: ['small', false, 'large', 'huge'] }],

      [{ 'font': [] }],

      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ['link', 'image', 'video'],

      [{ color: [] }, { background: [] }],

    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'align', 'list', 'indent',
    'size', 'header',
    'link', 'image', 'video',
    'color', 'background',
    'direction', 'font'
  ];

  const { quill, quillRef } = useQuill({ theme, modules, formats });

  useEffect(() => {
    summary != null && quill?.clipboard.dangerouslyPasteHTML(summary!.defaultValue)
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        setSummery((state: any) => ({
          ...state,
          sendDate: (data: any) => {
            state.sendDate({
              html: quill.root.innerHTML,
              nonHtml: quill.getText()
            });
          }
        }))
      });
    }
  }, [summary, quill]);

  const themeMode = useStore(themeStore, (state) => state)
  return (
    <div>
      <div ref={quillRef} className={`${!themeMode ||themeMode?.stateMode ? 'lightText' : 'darkText'}`} />
    </div>
  );
};
export default TextEditorSummary; 
