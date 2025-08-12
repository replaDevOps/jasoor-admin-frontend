import { Button, Card, Col, Dropdown, Flex, Form, Row, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { pushnotifyColumn, pushnotifyData } from '../../../data';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { districtItems, groupItems, pushstatusItem } from '../../../shared';
import { CustomPagination } from '../../Ui';


const PushNotificationTable = ({setVisible, setViewNotify, setEditItem, setDeleteItem}) => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [selectedCategory, setSelectedCategory] = useState('Group');
    const [selectedDistrict, setSelectedDistrict] = useState('District');
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const total = pushnotifyData.length;

    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    
    const handleStatusClick = ({ key }) => {
        const selectedItem = pushstatusItem.find(item => item.key === key);
        if (selectedItem) {
            setSelectedStatus(selectedItem.label);
        }
    };

    const handleCategoryClick = ({ key }) => {
        const selectedItem = groupItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedCategory(selectedItem.label);
        }
    };

    const handleDistrictClick = ({ key }) => {
        const selectedItem = districtItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedDistrict(selectedItem.label);
        }
    };

    

    return (
        <>
            <Card className='radius-12 border-gray'>
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
                                            items: groupItems,
                                            onClick: handleCategoryClick
                                        }} 
                                        trigger={['click']}
                                    >
                                        <Button className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify='space-between' align='center' gap={30}>
                                                {selectedCategory}
                                                <DownOutlined />
                                            </Flex>
                                        </Button>
                                    </Dropdown>
                                    <Dropdown 
                                        menu={{ 
                                            items: districtItems,
                                            onClick: handleDistrictClick
                                        }} 
                                        trigger={['click']}
                                    >
                                        <Button className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify='space-between' align='center' gap={30}>
                                                {selectedDistrict}
                                                <DownOutlined />
                                            </Flex>
                                        </Button>
                                    </Dropdown>
                                    <Dropdown 
                                        menu={{ 
                                            items: pushstatusItem,
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
                        columns={pushnotifyColumn({setVisible,setViewNotify ,setEditItem,setDeleteItem})}
                        dataSource={pushnotifyData.slice((current - 1) * pageSize, current * pageSize)}
                        className='pagination table-cs table'
                        showSorterTooltip={false}
                        scroll={{ x: 1000 }}
                        rowHoverable={false}
                        pagination={false}
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

export { PushNotificationTable };