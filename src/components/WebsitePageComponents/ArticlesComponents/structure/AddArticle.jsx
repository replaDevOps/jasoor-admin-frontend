import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Form, message, Row, Typography,Spin } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { MyInput, SingleFileUpload } from '../../../Forms'
import { useEffect, useState } from 'react'
import { EditorDescription } from '../../../Ui'
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_ARTICLE, UPDATE_ARTICLE } from '../../../../graphql/mutation/mutations';
import {GETARTICLE} from '../../../../graphql/query/queries'
import imageCompression from 'browser-image-compression';
import { t } from 'i18next'

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
          message.error(t('Failed to upload file'));
          throw err;
        } finally {
          setUploading(false);
        }
    };

    const onFinish = async (values) => {
        try {
          if (!descriptionData) {
            messageApi.error(t('Please add article content'));
            return;
          }
          if (!imageUrl) {
            messageApi.error(t('Please upload an image'));
            return;
          }
          const lang = localStorage.getItem("lang") || i18n.language || "en";
          const isArabic = lang.toLowerCase() === "ar";

          // prepare dynamic input
          const titleInput = isArabic
          ? { arabicTitle: { content: descriptionData } }
          : { title: { content: descriptionData } };

          const bodyInput = isArabic
          ? { arabicBody: { content: descriptionData } }
          : { body: { content: descriptionData } };
          if (detail) {
            // Update
            await updateArticle({
              variables: {
                updateArticleId: detail.id,
                ...titleInput,
                image: imageUrl,
                ... bodyInput,
              },
            });
            messageApi.success(t('Article updated successfully'));
          } else {
            // Create
            await createArticle({
              variables: {
                ... titleInput,
                image: imageUrl,
                ... bodyInput,
              },
            });
            messageApi.success(t('Article created successfully'));
          }
    
          navigate('/articles');
        } catch (err) {
          console.error(err);
          messageApi.error(t('Failed to save article'));
        }
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
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
                      {t("Article")}
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
                {t("Cancel")}
              </Button>
              {/* Save/Update should submit form */}
              <Button
                onClick={() => form.submit()}
                loading={creating || updating}
                aria-labelledby='submit button'
                type='button'
                className='btnsave border0 text-white brand-bg'
              >
                {detail ? t('Update') : t('Save')}
              </Button>
            </Flex>
          </Flex>
      
          {/* Form */}
          <Card className='radius-12 border-gray'>
            <Title level={5} className='mt-0'>{t("Article Details")}</Title>
            <Form
              layout='vertical'
              form={form}
              onFinish={onFinish}
              requiredMark={false}
            >
              <Row>
                <Col span={24}>
                  <MyInput
                    label={t('Article Title')}
                    name='articletitle'
                    required
                    message={t('Please enter article title')}
                    placeholder={t('Enter Title')}
                  />
                </Col>
      
                <Col span={24}>
                  {imageUrl && showImage ? (
                    <div className='position-relative w-100 inline-block'>
                      <img
                        src={imageUrl}
                        className='radius-12 object-cover object-top w-100 h-400'
                        fetchPriority="high"
                        alt='image'
                      />
                      <Button
                        size='small'
                        shape='circle'
                        danger
                        onClick={() => setShowImage(false)}
                        className='text-white cross-position'
                        aria-labelledby='Close'
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <SingleFileUpload
                      label={
                        <Flex vertical>
                          <Title level={5} className='m-0 fw-500'>{t("Article Image")}</Title>
                          <Text className='text-gray'>
                            {t("Accepted formats: JPEG, JPG & PNG, Max size: 5MB per file. Aspect Ratio: 1:1.")}
                          </Text>
                        </Flex>
                      }
                      form={form}
                      name={'uploadcr'}
                      title={t('Upload')}
                      multiple={false}
                      onUpload={uploadFileToServer}
                    />
                  )}
                </Col>
      
                <Col span={24} className='my-3'>
                  <EditorDescription
                    label={t('Article Content')}
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