import { useState, useEffect, useRef } from 'react';
import { Flex, Typography } from 'antd';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const { Title } = Typography
const EditorDescription = ({ descriptionData, onChange, label, onEditorInit  }) => {

    const [text, setText] = useState("");
    const quillRef = useRef(null);
    
    useEffect(() => {
        if (descriptionData) {
            setText(descriptionData);
        }
    }, [descriptionData]);


    useEffect(() => {
        if (quillRef.current && onEditorInit) {
            const editor = quillRef.current.getEditor();
            onEditorInit(editor);
        }
    }, [onEditorInit]);

    const handleChange = (value) => {
        setText(value);
        onChange(value);
    };

    var toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean']
    ];

    return (
        <Flex vertical gap={5}>
            {
                label && 
                <Title level={5} className='m-0 fw-500'>
                    {label}
                </Title>
            }
            <ReactQuill
                ref={quillRef ? quillRef : null}
                theme="snow"
                value={text}
                onChange={handleChange}
                modules={{
                    toolbar: toolbarOptions
                }}
            />
        </Flex>
    );
}

export { EditorDescription };
