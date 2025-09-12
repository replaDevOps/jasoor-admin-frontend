import React, { useState } from 'react'
import { Card, Flex, Form, Image, Tooltip, Typography } from 'antd'
import { ModuleTopHeading } from '../../PageComponents'
import { SingleFileUpload } from '../../Forms';
import imageCompression from 'browser-image-compression';

const { Title, Text } = Typography
const UploadSupportDocStep = ({ data, setData }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  const uploadFileToServer = async (file) => {
    console.log("get file file",file)
    setUploading(true);
    try {
      let compressedFile = file;

      if (file.type.startsWith('image/')) {
        compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      }

      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await fetch('https://220.152.66.148.host.secureserver.net/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      return {
        fileName: data.fileName,
        fileType: data.fileType,
        filePath: data.fileUrl,
      };
    } catch (err) {
      console.error(err);
      message.error('Failed to upload file');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  // Single file upload handler for Commercial Registration (CR)
  const handleSingleFileUpload = async (file) => {
    try {
      const fileInfo = await uploadFileToServer(file);
      const updatedDocs = [...data.documents];
      updatedDocs[0] = {
        title: 'Commercial Registration (CR)',
        ...fileInfo,
      };
      setData((prev) => {
        const updated = { ...prev, documents: updatedDocs };
        return JSON.stringify(updated) !== JSON.stringify(prev) ? updated : prev;
      });
    } catch {
      // error handled in uploadFileToServer
    }
  };

  // Multiple files upload handler for Supporting Documents
  const handleMultipleFileUpload = async (files) => {
    try {
      // Upload all files in parallel
      const uploadedFiles = await Promise.all(files.map(uploadFileToServer));
      const otherDocs = uploadedFiles.map((fileInfo) => ({
        title: 'Supporting Document',
        ...fileInfo,
      }));

      setData((prev) => {
        const updated = {
          ...prev,
          documents: [
            data.documents[0], // keep CR at index 0 unchanged
            ...otherDocs,
          ],
        };
        return JSON.stringify(updated) !== JSON.stringify(prev) ? updated : prev;
      });
    } catch {
      // error handled in uploadFileToServer
    }
  };

  return (
    <>
      <Flex justify='space-between' className='mb-3' gap={5} wrap align='flex-start'>
        <Flex vertical gap={1}>
          <ModuleTopHeading level={4} name='Upload supporting documents' />
          <Text className='text-gray'>Verified data builds buyer confidence.</Text>
        </Flex>
        <Flex className='pill-round' gap={8} align='center'>
          <Image src="/assets/icons/info-b.png" preview={false} width={16} alt="info-icon" />
          <Text className='fs-12 text-sky'>For any query, contact us on +966 543 543 654</Text>
        </Flex>
      </Flex>

      <Form layout="vertical" form={form} requiredMark={false}>
        <Card className="bg-transparent radius-12 border-gray mb-3">
          <Flex vertical gap={5} className="w-100">
            <Flex vertical>
              <Title level={5} className="m-0 fw-500">
                Commercial Registration (CR)
              </Title>
              <Text className="text-gray">
                Accepted formats: PDF, JPG, PNG, DOCX. Max size: 10MB per file.
              </Text>
            </Flex>
            <Flex className="w-100">
              <SingleFileUpload
                form={form}
                name={'uploadcr'}
                title={'Upload'}
                onUpload={handleSingleFileUpload}
                uploading={uploading}
                multiple={false}
              />
            </Flex>
          </Flex>
        </Card>

        <Card className="bg-transparent radius-12 border-gray mb-3">
          <Flex vertical gap={5} className="w-100">
            <Flex vertical>
              <Title level={5} className="m-0 fw-500">
                Upload Other Supporting Documents{' '}
                <Tooltip title="Info">
                  <img src="/assets/icons/info-outline.png"  width={14} alt="info icon" />
                </Tooltip>
              </Title>
              <Text className="text-gray">
                Accepted formats: PDF, JPG, PNG, DOCX, XLSX. Max size: 10MB per file.
              </Text>
            </Flex>
            <Flex className="w-100">
              <SingleFileUpload
                form={form}
                name={'uploadmult'}
                title={'Upload'}
                onUpload={handleMultipleFileUpload}
                uploading={uploading}
                multiple={true}
              />
            </Flex>
          </Flex>
        </Card>
      </Form>
    </>
  );
};

export {UploadSupportDocStep}