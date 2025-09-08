import { Button, Col, Divider, Flex, Form, Modal, Row, Typography } from 'antd'
import { MyDatepicker, MyInput } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const ScheduleMeeting = ({visible,onClose,meetingId, updateMeeting}) => {
    const [form] = Form.useForm();
    const handleSendInvitation = async () => {
        try {
            const values = await form.validateFields();
            const { date, time, link } = values;

            if (!date || !time || !link) return;

            const scheduleDateTime = new Date(
                date.format('YYYY-MM-DD') + ' ' + time.format('HH:mm')
            ).toISOString();

            await updateMeeting({
                variables: {
                    input: {
                        id: meetingId,
                        status: "APPROVED",
                        meetingLink: link,
                        requestedDate: scheduleDateTime
                    }
                }
            });

            onClose()
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        centered
        footer={
            <Flex justify='end' gap={5}>
                <Button aria-labelledby='Cancel' type='button' onClick={onClose} className='btncancel text-black border-gray'>
                    Cancel
                </Button>
                <Button
                    className='btnsave border0 text-white brand-bg'
                    onClick={handleSendInvitation}
                    // loading={loading}
                    aria-labelledby='Send Meeting Invitation'
                >
                    Send Meeting Invitation
                </Button>
            </Flex>
        }
    > 
        <div>
            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={5} className='m-0'>
                        Schedule Virtual Meeting
                    </Title>
                    <Button aria-labelledby='Close' type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex>                
                <Text className='fs-14'>
                    Please select a date and time for the virtual meeting between the buyer and seller. An invitation will be sent to both parties upon confirmation.
                </Text>
            </Flex>
            <Form
                layout='vertical'
                form={form}
                requiredMark={false}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <MyDatepicker
                            datePicker
                            label='Meeting Date'
                            name='date'
                            className='w-100'
                        />
                    </Col>
                    <Col span={24}>
                        <MyDatepicker
                            label='Meeting Time'
                            name='time'
                            className='w-100'
                        />
                    </Col>
                    <Col span={24}>
                        <MyInput
                            label='Meet Link'
                            name='link'
                            className='w-100'
                        />
                    </Col>
                </Row>
            </Form>
        </div>
        <Divider className='my-2 bg-light-brand' />
    </Modal>
    )
}

export {ScheduleMeeting}