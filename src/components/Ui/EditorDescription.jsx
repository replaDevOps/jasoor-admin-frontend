import { useState, useEffect, useRef } from "react";
import { Flex, Typography } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
// import DOMPurify from 'dompurify'; // optional: enable if you need sanitization

const { Title } = Typography;

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["clean"],
];

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "script",
  "direction",
  "color",
  "background",
  "align",
];

const EditorDescription = ({
  descriptionData,
  onChange,
  label,
  onEditorInit,
}) => {
  const lang = localStorage.getItem("lang") || "en";
  const isArabic = lang.toLowerCase().startsWith("ar");

  // value holds the HTML we pass to ReactQuill as controlled value
  const [value, setValue] = useState("");
  const quillRef = useRef(null);
  const isInitializedRef = useRef(false);
  const lastDescriptionDataRef = useRef("");

  // Keep editor instance available and call onEditorInit
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (editor && typeof onEditorInit === "function") {
      onEditorInit(editor);
    }
  }, [onEditorInit]);

  // Insert backend/html data into editor ONLY when descriptionData changes from external source
  // (not from user typing). This prevents infinite loops.
  useEffect(() => {
    const html = descriptionData ?? "";

    // Skip if this is the same data we already processed or if it came from user input
    if (isInitializedRef.current && lastDescriptionDataRef.current === html) {
      return;
    }

    lastDescriptionDataRef.current = html;
    const editor = quillRef.current?.getEditor?.();

    if (!html) {
      // clear editor
      if (editor && isInitializedRef.current) {
        editor.setContents([]);
      }
      setValue("");
      isInitializedRef.current = true;
      return;
    }

    if (editor) {
      try {
        editor.clipboard.dangerouslyPasteHTML(html);
        setValue(html);
      } catch (err) {
        setValue(html);
      }
    } else {
      setValue(html);
    }
    isInitializedRef.current = true;
  }, [descriptionData]);

  const handleChange = (html) => {
    setValue(html);
    lastDescriptionDataRef.current = html; // Track that this change came from user
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
          direction: isArabic ? "rtl" : "ltr",
          textAlign: isArabic ? "right" : "left",
        }}
      />
    </Flex>
  );
};

export { EditorDescription };
