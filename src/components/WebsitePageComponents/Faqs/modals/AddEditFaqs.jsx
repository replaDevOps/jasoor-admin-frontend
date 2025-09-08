import { Button, Flex, Typography, Form, Modal, Row, Col } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import { MyInput } from '../../../Forms';
import { useEffect } from 'react';

const { Text, Title } = Typography;
const AddEditFaqs = ({ visible, onClose, edititem }) => {
    const [form] = Form.useForm();

    useEffect(()=>{
        if(visible,edititem){
            form.setFieldsValue({
                question: edititem?.question,
                answer: edititem?.answer
            })
        }
        else{
            form.resetFields()
        }
    },[visible,edititem])

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            centered
            width={600}
            footer={
                <Flex justify='end' gap={5}>
                    <Button aria-labelledby='Cancel' type='button' onClick={onClose} className='btncancel text-black border-gray'>
                        Cancel
                    </Button>
                    <Button aria-labelledby='submit button' type='button' className={`btnsave border0 text-white brand-bg`}>
                        {
                            edititem? 'Update':'Add Question'
                        }
                    </Button>
                </Flex>
            }
        >
            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={5}>
                        {
                            edititem ? 'Edit Question' : 'Add Question'
                        }
                    </Title>
                    <Button aria-labelledby='Close' type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex>
                <Text className='fs-14'>
                    {
                        edititem ? 
                        'Edit a question and its answer to help users better understand how Jusoor works.':
                        'Enter a question and its answer to help users better understand how Jusoor works.'
                    }
                </Text>
            </Flex>
            <Form form={form} layout='vertical'>
                <Row>
                    <Col span={24}>
                        <MyInput
                            name='question'
                            label='Question'
                            required
                            message='Please add question'                            
                            placeholder='Enter the question users frequently ask'
                        />
                    </Col>
                    <Col span={24}>
                        <MyInput
                            textArea
                            name='answer'
                            label='Answer'
                            required
                            message={'Please add answer'}
                            placeholder='Provide a helpful and clear answer to the question'
                            rows={5}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export { AddEditFaqs } 
