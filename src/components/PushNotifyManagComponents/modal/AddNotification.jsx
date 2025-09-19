import { Button, Col, Divider, Flex, Form, Modal, Row, Typography } from 'antd'
import { MyDatepicker, MyInput, MySelect } from '../../Forms'
import { CloseOutlined } from '@ant-design/icons'
import { useEffect,useState } from 'react'
import { districtselectItems, groupselectItem } from '../../../shared'
import moment from 'moment'
import { CREATE_CAMPAIGN} from '../../../graphql/mutation'
import { useMutation } from '@apollo/client'
import { message } from 'antd'
import {GET_CAMPAIGNS} from '../../../graphql/query'

const { Title } = Typography
const AddNotification = ({visible,onClose,edititem,viewnotify}) => {
    const [messageApi, contextHolder] = message.useMessage();
     const [searchValue, setSearchValue] = useState('');
     const [selectedCategory, setSelectedCategory] = useState(null);
     const [selectedDistrict, setSelectedDistrict] = useState(null);
     const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState(null);

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

    const [campaign, { loading }] = useMutation(CREATE_CAMPAIGN, {
        refetchQueries: [
            {
              query: GET_CAMPAIGNS,
              variables: {
                filter: {
                  search: searchValue || null,
                  district: selectedDistrict || null,
                  group: selectedCategory || null,
                  status: selectedStatus !== null ? selectedStatus : null,
                  limit: pageSize,
                  offset: (current - 1) * pageSize,
                }
              }
            }
          ],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success('campaign created successfully!');
            onClose();
        },
        onError: (err) => {
            messageApi.error(err.message || 'Failed to create campaign.');
        }
    });

    const onFinish = (values) => {
        const districts = Array.isArray(values.district)
        ? values.district.map((d) => (d.value ? d.value : d)) // handle MySelect returning objects or strings
        : [];

        // Ensure group matches GraphQL enum
    let groupEnum = values.group.toUpperCase(); // e.g., 'NEW', 'OLD', 'BOTH'

        campaign({
            variables: {
                title: values.title,
                group: groupEnum,
                district: districts, 
                schedule: values.dateTime,
                description: values.description,
            },
        });
    }

    return (
        <>
            <contextHolder />
            <Modal
                title={null}
                open={visible}
                onCancel={onClose}
                closeIcon={false}
                centered
                footer={
                    !viewnotify ?
                    <Flex justify='end' gap={5}>
                        <Button aria-labelledby='Cancel' type='button' onClick={onClose} className='btncancel text-black border-gray'>
                            Cancel
                        </Button>
                        <Button aria-labelledby='submit button' className={`btnsave border0 text-white brand-bg`} onClick={()=>form.submit()}>
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
                        <Button aria-labelledby='Close' type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                            <CloseOutlined className='fs-18' />
                        </Button>
                    </Flex> 
                    <Form
                        layout='vertical'
                        form={form}
                        requiredMark={false}
                        onFinish={onFinish} 
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
        </>
    )
}

export {AddNotification}