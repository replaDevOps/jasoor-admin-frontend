import { Button, Flex, Typography, Form, Modal, Row, Col,message } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import { MyInput } from '../../../Forms';
import { useEffect } from 'react';
import { useMutation,useQuery } from "@apollo/client";
import { CREATE_FAQ, UPDATE_FAQ } from '../../../../graphql/mutation/mutations';
import {GETFAQ} from '../../../../graphql/query/queries'
import { t } from 'i18next';


const { Text, Title } = Typography;
const AddEditFaqs = ({ visible, onClose, edititem,refetch }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    
    const [createFAQ, { loading: creating }] = useMutation(CREATE_FAQ);
    const [updateFAQ, { loading: updating }] = useMutation(UPDATE_FAQ);

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
    const onFinish = async (values) => {
        const { question, answer } = values;
    
        if (!question || !answer) {
          messageApi.error(t('Please fill in both question and answer'));
          return;
        }
    
        try {
          if (edititem) {
            // Update FAQ
            await updateFAQ({
              variables: {
                updateFaqId: edititem.id,
                question,
                answer,
              },
                refetchQueries: [{ query: GETFAQ, variables: { search: "" } }],
                awaitRefetchQueries: true,
            });
            messageApi.success(t('FAQ updated successfully'));
          } else {
            // Create FAQ
            await createFAQ({
              variables: {
                question,
                answer,
              },
                refetchQueries: [{ query: GETFAQ, variables: { search: "" } }],
                awaitRefetchQueries: true,
            });
            messageApi.success(t('FAQ added successfully'));
          }
    
          onClose(); // Close modal
          form.resetFields();
        } catch (err) {
           if (err.graphQLErrors) {
            messageApi.error(t(err.graphQLErrors[0].message));
          }
        }
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
            width={600}
            footer={
                <Flex justify='end' gap={5}>
                    <Button aria-labelledby='Cancel' type='button' onClick={onClose} className='btncancel text-black border-gray'>
                        {t("Cancel")}
                    </Button>
                    <Button 
                    onClick={() => form.submit()} 
                    loading={creating || updating}
                    aria-labelledby='submit button' 
                    type='button' 
                    className={`btnsave border0 text-white brand-bg`}>
                        {
                            edititem? t('Update'):t('Add Question')
                        }
                    </Button>
                </Flex>
            }
        >
            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={5}>
                        {
                            edititem ? t('Edit Question') : t('Add Question')
                        }
                    </Title>
                    <Button aria-labelledby='Close' type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex>
                <Text className='fs-14'>
                    {
                        edititem ? 
                        t('Edit a question and its answer to help users better understand how Jusoor works.'):
                        t('Enter a question and its answer to help users better understand how Jusoor works.')
                    }
                </Text>
            </Flex>
            <Form form={form} layout='vertical' onFinish={onFinish}>
                <Row>
                    <Col span={24}>
                        <MyInput
                            name='question'
                            label={t('Question')}
                            required
                            message={t('Please add question')}                            
                            placeholder={t('Enter the question users frequently ask')}
                        />
                    </Col>
                    <Col span={24}>
                        <MyInput
                            textArea
                            name='answer'
                            label={t('Answer')}
                            required
                            message={t('Please add answer')}
                            placeholder={t('Provide a helpful and clear answer to the question')}
                            rows={5}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
        </>
    )
}

export { AddEditFaqs } 
