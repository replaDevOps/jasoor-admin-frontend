import { useState, useEffect, useRef } from 'react';
import { Flex, Typography } from 'antd';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
// import DOMPurify from 'dompurify'; // optional: enable if you need sanitization

const { Title } = Typography;

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ['clean']
];

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 'script',
  'direction', 'color', 'background', 'align'
];

const EditorDescription = ({ descriptionData, onChange, label, onEditorInit }) => {
  const lang = localStorage.getItem('lang') || 'en';
  const isArabic = lang.toLowerCase().startsWith('ar');

  // value holds the HTML we pass to ReactQuill as controlled value
  const [value, setValue] = useState('');
  const quillRef = useRef(null);

  // Keep editor instance available and call onEditorInit
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (editor && typeof onEditorInit === 'function') {
      onEditorInit(editor);
    }
  }, [onEditorInit]);

  // Insert backend/html data into editor when descriptionData arrives or changes.
  // Use dangerouslyPasteHTML if editor exists (prevents Quill's default empty doc from winning).
  useEffect(() => {
    const html = descriptionData ?? '';
    const editor = quillRef.current?.getEditor?.();

    if (!html) {
      // clear editor
      if (editor) {
        editor.setContents([]);            // clears content
        setValue('');
      } else {
        setValue('');
      }
      return;
    }

    if (editor) {
      try {
        // optional sanitization:
        // const safeHtml = DOMPurify.sanitize(html);
        // editor.clipboard.dangerouslyPasteHTML(safeHtml);
        editor.clipboard.dangerouslyPasteHTML(html);
        setValue(html);
      } catch (err) {
        // fallback: set controlled value if paste fails
        setValue(html);
      }
    } else {
      // editor not ready yet — set value so when it mounts it uses this HTML
      setValue(html);
    }
  }, [descriptionData]);

  const handleChange = (html) => {
    setValue(html);
    if (onChange) onChange(html);
  };

  return (
    <Flex vertical gap={5}>
      {label && (
        <Title level={5} className="m-0 fw-500">
          {label}
        </Title>
      )}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={{ toolbar: toolbarOptions }}
        formats={formats}
        style={{
          direction: isArabic ? 'rtl' : 'ltr',
          textAlign: isArabic ? 'right' : 'left'
        }}
      />
    </Flex>
  );
};

export { EditorDescription };