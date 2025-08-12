import { Button, Col, Dropdown, Flex, Form, Row, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { inprogressdealColumn, inprogressdealData } from '../../../data';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { businessdealItems } from '../../../shared';
import { useNavigate } from 'react-router-dom';
import { CustomPagination } from '../../Ui';



const InprogressDealTable = () => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const total = inprogressdealData.length;
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    
    const handleStatusClick = ({ key }) => {
        const selectedItem = businessdealItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedStatus(selectedItem.label);
        }
    };

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
                                    prefix={<img src='/assets/icons/search.png' width={14} />}
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                />
                                <Dropdown 
                                    menu={{ 
                                        items: businessdealItems,
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
                    columns={inprogressdealColumn}
                    dataSource={inprogressdealData.slice((current - 1) * pageSize, current * pageSize)}
                    className='pagination table-cs table'
                    showSorterTooltip={false}
                    scroll={{ x: 1600 }}
                    rowHoverable={false}
                    onRow={(record) => ({
                        onClick: () => navigate('/businessdeal/details/'+record?.key)
                    })}
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

export { InprogressDealTable };