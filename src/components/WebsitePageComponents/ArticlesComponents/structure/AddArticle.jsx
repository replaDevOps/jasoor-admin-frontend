import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Form, Image, Row, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { MyInput, SingleFileUpload } from '../../../Forms'
import { useEffect, useState } from 'react'
import { EditorDescription } from '../../../Ui'
import { articleData } from '../../../../data'

const { Title, Text } = Typography
const AddArticle = () => {

    const {id} = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm();
    const [ descriptionData, setDescriptionData ] = useState('')
    const [showImage, setShowImage] = useState(true);


    const detail = articleData.find((item) => item?.id === Number(id));

    const handleDescriptionChange = () =>{
        setDescriptionData()
    }

    useEffect(() => {
        console.log(detail)
        if (detail) {
        form.setFieldsValue({
            articletitle: detail?.title,
        });
            setDescriptionData(detail?.description || '');
        }
    }, [id]);

    return (
        <Flex vertical gap={20}>
            <Flex vertical gap={25}>
                <Breadcrumb
                    separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                    items={[
                        {
                            title: <Text className='fs-13 text-gray cursor' onClick={() => navigate('/articles')}>Article</Text>,
                        },
                        {
                            title: <Text className='fw-500 fs-13 text-black'>
                               {detail? detail?.title:'Add a New Article'} 
                            </Text>,
                        },
                    ]}
                />
            </Flex>
            <Flex justify='space-between' align='center'>
                <Flex gap={15} align='center'>
                    <Button className='border0 p-0 bg-transparent' onClick={() => navigate('/articles')}>
                        <ArrowLeftOutlined />
                    </Button>
                    <Title level={4} className='m-0'>
                        {detail? detail?.title:'Add a New Article'}
                    </Title>
                </Flex>
                <Flex gap={5} align='center'>
                    <Button type='button' className='btncancel text-black border-gray'>
                        Cancel
                    </Button>
                    <Button type='button' className='btnsave border0 text-white brand-bg'>
                        {detail? 'Update':'Save'}
                    </Button>
                </Flex>
            </Flex>
            <Card className='radius-12 border-gray'>
                <Title level={5} className='mt-0'>
                    Article Details
                </Title>
                <Form
                    layout='vertical'
                    form={form}
                    // onFinish={onFinish} 
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
                            {
                                detail?.img && showImage ? (
                                    <div className='position-relative' style={{ display: 'inline-block', width: '100%' }}>
                                        <img 
                                            src={detail?.img} 
                                            className='radius-12 object-cover object-top'
                                            style={{ width: '100%', height:400 }}
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
                                                border: '1px solid #ccc' 
                                            }}
                                            onClick={() => setShowImage(false)}
                                            className='text-white'
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ) : (
                                    <SingleFileUpload
                                        label={
                                            <Flex vertical>
                                            <Title level={5} className="m-0 fw-500">
                                                Category Icon
                                            </Title>
                                            <Text className="text-gray">
                                                Accepted formats: JPEG, JPG & PNG, Max size: 5MB per file. Aspect Ratio: 1:1.
                                            </Text>
                                            </Flex>
                                        }   
                                        form={form}
                                        name={'uploadcr'}
                                        title={'Upload'}
                                        multiple={false}
                                    />
                                )
                            }
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
    )
}

export {AddArticle}