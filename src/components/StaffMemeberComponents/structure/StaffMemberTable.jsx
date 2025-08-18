import { Button, Card, Col, Dropdown, Flex, Form, Row, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { staffData, staffmemberColumn } from '../../../data';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { CustomPagination, DeleteModal } from '../../Ui';
import { GETSTAFFMEMBERS,GETROLES } from '../../../graphql/query';
import { useQuery } from '@apollo/client';

const StaffMemberTable = ({setVisible,setEditItem}) => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [selectedRole, setSelectedRole] = useState('Role');
    const [ deleteitem, setDeleteItem ] = useState(false)
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
  const [searchText, setSearchText] = useState("");


  const { loading: rolesLoading, data: rolesData } = useQuery(GETROLES)

    const { loading, data,refetch } = useQuery(GETSTAFFMEMBERS, {
        variables: {
            limit: pageSize,
            offset: (current - 1) * pageSize,
            search: form.getFieldValue('name') || '',
            isActive: selectedStatus === 'Active' ? true : selectedStatus === 'Inactive' ? false : null,
            role: selectedRole === 'All' ? null : selectedRole
        },
        fetchPolicy: "network-only"
    });
    const roles = rolesData?.getRoles
        ?.filter(role => role.name !== "Customer") || [];
    const total = data?.getStaffMembers?.totalCount || 0;
    const staffData = data?.getStaffMembers?.users.map(user => ({
        ...user,
        key: user.id,
        role: user.role?.name || 'N/A',
    })) || [];

    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    
    const handleStatusClick = ({ key }) => {
        const selectedItem = statusItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedStatus(selectedItem.label);
            refetch({
                limit: pageSize,
                offset: 0,
                search: searchText || null,
                isActive: selectedItem.key === "2" ? true 
                        : selectedItem.key === "3" ? false 
                        : selectedItem.key === "1" ?  null
                            : null, // Adjust logic for 'All' or other statuses
            });
        }
    };

    const handleSearch = (value) => {
        setSearchText(value);
        refetch({
            limit: pageSize,
            offset: 0,
            search: value || null,
        });
    };

    const statusItems = [
        { key: '1', label: 'All' },
        { key: '2', label: 'Active' },
        { key: '3', label: 'Inactive' }
    ];

    // const roleItems = [
    //     { key: '1', label: 'All' },
    //     { key: '2', label: 'Manager' },
    //     { key: '3', label: 'Sub-admin' }
    // ];

    const roleItems = roles?.map(role => ({
        key: role?.id,        
        label: role?.name
    })) || [];
    
    const handleCategoryClick = ({ key, domEvent }) => {
        domEvent.preventDefault(); // prevent default if needed
        const selected = roles.find(r => r.id === key);
        if (selected) {
            setSelectedRole(selected.name);
            refetch({
                limit: pageSize,
                offset: 0,
                search: searchText || null,
                roleId: selected.id
            });
        }
    };

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
                                        onChange={(e) => handleSearch(e.target.value.trim())}
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