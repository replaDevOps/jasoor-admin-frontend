import { Button, Col, Divider, Flex, Form, Modal, Row, Typography } from 'antd'
import { MyDatepicker, MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { districtselectItems, groupselectItem } from '../../../shared'
import moment from 'moment'

const { Title } = Typography
const AddNotification = ({visible,onClose,edititem,viewnotify}) => {

    const [form] = Form.useForm()

    useEffect(() => {
    if (visible && (edititem || viewnotify)) {
        const source = edititem || viewnotify;
        const rawDate = source?.date;
        const parsedDate = moment(rawDate, 'DD-MM-YYYY hh:mm A', true);

        form.setFieldsValue({
        title: source?.title || '',
        group: source?.group || '',
        district: Array.isArray(source?.district)
            ? source.district.map((d) => d?.item)
            : [],
        dateTime: parsedDate.isValid() ? parsedDate : null,
        description: source?.description || '',
        });
    } else {
        form.resetFields();
    }
    }, [visible, edititem, viewnotify]);

    


    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            centered
            footer={
                !viewnotify ?
                <Flex justify='end' gap={5}>
                    <Button type='button' onClick={onClose} className='btncancel text-black border-gray'>
                        Cancel
                    </Button>
                    <Button className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()}>
                        {edititem ? 'Update':'Confirm'}
                    </Button>
                </Flex>
                :
                null
            }
        > 

            <div>
                <Flex justify='space-between' className='mb-3' gap={6}>
                    <Title level={5} className='m-0 fw-500'>
                        {
                            viewnotify ? 
                            'View Notification'
                            :
                            edititem ?
                            'Edit Notification'
                            :
                            'Add Notification'
                        }
                       
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
                                label='Title'
                                name='title'
                                required
                                message='Please enter your title'
                                placeholder='Enter title'
                                disabled={viewnotify}
                            />
                        </Col>
                        <Col span={24}>
                            <MySelect
                                label='Group'
                                name='group'
                                required
                                message='Please choose group'
                                placeholder='Choose'
                                options={groupselectItem}
                                disabled={viewnotify}
                            />
                        </Col>
                        <Col span={24}>
                            <MySelect
                                mode={'multiple'}
                                label='District'
                                name='district'
                                required
                                message='Please choose distict'
                                placeholder='Choose district'
                                options={districtselectItems}
                                disabled={viewnotify}
                            />
                        </Col>
                        <Col span={24}>
                            <MyDatepicker
                                showTime
                                datePicker
                                label='Date & Time'
                                name='dateTime'
                                required
                                message='Please select date and time'
                                placeholder='Select Date & Time'
                                format="DD-MM-YYYY hh:mm A"
                                disabled={viewnotify}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                textArea
                                label='Description'
                                name='description'
                                required
                                message='Please write note'
                                placeholder='Write here....'
                                rows={4}
                                disabled={viewnotify}
                            />
                        </Col>
                    </Row>
                </Form>
            </div>
            <Divider className='my-2 bg-light-brand' />
        </Modal>
    )
}

export {AddNotification}