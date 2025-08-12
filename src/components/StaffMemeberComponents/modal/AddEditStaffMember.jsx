import { Button, Col, Divider, Flex, Form, Modal, Row, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect } from 'react'

const { Title } = Typography
const AddEditStaffMember = ({visible,onClose,edititem}) => {

    const [form] = Form.useForm()
    useEffect(()=>{
        if(visible && edititem){
            form.setFieldsValue({
                fullName: edititem?.name,
                email: edititem?.email,
                phoneNo: edititem?.phone,
                assignRole: edititem?.role,
            })
        } else {
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
            footer={
                <Flex justify='end' gap={5}>
                    <Button type='button' onClick={onClose} className='btncancel text-black border-gray'>
                        Cancel
                    </Button>
                    <Button className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()}>
                        Save
                    </Button>
                </Flex>
            }
        > 

            <div>
                <Flex justify='space-between' className='mb-3' gap={6}>
                    <Title level={5} className='m-0'>
                        {edititem ? 'Edit Staff Member' : 'Add Staff Member'}
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
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label='Email Address'
                                name='email'
                                required
                                message='Please enter your email address'
                                placeholder='Enter email address'
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                // type='number'
                                label='Phone Number (Optional)'
                                name='phoneNo'
                                placeholder='Enter phone number'
                            />
                        </Col>
                        <Col span={24}>
                            <MySelect
                                label='Assign Role'
                                name='assignRole'
                                required
                                message='Please choose a role'
                                option={[
                                    {
                                        id: 1,
                                        name: 'Manager'
                                    }
                                ]}
                                placeholder='Select a role'
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                type='password'
                                label='Password'
                                name='password'
                                required
                                message='Enter password'
                                placeholder='Enter password'
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
            <Divider className='my-2 bg-light-brand' />
        </Modal>
    )
}

export {AddEditStaffMember}