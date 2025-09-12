import { Button, Card, Col, Dropdown, Flex, Form, Row, Table ,Typography} from 'antd';
import { NavLink } from "react-router-dom";
import { SearchInput } from '../../Forms';
import { meetingreqColumn } from '../../../data';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { meetingItems } from '../../../shared';
import { CustomPagination, DeleteModal } from '../../Ui';
import { ScheduleMeeting } from '../modal';
import { UPDATE_BUSINESS_MEETING } from '../../../graphql/mutation'
import { GETADMINPENDINGMEETINGS } from '../../../graphql/query/meeting'
import { useQuery,useMutation } from '@apollo/client'
import { message,Spin } from "antd";

const { Text } = Typography

const MeetingRequestTable = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const meetingreqColumn = ( setVisible, setDeleteItem ) =>  [
        {
            title: 'Business Title',
            dataIndex: 'businessTitle',
        },
        {
            title: 'Buyer Name',
            dataIndex: 'buyerName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Seller Name',
            dataIndex: 'sellerName',
        },
        {
            title: 'Email',
            dataIndex: 'sellerEmail',
        },
        {
            title: 'Phone Number',
            dataIndex: 'sellerPhoneNumber',
        },
        {
            title: 'Preferred Date & Time',
            dataIndex: 'scheduleDateTime',
        },
        {
            title: 'Business Price',
            dataIndex: 'businessPrice',
        },
        {
            title: 'Offer Price',
            dataIndex: 'offerPrice',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => { return ( status === 'REQUESTED' ? ( <Text className='btnpill fs-12 pending'>Pending</Text> ) : ( <Text className='btnpill fs-12 inactive'>Cancel Meeting</Text> ) ) }
        },
        {
            title: 'Action',
            key: "action",
            fixed: "right",
            width: 100,
            render: (_, row) => {
                if (row.status !== 'REQUESTED') return null; // only show dropdown for REQUESTED
        
                return (
                    <Dropdown
                        menu={{
                            items: [
                                { 
                                    label: (
                                        <NavLink onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedMeetingId(row.key); 
                                            setVisible(true);
                                        }}>
                                            Schedule Meeting
                                        </NavLink>
                                    ),
                                    key: '1'
                                },
                                { 
                                    label: (
                                        <NavLink onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedMeetingId(row.key); 
                                            setDeleteItem(true);
                                        }}>
                                            Cancel
                                        </NavLink>
                                    ),
                                    key: '2'
                                },
                            ]
                        }}
                        trigger={['click']}
                    >
                        <Button aria-labelledby='action button' className="bg-transparent border0 p-0">
                            <img src="/assets/icons/dots.png" alt="" width={16} fetchpriority="high"/>
                        </Button>
                    </Dropdown>
                );
            }        
        },
    ];
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [visible, setVisible] = useState(false);
    const [deleteItem, setDeleteItem] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchValue, setSearchValue] = useState('');

    // Apollo query
    const { data, loading, refetch } = useQuery(GETADMINPENDINGMEETINGS, {
        variables: {
            search: searchValue,
            status: selectedStatus !== 'Status' ? selectedStatus.toUpperCase() : null
        },
        fetchPolicy: 'network-only'
    });
    const mainmeetingreqData = (data?.getAdminPendingMeetings?.items || []).map((item, index) => ({
        key: item.id,
        businessTitle: item.business?.businessTitle || '-',
        buyerName: item.requestedBy?.name || '-',
        email: item.requestedBy?.email || '-',
        phoneNumber: item.requestedBy?.phone || '-',
        sellerName: item.business?.seller?.name || '-',
        sellerEmail: item.business?.seller?.email || '-',
        sellerPhoneNumber: item.business?.seller?.phone || '-',
        scheduleDateTime: item.requestedDate
            ? new Date(item.requestedDate).toLocaleString()
            : '-',
        businessPrice: item.business?.price
            ? `SAR ${item.business.price.toLocaleString()}`
            : '-',
        offerPrice: item.offer?.price
            ? `SAR ${item.offer.price.toLocaleString()}`
            : '-',
        meetLink: item.meetingLink || '',
        status: item.status || '-',
    }));

    const total = data?.getAdminPendingMeetings?.totalCount || 0;

    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };

    const handleStatusClick = ({ key }) => {
        const selectedItem = meetingItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedStatus(selectedItem.label);
            if( selectedItem.label === 'Pending' ){
                refetch({ status: 'REQUESTED' });
            }
            else if (selectedItem.label === 'Cancel Meeting' ){
                refetch({ status: 'REJECTED', search: searchValue });
            }else if (selectedItem.label === 'All') {
                refetch({ status: null });
            }
            // refetch({ status: selectedItem.label.toUpperCase(), search: searchValue });
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
        refetch({ status: selectedStatus !== 'Status' ? selectedStatus.toUpperCase() : null, search: value });
    };
    const [updateMeeting,{ loading: updating }] = useMutation(UPDATE_BUSINESS_MEETING, 
        { refetchQueries: [ { query: GETADMINPENDINGMEETINGS} ], 
        awaitRefetchQueries: true, 
        onCompleted: () => { messageApi.success("Stats changed successfully!"); },
         onError: (err) => { messageApi.error(err.message || "Something went wrong!"); }, });
    if (loading || updating) {
        return (
          <Flex justify="center" align="center" style={{ height: '200px' }}>
            <Spin size="large" />
          </Flex>
        );
    }

    return (
        <>
        {contextHolder}
            <Flex vertical gap={20}>
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <Flex gap={5} wrap>
                                <SearchInput
                                    name='name'
                                    placeholder='Search'
                                    prefix={<img src='/assets/icons/search.png' width={14} fetchpriority="high" />}
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <Dropdown 
                                    menu={{ 
                                        items: meetingItems,
                                        onClick: handleStatusClick
                                    }} 
                                    trigger={['click']}
                                >
                                    <Button aria-labelledby='filter status' className="btncancel px-3 filter-bg fs-13 text-black">
                                        <Flex justify='space-between' align='center' gap={30}>
                                            {selectedStatus}
                                            <DownOutlined />
                                        </Flex>
                                    </Button>
                                </Dropdown>
                            </Flex>
                        </Col>
                    </Row>
                </Form>
                <Table
                    size='large'
                    columns={meetingreqColumn(setVisible,setDeleteItem)}
                    dataSource={mainmeetingreqData.slice((current - 1) * pageSize, current * pageSize)}
                    className='pagination table-cs table'
                    showSorterTooltip={false}
                    scroll={{ x: 2300 }}
                    rowHoverable={false}
                    pagination={true}
                    // loading={
                    //     {
                    //         ...TableLoader,
                    //         spinning: loading
                    //     }
                    // }
                />
                <CustomPagination 
                    total={total}
                    current={current}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            </Flex>
            <DeleteModal 
                visible={deleteItem}
                onClose={()=>setDeleteItem(false)}
                title='Are you sure?'
                subtitle='This action cannot be undone. Are you sure you want to cancel this Meeting?'
                type='danger'
                onConfirm={async () => {
                    try {
                        await updateMeeting({
                            variables: {
                                input: {
                                id: selectedMeetingId,
                                status: 'REJECTED'
                                }
                            }
                            
                        });
                        setDeleteItem(false); // close modal after success
                    } catch (err) {
                        console.error(err);
                    }
                }}
            
            />
            <ScheduleMeeting 
                visible={visible}
                onClose={()=>setVisible(false)}
                meetingId={selectedMeetingId}   // store this in state when clicking "Schedule Meeting"
                updateMeeting={updateMeeting}
            />
        </>
    );
};

export { MeetingRequestTable };