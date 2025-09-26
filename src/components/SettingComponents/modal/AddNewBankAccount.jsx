import { Button, Card, Col, Divider, Flex, Form, Image, Modal, Row, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { ADD_ADMIN_BANK, UPDATEBANK } from '../../../graphql/mutation'
import { gql, useMutation } from '@apollo/client';
import { GET_SETTINGS, GETADMINBANK } from '../../../graphql/query'
import { message } from 'antd'

const { Title, Text } = Typography
const AddNewBankAccount = ({visible,onClose,edititem,settingId}) => {

    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()

    useEffect(() => {
    if (visible && edititem) {
        form.setFieldsValue({
            bankname: edititem?.bankname,
            accountName: edititem?.accountno,
            ibanNumber: edititem?.ibanNo,
        });
    } else {
        form.resetFields();
    }
    }, [visible, edititem]);

    const [addBank, { loading: addLoading }] = useMutation(ADD_ADMIN_BANK, {
        refetchQueries: [{ query: GETADMINBANK }], 
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success('Bank account added successfully!');
            onClose();
        },
        onError: (err) => {
            messageApi.error(err.message || 'Failed to add bank account.');
        }
    });

    const [updateBank, { loading: updateLoading }] = useMutation(UPDATEBANK, {
        refetchQueries: [{ query: GETADMINBANK }],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success('Bank account updated successfully!');
            onClose();
        },
        onError: (err) => {
            messageApi.error(err.message || 'Failed to update bank account.');
        }
    });

    const onFinish = (values) => {
        if (edititem) {
            updateBank({
                variables: {
                    updateBankId: edititem.id,
                    input: {
                        bankName: values.bankname,
                        accountTitle: values.accountName,
                        iban: values.ibanNumber,
                    },
                }
            });
        } else {
            addBank({
                variables: {
                    addAdminBankId: settingId,
                    input: {
                        bankName: values.bankname,
                        accountTitle: values.accountName,
                        iban: values.ibanNumber,
                        isAdmin: true,
                    },
                }
            });
        }
    }

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
                    <Button aria-labelledby='submit button' className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()} disabled={addLoading || updateLoading}>
                        {edititem ? (updateLoading ? 'Updating...' : 'Update') : (addLoading ? 'Saving...' : 'Save Account')}
                    </Button>
                </Flex>
            }
        > 

            <div>
                <Flex vertical className='mb-3' gap={0}>
                    <Flex justify='space-between' gap={6}>
                        <Title level={5} className='m-0'>
                            {
                                edititem? 'Edit Bank Account':'Add New Bank Account'
                            }
                        </Title>
                        <Button aria-labelledby='Close' type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                            <CloseOutlined className='fs-18' />
                        </Button>
                    </Flex>                
                    {
                        !edititem && 
                        <Text className='fs-14'>
                            Securely link your bank account to receive payments for completed deals. Make sure the IBAN is correct to avoid payout delays.
                        </Text>
                    }
                </Flex>
                <Form
                    layout='vertical'
                    form={form}
                    requiredMark={false}
                    onFinish={onFinish} 

                >
                    <Row>
                        <Col span={24}>
                            <MySelect
                                label='Bank Name'
                                name='bankname'
                                required
                                message='Please choose bank name'
                                placeholder='Choose'
                                options={[
                                    { id: 1, name: 'Saudi National Bank' },
                                    { id: 2, name: 'Saudi Awwal Bank' },
                                    { id: 3, name: 'The Saudi Investment Bank' },
                                    { id: 4, name: 'Alinma Bank' },
                                    { id: 5, name: 'Banque Saudi Fransi' },
                                    { id: 6, name: 'Riyad Bank' },
                                    { id: 7, name: 'Al Rajhi Bank' },
                                    { id: 8, name: 'Arab National Bank' },
                                    { id: 9, name: 'Bank Albilad' },
                                    { id: 10, name: 'Bank AlJazira' },
                                    { id: 11, name: 'Gulf International Bank' }
                                ]}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label='Account Holder Name'
                                name='accountName'
                                required
                                message='Please enter account holder name'
                                placeholder='Enter Holder Name'
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label='IBAN Number'
                                name='ibanNumber'
                                required
                                message='Please enter IBAN number'
                                placeholder='Enter IBAN Number'
                            />
                        </Col>
                        <Col span={24}>
                            <Card className='bg-brand-light border0 card-cs'>
                                <Flex align='center' gap={10}>
                                    <Image src='/assets/icons/brand-info.png' fetchPriority="high" alt='info-icon' width={20} />
                                    <Text className='text-brand fs-13'>
                                        Your banking details are encrypted and used only for secure payouts through Jusoor.
                                    </Text>
                                </Flex>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </div>
            <Divider className='my-3 bg-light-brand' />
        </Modal>
    )
}

export {AddNewBankAccount}