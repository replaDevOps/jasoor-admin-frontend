import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Form, message, Row, Typography,Spin } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { MyInput, SingleFileUpload } from '../../../Forms'
import React, { useEffect, useState } from 'react'
import { EditorDescription } from '../../../Ui'
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_ARTICLE, UPDATE_ARTICLE } from '../../../../graphql/mutation/mutations';
import {GETARTICLE} from '../../../../graphql/query/queries'
import imageCompression from 'browser-image-compression';

const { Title, Text } = Typography
const AddArticle = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    
    const [ descriptionData, setDescriptionData ] = useState('')
    const [showImage, setShowImage] = useState(true);
    const [imageUrl, setImageUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

    // const detail = articleData.find((item) => item?.id === Number(id));

    const [createArticle, { loading: creating }] = useMutation(CREATE_ARTICLE);
    const [updateArticle, { loading: updating }] = useMutation(UPDATE_ARTICLE);
    const  {data, loading , error} = useQuery(GETARTICLE,{
        variables: { getArticleId: id },
    });
    const detail = {
            id:data?.getArticle.id,
            img:data?.getArticle.image,
            title:data?.getArticle.title,
            description:data?.getArticle.body,
            date:data?.getArticle.createdAt,
        
    };

    const handleDescriptionChange = (value) =>{
        setDescriptionData(value)
    }

    useEffect(() => {
        if (data?.getArticle) {
            form.setFieldsValue({
                articletitle: data.getArticle.title,
            });
            setDescriptionData(data.getArticle.body || '');
            setImageUrl(data.getArticle.image || null);
        }
    }, [data]);

    const uploadFileToServer = async (file) => {
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
    
          const res = await fetch("https://verify.jusoor-sa.co/upload", {
            method: 'POST',
            body: formData,
          });
    
          if (!res.ok) throw new Error('Upload failed');
    
          const data = await res.json();
          setImageUrl(data.fileUrl);
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

    const onFinish = async (values) => {
        try {
          if (!descriptionData) {
            messageApi.error('Please add article content');
            return;
          }
          if (!imageUrl) {
            messageApi.error('Please upload an image');
            return;
          }
    
          if (detail) {
            // Update
            await updateArticle({
              variables: {
                updateArticleId: detail.id,
                title: values.articletitle,
                image: imageUrl,
                body: descriptionData,
              },
            });
            messageApi.success('Article updated successfully');
          } else {
            // Create
            await createArticle({
              variables: {
                title: values.articletitle,
                image: imageUrl,
                body: descriptionData,
              },
            });
            messageApi.success('Article created successfully');
          }
    
          navigate('/articles');
        } catch (err) {
          console.error(err);
          messageApi.error('Failed to save article');
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: "200px" }}>
                <Spin size="large" />
            </Flex>
        );
    }

      return (
        <>
         {contextHolder}
        <Flex vertical gap={20}>
          {/* Breadcrumb */}
          <Flex vertical gap={25}>
            <Breadcrumb
              separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
              items={[
                {
                  title: (
                    <Text
                      className='fs-13 text-gray cursor'
                      onClick={() => navigate('/articles')}
                    >
                      Article
                    </Text>
                  ),
                },
                {
                  title: (
                    <Text className='fw-500 fs-13 text-black'>
                      {detail ? detail?.title : 'Add a New Article'}
                    </Text>
                  ),
                },
              ]}
            />
          </Flex>
      
          {/* Header */}
          <Flex justify='space-between' align='center'>
            <Flex gap={15} align='center'>
              <Button
                aria-labelledby='Arrow left'
                className='border0 p-0 bg-transparent'
                onClick={() => navigate('/articles')}
              >
                <ArrowLeftOutlined />
              </Button>
              <Title level={4} className='m-0'>
                {detail ? detail?.title : 'Add a New Article'}
              </Title>
            </Flex>
            <Flex gap={5} align='center'>
              {/* Cancel should just navigate */}
              <Button
                onClick={() => navigate('/articles')}
                aria-labelledby='Cancel'
                type='button'
                className='btncancel text-black border-gray'
              >
                Cancel
              </Button>
              {/* Save/Update should submit form */}
              <Button
                onClick={() => form.submit()}
                loading={creating || updating}
                aria-labelledby='submit button'
                type='button'
                className='btnsave border0 text-white brand-bg'
              >
                {detail ? 'Update' : 'Save'}
              </Button>
            </Flex>
          </Flex>
      
          {/* Form */}
          <Card className='radius-12 border-gray'>
            <Title level={5} className='mt-0'>Article Details</Title>
            <Form
              layout='vertical'
              form={form}
              onFinish={onFinish}
              requiredMark={false}
            >
              <Row>
                <Col span={24}>
                  <MyInput
                    label='Article Title'
                    name='articletitle'
                    required
                    message='Please enter article title'
                    placeholder='Enter Title'
                  />
                </Col>
      
                <Col span={24}>
                  {imageUrl && showImage ? (
                    <div className='position-relative' style={{ display: 'inline-block', width: '100%' }}>
                      <img
                        src={imageUrl}
                        className='radius-12 object-cover object-top'
                        style={{ width: '100%', height: 400 }}
                        fetchpriority="high"
                      />
                      <Button
                        size='small'
                        shape='circle'
                        danger
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'var(--red-color)',
                          border: '1px solid #ccc',
                        }}
                        onClick={() => setShowImage(false)}
                        className='text-white'
                        aria-labelledby='Close'
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <SingleFileUpload
                      label={
                        <Flex vertical>
                          <Title level={5} className='m-0 fw-500'>Article Image</Title>
                          <Text className='text-gray'>
                            Accepted formats: JPEG, JPG & PNG, Max size: 5MB per file. Aspect Ratio: 1:1.
                          </Text>
                        </Flex>
                      }
                      form={form}
                      name={'uploadcr'}
                      title={'Upload'}
                      multiple={false}
                      onUpload={uploadFileToServer}
                    />
                  )}
                </Col>
      
                <Col span={24} className='my-3'>
                  <EditorDescription
                    label={'Article Content'}
                    descriptionData={descriptionData}
                    onChange={handleDescriptionChange}
                  />
                </Col>
              </Row>
            </Form>
          </Card>
        </Flex>
        </>
      );
}

export {AddArticle}