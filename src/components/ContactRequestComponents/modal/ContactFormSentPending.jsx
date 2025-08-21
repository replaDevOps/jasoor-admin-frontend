import { Button, Col, Divider, Flex, Form, Modal, Row, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { UPDATE_CONTACT_US } from '../../../graphql/mutation';
import { useQuery,useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const { Title } = Typography
const ContactFormSentPending = ({visible,onClose,sendview,viewitem,refetchTable}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const [updateContactUs, { loading: updating }] = useMutation(UPDATE_CONTACT_US, {
        onCompleted: () => {
            messageApi.success('Response sent successfully!');
          if(refetchTable) refetchTable(); // call the function safely
            onClose();
        },
        onError: (err) => {
            messageApi.error(err.message || 'Something went wrong!');
        }
      });
    
    useEffect(()=>{
        if(visible && viewitem){
            form.setFieldsValue({
                id:viewitem.key,
                fullName: viewitem?.name,
                email: viewitem?.email,
                question: viewitem?.msgPreview,
                answer: !sendview ? viewitem?.answer : null
            })
        }
    },[visible,viewitem])

    const onFinish = (values) => {
        if (!viewitem) return;
        updateContactUs({
          variables: {
            updateContactUsId: viewitem.key, // or viewitem.id if available
            status: true,
            answer: values.answer
          }
        });
      };
    return (
        <>
        {contextHolder}
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            centered
            footer={
                sendview ? 
                <Flex justify='end' gap={5}>
                    <Button type='button' onClick={onClose} className='btncancel text-black border-gray'>
                        Cancel
                    </Button>
                    <Button className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()}>
                        Save
                    </Button>
                </Flex>
                :
                null
            }
        > 

            <div>
                <Flex justify='space-between' className='mb-3' gap={6}>
                    <Title level={5} className='m-0'>
                        Contact Form
                    </Title>
                    <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex> 
                <Form
                    layout='vertical'
                    form={form}
                    requiredMark={false}
                    onFinish={onFinish}
                >
                    <Row>
                        <Col span={24}>
                            <MyInput
                                label='Full Name'
                                name='fullName'
                                required
                                message='Please enter your full name'
                                placeholder='Enter full name'
                                disabled
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label='Email Address'
                                name='email'
                                required
                                message='Please enter your email address'
                                placeholder='Enter email address'
                                disabled
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                textArea
                                label='Question'
                                name='question'
                                placeholder='Enter your question'
                                disabled
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                textArea
                                label='Answer'
                                name='answer'
                                placeholder='Enter your answer'
                                disabled={sendview ? false:true}
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
            <Divider className='my-2 bg-light-brand' />
        </Modal>
        </>
    )
}

export {ContactFormSentPending}