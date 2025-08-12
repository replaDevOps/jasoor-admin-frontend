import { Button, Card, Col, Flex, Form, Row, Typography } from 'antd'
import { MyInput } from '../../Forms'

const { Title } = Typography
const PasswordManager = () => {

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
                    Password Manager
                </Title>
                <Row gutter={12}>
                    <Col lg={{span: 8}} md={{span: 12}} span={24}>
                        <MyInput
                            label='Old Password'
                            name='oldPassword'
                            required
                            message='Please enter old password'
                        />
                    </Col>
                    <Col lg={{span: 8}} md={{span: 12}} span={24}>
                        <MyInput
                            label='New Password'
                            name='newPassword'
                            required
                            message='Please enter new password'
                        />
                    </Col>
                    <Col lg={{span: 8}} md={{span: 12}} span={24}>
                        <MyInput
                            label='Re-type Password'
                            name='confirmPassword'
                            required
                            message='Please enter re-type password'
                        />
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export {PasswordManager}