import { Button, Card, Col, Dropdown, Flex, Form, Row, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { contactreqData, contactrequestColumn } from '../../../data';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { CustomPagination } from '../../Ui';


const ContactRequestTable = ({setVisible,setSendView,setViewItem}) => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const total = contactreqData.length;
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    
    const handleStatusClick = ({ key }) => {
        const selectedItem = statusItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedStatus(selectedItem.label);
        }
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