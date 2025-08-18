import { Button, Card, Col, Dropdown, Flex, Form, Row, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { contactreqData, contactrequestColumn } from '../../../data';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { CustomPagination } from '../../Ui';
import { GET_ALL_CONTACT_US } from '../../../graphql/query/user';
import { useQuery } from '@apollo/client';

const ContactRequestTable = ({setVisible,setSendView,setViewItem}) => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [searchValue, setSearchValue] = useState('');

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

    const total = data?.getAllContactUs?.totalCount || 0;
    const contactreqData = (data?.getAllContactUs?.contactUs || []).map((item, index) => ({
        key: index + 1,
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
            console.log(selectedItem);
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

    return (
        <>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={20}>
                    <Form form={form} layout="vertical">
                        <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                            <Col xl={18} lg={16} md={24} sm={24} xs={24}>
                                <Flex gap={5} wrap>
                                    <SearchInput
                                        name='name'
                                        placeholder='Search'
                                        prefix={<img src='/assets/icons/search.png' width={14} />}
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
                                        <Button className="btncancel px-3 filter-bg fs-13 text-black">
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