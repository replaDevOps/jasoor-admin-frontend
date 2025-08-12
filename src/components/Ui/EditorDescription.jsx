import React, { useState, useEffect } from 'react';
import { Flex, Typography } from 'antd';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const { Title } = Typography
const EditorDescription = ({ descriptionData, onChange, label }) => {

    const [text, setText] = useState("");
    useEffect(() => {
        if (descriptionData) {
            setText(descriptionData);
        }
    }, [descriptionData]);

    const handleChange = (content) => {
        setText(content);
        onChange(content);
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
