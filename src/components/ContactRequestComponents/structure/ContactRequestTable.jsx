import { Button, Card, Col, Dropdown, Flex, Form, Row, Table,Tooltip,Typography } from 'antd';
import { SearchInput } from '../../Forms';
import { useState,useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { CustomPagination } from '../../Ui';
import { GET_ALL_CONTACT_US } from '../../../graphql/query/user';
import { useQuery } from '@apollo/client';
import { message,Spin } from "antd";
const { Text } = Typography;

const ContactRequestTable = ({setVisible,setSendView,setViewItem,setRefetch}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [searchValue, setSearchValue] = useState('');
    
    const contactrequestColumn = (setVisible,setSendView,setViewItem) =>  [
        {
            title: 'Full Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Massage Preview',
            dataIndex: 'msgPreview',
            render: (msgPreview) => {
                const words = msgPreview?.split(' ') || [];
                const previewText = words.slice(0, 5).join(' ');
                const showEllipsis = words.length > 5;
    
                return (
                    <Tooltip title={msgPreview}>
                        <Text>
                            {previewText}{showEllipsis ? '...' : ''}
                        </Text>
                    </Tooltip>
                );
            }
        },
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Reply Status',
            dataIndex: 'status',
            render: (status) => {
                return (
                    status === 1 ? (
                        <Text className='btnpill fs-12 success'>Sent</Text>
                    ) : (
                        <Text className='btnpill fs-12 inactive'>Pending</Text>
                    )
                )
            }
        },
        {
            title: 'Action',
            key: "action",
            fixed: "right",
            width: 100,
            render: (_, row) => {
                // Only show button if status is pending
                if (row.status !== 1) {
                  return (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => {
                        setVisible(true);
                        setSendView(true);
                        setViewItem(row);
                      }}
                      aria-labelledby='Response'
                    >
                    Response
                    </Button>
                  );
                }
                return <img src="/assets/icons/rejected.png" width={20} /> // show nothing if already sent
            },
        },
    ];
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const { loading, data,refetch } = useQuery(GET_ALL_CONTACT_US, {
        variables: {
            limit: pageSize,
            offset: (current - 1) * pageSize,
            search: searchValue,
            status: selectedStatus === 'Send' ? true : selectedStatus === 'Pending' ? false : null
        }
    })
    useEffect(() => {
        if(setRefetch) setRefetch(refetch);
    }, [refetch, setRefetch]);

    const total = data?.getAllContactUs?.totalCount || 0;
    const contactreqData = (data?.getAllContactUs?.contactUs || []).map((item, index) => ({
        key: item.id,
        name: item.name,
        email: item.email,
        msgPreview: item.message,
        answer: item.answer || 'No answer yet',
        date: new Date(item?.createdAt).toLocaleDateString(),
        status: item.isResponded ? 1 : 0
    }));

    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    
    const handleStatusClick = ({ key }) => {
        const selectedItem = statusItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedStatus(selectedItem.label);
            if( selectedItem.label === 'All') {
                refetch({ search: searchValue, status: null });
            }else if( selectedItem.label === 'Send') {
                refetch({ search: searchValue, status: true });
            }
            else if( selectedItem.label === 'Pending') {
                refetch({ search: searchValue, status: false });
            }
        }
    };
    const handleSearch = (value) => {
        setSearchValue(value);
        refetch({ search: value });
    };


    const statusItems = [
        { key: '1', label: 'All' },
        { key: '2', label: 'Send' },
        { key: '3', label: 'Pending' }
    ];
    if (loading) {
        return (
          <Flex justify="center" align="center" style={{ height: '200px' }}>
            <Spin size="large" />
          </Flex>
        );
    }
    return (
        <>
        {contextHolder}
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={20}>
                    <Form form={form} layout="vertical">
                        <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                            <Col xl={18} lg={16} md={24} sm={24} xs={24}>
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
                                            items: statusItems,
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
                        columns={contactrequestColumn(setVisible,setSendView,setViewItem)}
                        dataSource={contactreqData.slice((current - 1) * pageSize, current * pageSize)}
                        className='pagination table-cs table'
                        showSorterTooltip={false}
                        scroll={{ x: 1000 }}
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
            </Card>
        </>
    );
};

export { ContactRequestTable };