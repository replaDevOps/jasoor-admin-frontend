import { Button, Card, Col, Dropdown, Flex, Form, Row, Table ,Input,Typography,Space} from 'antd';
import { NavLink } from "react-router-dom";
import { useState } from 'react';
import { districtItems, statusItems, typeItems } from '../../../shared';
import { CustomPagination } from '../../Ui';
import { UPDATE_USER } from '../../../graphql/mutation'

import { USERS } from '../../../graphql/query/user';
import { useQuery,useMutation } from '@apollo/client'
import { message,Spin } from "antd";

const { Text } = Typography

const UserManagementTable = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const usermanageColumn = ( ) =>  [
        {
            title: 'Full Name',
            dataIndex: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'District',
            dataIndex: 'district',
        },
        {
            title: 'City',
            dataIndex: 'city',
        },
        {
            title: 'Mobile Number',
            dataIndex: 'mobileno',
        },
        {
            title: 'Type',
            dataIndex: 'type',
             render: (type) => {
                return (
                    type === 'New' ? (
                        <Text className='btnpill fs-12 branded'>New</Text>
                    ) : (
                        <Text className='btnpill fs-12 pending'>Old</Text>
                    ) 
                )
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                return (
                    status === 1 ? (
                        <Space align='center'>
                            <Text className='btnpill fs-12 success'>Active</Text>
                        </Space>
                    ) : (
                        <Text className='btnpill fs-12 inactive'>Inactive</Text>
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
                const handleSetInactive = async () => {
                    try {
                        await updateUser({
                            variables: {
                                input: {
                                    id: row.key, 
                                    isActive: row.status === 1, // send null as requested
                                }
                            }
                        });
                        messageApi.success("User status updated successfully!");
                    } catch (err) {
                        messageApi.error(err.message || "Something went wrong!");
                    }
                };
        
                return (
                    <Dropdown
                        menu={{
                            items: [
                                { 
                                    label: <NavLink onClick={(e) => { e.preventDefault(); handleSetInactive(); }}>Inactive</NavLink>, 
                                    key: '1' 
                                },
                                { 
                                    label: <NavLink onClick={(e) => { e.preventDefault(); /* handle view passport */ }}>View Passport & National ID</NavLink>, 
                                    key: '2' 
                                },
                            ],
                        }}
                        trigger={['click']}
                    >
                        <Button className="bg-transparent border0 p-0">
                            <img src="/assets/icons/dots.png" alt="" width={16} />
                        </Button>
                    </Dropdown>
                );
            }
        },
    ];
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchText, setSearchText] = useState("");

    // Prepare filter object for API
    const filter = {
        city: selectedCity || null,
        district: selectedDistrict || null,
        isActive: selectedStatus === "Status" ? null : selectedStatus,
        name: searchText || null,
    };

    const { loading, data, refetch } = useQuery(USERS, {
        variables: {
            limit: pageSize,
            offset: (current - 1) * pageSize,
            filter
        },
        fetchPolicy: "network-only"
    });

    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
        refetch({
            limit: size,
            offset: (page - 1) * size,
            filter
        });
    };

    const handleStatusClick = ({ key }) => {
        // Find the selected status item
        const selectedItem = statusItems.find(item => String(item.key) === String(key));
        if (selectedItem) {
            const isActive = selectedItem.key === '2' ? true 
                            : selectedItem.key === '3' ? false 
                            : null;

            setSelectedStatus(selectedItem.label); // store label for UI
    
            refetch({
                limit: pageSize,
                offset: (current - 1) * pageSize,
                filter: { ...filter, isActive } // send boolean/null to API
            });
        }
    };
    
    const handleCategoryClick = ({ key }) => {
        const selectedItem = typeItems.find(item => String(item.key) === String(key));
        if (!selectedItem) return;
        setSelectedCategory(selectedItem.label); // store label for UI

        let createdType = null;
        if (selectedItem.key === '1') createdType = null;
        if (selectedItem.key === '2') createdType = 'old';
        if (selectedItem.key === '3') createdType = 'new';
    
        const newFilter = {
            city: selectedCity || null,
            district: selectedDistrict || null,
            isActive: selectedStatus === "Status" ? null : selectedStatus,
            name: searchText || null,
            createdType // will be null / 'old' / 'new'
        };
    
        refetch({
            limit: pageSize,
            offset: (current - 1) * pageSize,
            filter: newFilter
        });
    };

    const handleDistrictClick = ({ key }) => {
        const selectedItem = districtItems.find(item => String(item.key) === String(key));
        if (selectedItem) {
            setSelectedDistrict(selectedItem.label); // store name/label
            refetch({
                limit: pageSize,
                offset: (current - 1) * pageSize,
                filter: { ...filter, district: selectedItem.label } // send name
            });
        }
    
    };

    const handleCityClick = ({ key }) => {
        const selectedItem = districtItems.find(item => String(item.key) === String(key));
        if (selectedItem) {
            setSelectedCity(selectedItem.label);
            refetch({
                limit: pageSize,
                offset: (current - 1) * pageSize,
                filter: { ...filter, city: selectedItem.label }
            });
        }
    };    

    const handleSearch = (value) => {
        setSearchText(value);
        refetch({
            limit: pageSize,
            offset: 0,
            filter: { ...filter, name: value }
        });
    };

    const users = data?.getUsers?.users?.map((user, index) => ({
        key: user.id,
        fullname: user.name,
        email: user.email,
        district: user.district,
        city: user.city,
        mobileno: user.phone,
        type: user.type, // or derive from createdAt if backend sends it
        status: user.isActive ? 1 : 0,
    })) || [];
    const total = data?.getUsers?.totalCount; // Or return total count from backend if available

    const [updateUser,{ loading: updating }] = useMutation(UPDATE_USER, {
        refetchQueries: [  { query: USERS } ],
        awaitRefetchQueries: true,
    });
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
        <Card className='radius-12 border-gray'>
            <Flex vertical gap={20}>
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                        <Col lg={24} md={16} sm={24} xs={24}>
                        <Row gutter={[16, 16]}>
                        <Col span={6}>
                        <Input
                                    name='name'
                                    placeholder='Search'
                                    prefix={<img src='/assets/icons/search.png' width={14} />}
                                    allowClear
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                    onChange={(e) => handleSearch(e.target.value.trim())}
                                />
                        </Col>
                        <Col span={14}>
                        <Dropdown menu={{ items: districtItems, onClick: handleDistrictClick }}>
                                    <Button>{selectedDistrict || "District"}</Button>
                                </Dropdown>
                                <Dropdown menu={{ items: districtItems, onClick: handleCityClick }}>
                                    <Button>{selectedCity || "City"}</Button>
                                </Dropdown>
                                <Dropdown menu={{ items: typeItems, onClick: handleCategoryClick }}>
                                    <Button>{selectedCategory || "Type"}</Button>
                                </Dropdown>
                                <Dropdown menu={{ items: statusItems, onClick: handleStatusClick }}>
                                    <Button>{selectedStatus || "Status"}</Button>
                                </Dropdown>
                            </Col>
                        </Row>
                            <Flex gap={5} wrap>
                               
                               
                            </Flex>
                        </Col>
                    </Row>
                </Form>
                <Table
                    size='large'
                    columns={usermanageColumn()}
                    dataSource={users}
                    className='pagination table-cs table'
                    loading={loading}
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

export { UserManagementTable };