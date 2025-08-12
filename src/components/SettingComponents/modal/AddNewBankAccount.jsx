import { Button, Card, Col, Divider, Flex, Form, Image, Modal, Row, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

const { Title, Text } = Typography
const AddNewBankAccount = ({visible,onClose,edititem}) => {

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
                    <Button type='button' onClick={onClose} className='btncancel text-black border-gray'>
                        Cancel
                    </Button>
                    <Button className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()}>
                        {edititem ? 'Update':'Save Account'}
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
                        <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
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
                                    {
                                        id: 1,
                                        name: 'Al-Saudia Bank'
                                    }
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
                                    <Image src='/assets/icons/brand-info.png' width={20} />
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