import { Button, Card, Col, Dropdown, Flex, Form, Row, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { staffData, staffmemberColumn } from '../../../data';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { CustomPagination, DeleteModal } from '../../Ui';


const StaffMemberTable = ({setVisible,setEditItem}) => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [selectedRole, setSelectedRole] = useState('Role');
    const [ deleteitem, setDeleteItem ] = useState(false)
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const total = staffData.length;
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

    const handleCategoryClick = ({ key }) => {
        const selectedItem = roleItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedRole(selectedItem.label);
        }
    };

    const statusItems = [
        { key: '1', label: 'All' },
        { key: '2', label: 'Active' },
        { key: '3', label: 'Inactive' }
    ];

    const roleItems = [
        { key: '1', label: 'All' },
        { key: '2', label: 'Manager' },
        { key: '3', label: 'Sub-admin' }
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
                                            items: roleItems,
                                            onClick: handleCategoryClick
                                        }} 
                                        trigger={['click']}
                                    >
                                        <Button className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify='space-between' align='center' gap={30}>
                                                {selectedRole}
                                                <DownOutlined />
                                            </Flex>
                                        </Button>
                                    </Dropdown>
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
                        columns={staffmemberColumn(setVisible,setDeleteItem,setEditItem)}
                        dataSource={staffData.slice((current - 1) * pageSize, current * pageSize)}
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
            <DeleteModal 
                visible={deleteitem}
                onClose={()=>setDeleteItem(false)}
                title='Are you sure?'
                subtitle='This action cannot be undone. Are you sure you want to delete this staff member?'
                type='danger'
            />
        </>
    );
};

export { StaffMemberTable };