import { Button, Card, Col, Flex, Form, Row, Typography } from 'antd'
import { MyInput } from '../../Forms'

const { Title } = Typography
const CommissionSocial = () => {

    const [form] = Form.useForm();

    return (
        <Card className='radius-12 border-gray'
            actions={[
                <Flex justify='end' className='px-3'>
                    <Button type='button' className='btncancel text-black border-gray'>
                        Save Changes
                    </Button>
                </Flex>
            ]}

        >
            <Form
                layout='vertical'
                form={form}
                // onFinish={onFinish} 
                requiredMark={false}
            >
                <Title level={5} className='mt-0 mb-3 fw-600'>
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
    )
}

export {CommissionSocial}