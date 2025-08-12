import { Button, Col, Divider, Flex, Form, Modal, Row, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

const { Title } = Typography
const ContactFormSentPending = ({visible,onClose,sendview,viewitem}) => {

    const [form] = Form.useForm()
    
    useEffect(()=>{
        if(visible && viewitem){
            form.setFieldsValue({
                fullName: viewitem?.name,
                email: viewitem?.email,
                question: viewitem?.msgPreview,
                answer: !sendview ? viewitem?.answer : null
            })
        }
    },[visible,viewitem])
    return (
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
    )
}

export {ContactFormSentPending}