import { Button, Card, Col, Flex, Form, Row, Typography,Input } from 'antd'
import { MyInput } from '../../Forms'
import React from 'react'
import { CHANGE_ADMIN_PASSWORD } from '../../../graphql/mutation'
import { useMutation } from '@apollo/client'
import { message,Spin } from "antd";

const { Title } = Typography
const PasswordManager = () => {
    const [messageApi, contextHolder] = message.useMessage();
    // get userId from localStorage or context
    const userId = localStorage.getItem('userId');
    const [form] = Form.useForm();

    const [changePassword, { loading }] = useMutation(CHANGE_ADMIN_PASSWORD, {
        onCompleted: () => {
            messageApi.success('Password changed successfully!');
            form.resetFields();
        },
        onError: (err) => {
            messageApi.error(err || 'Failed to change password.');
        }
    });

    const onFinish = (values) => {
        if (values.newPassword !== values.confirmPassword) {
            messageApi.error('New password and confirmation do not match.');
            return;
        }

        changePassword({
            variables: {
                adminChangePasswordId: userId,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            }
        });
    };

    return (
        <>
        {contextHolder}
        <Card className='radius-12 border-gray'
            actions={[
                <Flex justify='end' className='px-3'>
                    <Button type='button' className='btncancel text-black border-gray'  onClick={() => form.submit()}>
                        Save Changes
                    </Button>
                </Flex>
            ]}

        >
            <Form
                layout='vertical'
                form={form}
                onFinish={onFinish} 
                requiredMark={false}
            >
                <Title level={5} className='mt-0 mb-3 fw-600'>
                    Password Manager
                </Title>
                <Row gutter={12}>
                    <Col lg={{span: 8}} md={{span: 12}} span={24}>
                        <MyInput
                            label='Old Password'
                            name='oldPassword'
                            type='password' 
                            required
                            message='Please enter old password'
                        />
                    </Col>
                    <Col lg={{span: 8}} md={{span: 12}} span={24}>
                        <MyInput
                            label='New Password'
                            name='newPassword'
                            type='password' 
                            required
                            message='Please enter new password'
                        />
                    </Col>
                    <Col lg={{ span: 8 }} md={{ span: 12 }} span={24}>
                        <Form.Item
                            name='confirmPassword'
                            label='Re-type Password'
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('The two passwords do not match!')
                                        );
                                    }
                                })
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Card>
        </>
    )
}

export {PasswordManager}