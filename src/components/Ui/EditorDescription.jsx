import { useState, useEffect, useRef } from "react";
import { Flex, Typography } from "antd";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const { Title } = Typography;

// 1. Register the sizes
const Quill = ReactQuill.Quill;
const fontSizeArr = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
if (Quill) {
  const Size = Quill.import("attributors/style/size");
  Size.whitelist = fontSizeArr;
  Quill.register(Size, true);
}

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  [{ size: fontSizeArr }], // Added font size dropdown
  ["blockquote"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }], // This button allows users to toggle RTL manually
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["clean"],
];

const EditorDescription = ({
  descriptionData,
  onChange,
  label,
  onEditorInit,
}) => {
  const lang = localStorage.getItem("lang") || "en";
  const isArabic = lang.toLowerCase().startsWith("ar");

  const [value, setValue] = useState("");
  const quillRef = useRef(null);
  const isInitializedRef = useRef(false);
  const lastDescriptionDataRef = useRef("");

  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    if (editor && typeof onEditorInit === "function") {
      onEditorInit(editor);
    }
  }, [onEditorInit]);

  useEffect(() => {
    const html = descriptionData ?? "";
    if (isInitializedRef.current && lastDescriptionDataRef.current === html) {
      return;
    }

    lastDescriptionDataRef.current = html;
    const editor = quillRef.current?.getEditor?.();

    if (!html) {
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
      } catch {
        setValue(html);
      }
    } else {
      setValue(html);
    }
    isInitializedRef.current = true;
  }, [descriptionData]);

  const handleChange = (html) => {
    setValue(html);
    lastDescriptionDataRef.current = html;
    if (onChange) onChange(html);
  };

  return (
    <Flex vertical gap={5}>
      {label && (
        <Title level={5} className="m-0 fw-500">
          {label}
        </Title>
      )}
      <style>{`
        /* Force the editing area to respect the language direction */
        .ql-editor {
          direction: ${isArabic ? "rtl" : "ltr"};
          text-align: ${isArabic ? "right" : "left"};
          font-size: 16px; /* SET YOUR DEFAULT FONT SIZE HERE */
          min-height: 150px;
        }
        /* Ensure the cursor is on the correct side for empty editor */
        .ql-editor.ql-blank::before {
          left: ${isArabic ? "auto" : "15px"};
          right: ${isArabic ? "15px" : "auto"};
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={{ toolbar: toolbarOptions }}
      />
    </Flex>
  );
};

export { EditorDescription };
