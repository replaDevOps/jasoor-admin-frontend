import { Button, Card, Col, Flex, Form, Row, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms'
import { langItems } from '../../../shared';
import { useEffect } from 'react'
import { UPDATE_SETTING, CREATE_SETTINGS } from '../../../graphql/mutation/'
import { GET_SETTINGS } from '../../../graphql/query'
import { useMutation } from '@apollo/client'
import { message } from "antd";

const { Title } = Typography
const CommissionSocial = ({ comssionSocial }) => {

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
                language: comssionSocial.language,
            });
        }
    }, [comssionSocial, form]);

    const [changeSetting, { loading: updating }] = useMutation(UPDATE_SETTING, {
        refetchQueries: [{ query: GET_SETTINGS }],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success('Settings updated successfully!');
        },
        onError: (err) => {
            messageApi.error(err?.message || 'Failed to update settings.');
        }
    });

    const [createSetting, { loading: creating }] = useMutation(CREATE_SETTINGS, {
        refetchQueries: [{ query: GET_SETTINGS }],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success('Settings created successfully!');
        },
        onError: (err) => {
            messageApi.error(err?.message || 'Failed to create settings.');
        }
    });

    const onFinish = (values) => {
        const commissionRate = values.rate ? String(values.rate) : null;
        const facebook = values.facebook || null;
        const instagram = values.instagram || null;
        const whatsApp = values.whatsapp || null;
        const twitter = values.twitter || null;
        const email = values.email || null;
        const language = values.language || null;

        if (comssionSocial && comssionSocial?.id) {
            changeSetting({
                variables: {
                    updateSettingsId: comssionSocial.id,
                    commissionRate,
                    facebook,
                    instagram,
                    whatsApp,
                    twitter,
                    email,
                    language,
                }
            });
        } else {
            createSetting({
                variables: {
                    commissionRate: commissionRate || '',
                    banks: [],
                    email,
                    x: twitter || null,
                    whatsApp,
                    instagram,
                    faceBook: facebook || null,
                }
            });
        }
    };

    const isLoading = updating || creating;

    return (
        <>
            {contextHolder}
            <Card className='radius-12 border-gray'
                actions={[
                    <Flex justify='end' className='px-3' key="save-action">
                        <Button
                            aria-labelledby='Save Changes'
                            type='button'
                            className='btncancel text-black border-gray'
                            onClick={() => form.submit()}
                            loading={isLoading}
                        >
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
                        <Col lg={{ span: 8 }} md={{ span: 12 }} span={24}>
                            <MyInput
                                label='Facebook'
                                name='facebook'
                                required
                                message='Please enter facebook link'
                            />
                        </Col>
                        <Col lg={{ span: 8 }} md={{ span: 12 }} span={24}>
                            <MyInput
                                label='Instagram'
                                name='instagram'
                                required
                                message='Please enter instagram link'
                            />
                        </Col>
                        <Col lg={{ span: 8 }} md={{ span: 12 }} span={24}>
                            <MyInput
                                label='WhatsApp'
                                name='whatsapp'
                                required
                                message='Please enter whatsapp number'
                            />
                        </Col>
                        <Col md={{ span: 12 }} span={24}>
                            <MyInput
                                label='X'
                                name='twitter'
                                required
                                message='Please enter twitter link'
                            />
                        </Col>
                        <Col md={{ span: 12 }} span={24}>
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

export { CommissionSocial }