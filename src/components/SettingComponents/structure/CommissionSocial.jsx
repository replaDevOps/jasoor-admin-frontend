import { Button, Card, Col, Flex, Form, Row, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { langItems } from '../../../shared';
import React, { useEffect } from 'react'
import { UPDATE_SETTING } from '../../../graphql/mutation/'
import { GET_SETTINGS } from '../../../graphql/query'
import { useMutation } from '@apollo/client'
import { message,Spin } from "antd";

const { Title } = Typography
const CommissionSocial = ({comssionSocial}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    useEffect(() => {
        if (comssionSocial) {
            form.setFieldsValue({
                rate: comssionSocial.commissionRate,
                facebook: comssionSocial.facebook,
                instagram: comssionSocial.instagram,
                whatsapp: comssionSocial.whatsapp,
                twitter: comssionSocial.twitter,
                email: comssionSocial.email,
            });
        }
    }, [comssionSocial, form]);
    const [changeSetting, { loading }] = useMutation(UPDATE_SETTING, {
        refetchQueries: [{ query: GET_SETTINGS }], 
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success('Data updated successfully!');
        },
        onError: (err) => {
            messageApi.error(err || 'Failed to change password.');
        }
    });
    const onFinish = (values) => {
        changeSetting({
            variables: {
                updateSettingsId: comssionSocial?.id,
                commissionRate: values.rate,
                facebook: values.facebook,
                instagram: values.instagram,
                whatsApp: values.whatsapp,
                twitter: values.twitter,
                email: values.email,
            }
        });
    };
    return (
        <>
        {contextHolder}
        <Card className='radius-12 border-gray'
            actions={[
                <Flex justify='end' className='px-3'>
                    <Button type='button' className='btncancel text-black border-gray'  onClick={() => form.submit()} >
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
                    System Language
                </Title>
                <MySelect
                    label="Language"
                    name="language"
                    required
                    message="Choose language"
                    options={langItems}
                    placeholder="Choose language"
                />
                <Title level={5} className='my-3 fw-600'>
                    Commission Rate
                </Title>
                <Row className='mb-3'>
                    <Col span={24}>
                        <MyInput
                            label='Commission rate'
                            name='rate'
                            required
                            message='Please enter commission rate'
                            placeholder='Enter commission rate'
                            addonAfter={'%'}
                        />
                    </Col>
                </Row>
                <Title level={5} className='mt-0 mb-3 fw-600'>
                    Social Links
                </Title>
                <Row gutter={12}>
                    <Col lg={{span: 8}} md={{span: 12}} span={24}>
                        <MyInput
                            label='Facebook'
                            name='facebook'
                            required
                            message='Please enter facebook link'
                        />
                    </Col>
                    <Col lg={{span: 8}} md={{span: 12}} span={24}>
                        <MyInput
                            label='Instagram'
                            name='instagram'
                            required
                            message='Please enter instagram link'
                        />
                    </Col>
                    <Col lg={{span: 8}} md={{span: 12}} span={24}>
                        <MyInput
                            label='WhatsApp'
                            name='whatsapp'
                            required
                            message='Please enter whatsapp number'
                        />
                    </Col>
                    <Col md={{span: 12}} span={24}>
                        <MyInput
                            label='X'
                            name='twitter'
                            required
                            message='Please enter twitter link'
                        />
                    </Col>
                    <Col md={{span: 12}} span={24}>
                        <MyInput
                            label='Email Address'
                            name='email'
                            required
                            message='Please enter email address'
                        />
                    </Col>
                </Row>
            </Form>
        </Card>
        </>
    )
}

export {CommissionSocial}