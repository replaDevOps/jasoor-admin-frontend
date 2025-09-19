import { Button, Card, Col, Dropdown, Flex, Form, Row, Table,Typography } from 'antd';
import { SearchInput } from '../../Forms';
import { NavLink } from "react-router-dom";
import { useState,useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { CustomPagination, DeleteModal } from '../../Ui';
import { UPDATE_USER,DELETE_USER } from '../../../graphql/mutation'
import { GETSTAFFMEMBERS,GETROLES } from '../../../graphql/query';
import { useQuery,useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const { Text } = Typography
const StaffMemberTable = ({setVisible,setEditItem,setRefetchStaff}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [selectedRole, setSelectedRole] = useState('Role');
    const [ deleteitem, setDeleteItem ] = useState(false)
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);

    const staffmemberColumn = (setVisible,setDeleteItem,setEditItem) =>  [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                if (status === "verified") {
                  return <Text className="btnpill fs-12 success">Active</Text>;
                } else if (status === "inactive") {
                  return <Text className="btnpill fs-12 inactive">Inactive</Text>;
                } else if (status === "pending") {
                  return <Text className="btnpill fs-12 pending">Pending</Text>;
                }
                return null;
            }
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            width: 100,
            render: (_, row) => {
              const handleUpdateStatus = async (newStatus) => {
                try {
                  await updateUser({
                    variables: {
                      input: {
                        id: row.key,
                        status: newStatus,
                      },
                    },
                  });
                  messageApi.success("User status updated successfully!");
                } catch (err) {
                  messageApi.error(err.message || "Something went wrong!");
                }
              };
              
              // Decide action based on current status
              let actionLabel = "";
              let nextStatus = "";
        
              if (row.status === "pending") {
                actionLabel = "Verify";
                nextStatus = "verified";
              } else if (row.status === "verified") {
                actionLabel = "Inactive";
                nextStatus = "inactive";
              } else if (row.status === "inactive") {
                actionLabel = "Verify";
                nextStatus = "verified";
              }
        
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        label: (
                          <NavLink
                            onClick={(e) => {
                              e.preventDefault();
                              setVisible(true);
                              setEditItem(row);
                            }}
                          >
                            Edit
                          </NavLink>
                        ),
                        key: "1",
                      },
                      {
                        label: (
                          <NavLink
                            onClick={(e) => {
                              e.preventDefault();
                              handleUpdateStatus(nextStatus);
                            }}
                          >
                            {actionLabel}
                          </NavLink>
                        ),
                        key: "2",
                      },
                      {
                        label: (
                          <NavLink
                            onClick={(e) => {
                              e.preventDefault();
                              setDeleteItem(true);
                              setSelectedUserId(row.key)
                            }}
                          >
                            Delete
                          </NavLink>
                        ),
                        key: "3",
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <Button aria-labelledby='action button' className="bg-transparent border0 p-0">
                    <img src="/assets/icons/dots.png" alt="dot icon" width={16} fetchPriority="high" />
                  </Button>
                </Dropdown>
              );
            },
        },
    ];

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
    useEffect(() => {
        if(setRefetchStaff) setRefetchStaff(refetch);
    }, [refetch, setRefetchStaff]);
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

    const [updateUser,{ loading: updating }] = useMutation(UPDATE_USER, {
        refetchQueries: [  { query: GETSTAFFMEMBERS } ],
        awaitRefetchQueries: true,
    });
    const [deleteUser,{ loading: deleting }] = useMutation(DELETE_USER, {
        refetchQueries: [  { query: GETSTAFFMEMBERS } ],
        awaitRefetchQueries: true,
    });
    if (loading || updating || deleting) {
        return (
          <Flex justify="center" align="center"className='h-200'>
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
                                        prefix={<img src='/assets/icons/search.png' width={14} alt='search icon' fetchPriority="high" />}
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
                                        <Button aria-labelledby='filter role' className="btncancel px-3 filter-bg fs-13 text-black">
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
                onConfirm={() => {
                    if (selectedUserId) {
                        deleteUser({
                        variables:  { deleteUserId: selectedUserId } ,
                      });
                    }
                    setDeleteItem(false);
                }}
            />
        </>
    );
};

export { StaffMemberTable };