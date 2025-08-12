import React, { useState } from 'react';
import { PlusOutlined, DeleteOutlined, MinusCircleFilled } from '@ant-design/icons';
import { message as Mesage, Upload, Form, Typography, Flex, Button } from 'antd';
const { Dragger } = Upload;

const SingleFileUpload = ({ multiple = false, name, required, message, form, label, title,onUpload }) => {
  const [fileList, setFileList] = useState([]);

  const handleChange = async (info) => {
    let newFileList = [...info.fileList];

    if (!multiple) {
      newFileList = newFileList.slice(-1);
    }

    setFileList(newFileList);

    const files = multiple ? newFileList.map(file => file.originFileObj) : newFileList[0]?.originFileObj || null;
    form.setFieldsValue({ [name]: files });
    try {
      if (multiple) {
        // upload all files in parallel
        await Promise.all(files.map(file => onUpload(file)));
      } else {
console.log("files",files)
        await onUpload(files);
      }
      // You can show success message or update UI here if needed
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Upload failed");
    }
  };

  const handleRemove = (file) => {
    const newFileList = fileList.filter(f => f.uid !== file.uid);
    setFileList(newFileList);
    
    const files = multiple ? newFileList.map(f => f.originFileObj) : null;
    form.setFieldsValue({ [name]: files || null });
  };

  return (
    <div className='w-100'>
      <Form.Item
        name={name}
        label={label}
        rules={[
          {
            required,
            message,
          },
        ]}
        className="m-0 w-100"
      >
        {(multiple || fileList.length === 0) && (
          <Dragger
            name="file"
            multiple={multiple}
            showUploadList={false}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => {
                onSuccess("ok");
              }, 1000);
            }}
            fileList={fileList}
            onChange={handleChange}
            onDrop={(e) => console.log('Dropped files', e.dataTransfer.files)}
            className='upload-d'
          >
            {fileList.length === 0 || multiple ? (
              <Flex vertical align='center' justify='center' className='upload-flex'>
                <PlusOutlined style={{ fontSize: 16 }} />
                <p className="ant-upload p-0 m-0 text-black">{title}</p>
              </Flex>
            ) : null}
          </Dragger>
        )}
        {fileList.length > 0 && (
          <div className="w-100">
            {fileList.map(file => (
              <Flex key={file.uid} justify='space-between' className="w-100 p-2 mt-1" style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
                <Flex align='flex-start' gap={10} className='w-100'>
                  <img src="/assets/icons/file.png" alt="file-icon" width={24} className='pt-1' />
                  <Flex vertical align='flex-start'>
                    <Typography.Text strong className='text-gray'>{file.name.slice(0, 20)}{file.name.length > 20 ? '...' : ''}</Typography.Text>
                    <Typography.Text className='fs-12'>
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </Typography.Text>
                  </Flex>
                </Flex>
                <MinusCircleFilled 
                  className="text-red cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(file);
                  }}
                />
              </Flex>
            ))}
          </div>
        )}
      </Form.Item>
    </div>
  );
};

export { SingleFileUpload };