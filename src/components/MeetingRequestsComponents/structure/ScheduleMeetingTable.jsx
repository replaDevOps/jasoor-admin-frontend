import { Button, Col, Dropdown, Flex, Form, Row, Table,Typography } from 'antd';
import { NavLink } from "react-router-dom";
import { SearchInput } from '../../Forms';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { meetingItems } from '../../../shared';
import { CustomPagination } from '../../Ui';
import { UPDATE_BUSINESS_MEETING,UPDATE_OFFER } from '../../../graphql/mutation'
import { GETADMINSCHEDULEMEETINGS } from '../../../graphql/query/meeting'
import { useQuery,useMutation } from '@apollo/client'
import { Spin } from "antd";
import { t } from 'i18next';

const { Text } = Typography

const ScheduleMeetingTable = () => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [visible, setVisible] = useState(false);
    const [deleteItem, setDeleteItem] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [updateMeeting,{ loading: updating }] = useMutation(UPDATE_BUSINESS_MEETING);

    const [updateOffer,{ loading: onUpdating }] = useMutation(UPDATE_OFFER,
        { refetchQueries: [ { query: GETADMINSCHEDULEMEETINGS} ], 
        awaitRefetchQueries: true, }
    );
    const schedulemeetingColumn = ( setVisible, setDeleteItem ) =>  [
        {
            title: t('Business Title'),
            dataIndex: 'businessTitle',
        },
        {
            title: t('Buyer Name'),
            dataIndex: 'buyerName',
        },
        {
            title: t('Email'),
            dataIndex: 'email',
        },
        {
            title: t('Phone Number'),
            dataIndex: 'phoneNumber',
        },
        {
            title: t('Seller Name'),
            dataIndex: 'sellerName',
        },
        {
            title: t('Email'),
            dataIndex: 'sellerEmail',
        },
        {
            title: t('Phone Number'),
            dataIndex: 'sellerPhoneNumber',
        },
        {
            title: t('Schedule Date & Time'),
            dataIndex: 'scheduleDateTime',
        },
        {
            title: t('Business Price'),
            dataIndex: 'businessPrice',
        },
        {
            title: t('Offer Price'),
            dataIndex: 'offerPrice',
        },
        {
            title: t('Meet Link'),
            dataIndex: 'meetLink',
            render: (meetLink) => <NavLink to={meetLink}>{meetLink}</NavLink>
        },
        {
            title: t('Status'),
            dataIndex: 'status',
            render: (status) => { 
                return ( 
                    status === 'APPROVED' ? (
                        <Text className="btnpill fs-12 pending">Approved</Text>
                      ) : status === 'HELD' ? (
                        <Text className="btnpill fs-12 inactive">Held</Text>
                      ) : (
                        <Text className="btnpill fs-12 cancelled">Cancelled</Text>
                      )
            ) }
        },
        {
            title: t('Action'),
            key: "action",
            fixed: "right",
            width: 100,
            render: (_,row) => (
                <Dropdown
                    menu={{
                        items: [
                            
                            { label: <NavLink onClick={async (e) => {
                                e.preventDefault(); 
                                setVisible(true) 
                                try {
                                    await updateMeeting({
                                        variables: {
                                            input:{
                                                id: row.key,
                                                status: 'HELD'
                                            }
                                        }
                                    });
                                    if (row.offerId) {
                                        await updateOffer({
                                          variables: {
                                            input: {
                                              id: row.offerId,
                                              status: 'ACCEPTED',
                                            },
                                          },
                                        });
                                    }                                      
                                    await refetch();
                                } catch (err) {
                                    console.error(err);
                                }
                            }}>{t("Open Deal")}</NavLink>, key: '1' },
                            { label: <NavLink onClick={async (e) => {
                                e.preventDefault(); 
                                setDeleteItem(true) 
                                try {
                                    await updateMeeting({
                                        variables: {
                                            input:{
                                                id: row.key,
                                                status: 'HELD'
                                            }
                                        }
                                    });
                                    await refetch();
                                } catch (err) {
                                    console.error(err);
                                }
                            }}>{t("Schedule New Meeting")}</NavLink>, key: '2' },
                        ],
                    }}
                    trigger={['click']}
                >
                    <Button aria-labelledby='action button' className="bg-transparent border0 p-0">
                        <img src="/assets/icons/dots.png" alt="dot icon" width={16} fetchPriority="high" />
                    </Button>
                </Dropdown>
            ),
        },
    ];
    // Apollo query
    const { data, loading, refetch } = useQuery(GETADMINSCHEDULEMEETINGS, {
        variables: {
            search: searchValue,
            status: selectedStatus !== 'Status' ? selectedStatus.toUpperCase() : null
        },
        fetchPolicy: 'network-only'
    });
    const schedulemeetingData = (data?.getAdminScheduledMeetings?.items || []).map((item, index) => ({
        key: item.id,
        offerId:item?.offer?.id,
        status:item?.status,
        businessTitle: item.business?.businessTitle || '-',
        email: item.requestedTo?.email || '-',
        phoneNumber: item.requestedTo?.phone || '-',
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
                refetch({ status: 'APPROVED' });
            }
            else if (selectedItem.label === 'Cancel Meeting' ){
                refetch({ status: 'CANCELED', search: searchValue });
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

    if (loading || updating || onUpdating) {
        return (
          <Flex justify="center" align="center" className='h-200'>
            <Spin size="large" />
          </Flex>
        );
    }

    return (
        <>
            <Flex vertical gap={20}>
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <Flex gap={5} wrap>
                                <SearchInput
                                    name='name'
                                    placeholder='Search'
                                    prefix={<img src='/assets/icons/search.png' width={14} alt='search icon' fetchPriority="high"/>}
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <Dropdown 
                                    menu={{ 
                                        items: meetingItems.map((item) => ({
                      ...item,
                      label: t(item.label), 
                    })),
                                        onClick: handleStatusClick
                                    }} 
                                    trigger={['click']}
                                >
                                    <Button aria-labelledby='filter status' className="btncancel px-3 filter-bg fs-13 text-black">
                                        <Flex justify='space-between' align='center' gap={30}>
                                            {t(selectedStatus)}
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
                    columns={schedulemeetingColumn(setVisible,setDeleteItem)}
                    dataSource={schedulemeetingData.slice((current - 1) * pageSize, current * pageSize)}
                    className='pagination table-cs table'
                    showSorterTooltip={false}
                    scroll={{ x: 2300 }}
                    rowHoverable={false}
                    pagination={false}
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
        </>
    );
};

export { ScheduleMeetingTable };