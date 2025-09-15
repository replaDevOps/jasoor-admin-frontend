import { Button, Card, Col, Dropdown, Flex, Form, Row, Table ,Input,Typography,Space,message,Spin} from 'antd';
import { NavLink } from "react-router-dom";
import { useState } from 'react';
import { districtItems, statusItems, typeItems } from '../../../shared';
import { CustomPagination } from '../../Ui';
import { ViewIdentity } from '../modals';
import { UPDATE_USER } from '../../../graphql/mutation'
import { USERS } from '../../../graphql/query/user';
import { useQuery,useMutation } from '@apollo/client'
import { DownOutlined } from '@ant-design/icons';

const { Text } = Typography

const UserManagementTable = ({setVisible,setEditItem}) => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [ viewmodal, setViewModal ] = useState(false)
    const [ viewstate, SetViewState ] = useState(null)
    const [messageApi, contextHolder] = message.useMessage();
    const usermanageColumn = [
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
                                    label: <NavLink onClick={(e) => { e.preventDefault(); setVisible(true); setEditItem(row); }}>Edit</NavLink>, 
                                    key: '1' 
                                },
                                { 
                                    label: <NavLink onClick={(e) => { e.preventDefault(); handleSetInactive(); }}>Inactive</NavLink>, 
                                    key: '2' 
                                },
                                { 
                                    label: <NavLink onClick={(e) => { e.preventDefault();  }}>Delete</NavLink>, 
                                    key: '3' 
                                },
                                { 
                                    label: <NavLink onClick={(e) => { e.preventDefault(); setViewModal(true);SetViewState(row) }}>View Passport & National ID</NavLink>, 
                                    key: '4' 
                                },
                            ],
                        }}
                        trigger={['click']}
                    >
                        <Button aria-labelledby='action button' className="bg-transparent border0 p-0">
                            <img src="/assets/icons/dots.png" alt="dot icon" width={16} fetchPriority="high" />
                        </Button>
                    </Dropdown>
                );
            }
        },
    ];
    

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
            filter: null
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

    const usermanageData = data?.getUsers?.users?.map((user, index) => ({
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
                    <Row gutter={[16, 16]}>
                            <Col span={6}>
                                <Input
                                    name='name'
                                    placeholder='Search'
                                    prefix={<img src='/assets/icons/search.png' width={14} alt='search icon' fetchPriority="high"/>}
                                    allowClear
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                    onChange={(e) => handleSearch(e.target.value.trim())}
                                />
                            </Col>
                            <Col span={14}>
                                <Flex gap={5} wrap>
                                    <Dropdown menu={{ items: districtItems, onClick: handleDistrictClick }}>
                                        <Button aria-labelledby='filter district'  className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify="space-between" align="center" gap={30}>
                                                {selectedDistrict || "District"}
                                                <DownOutlined />
                                            </Flex>
                                        </Button>
                                    </Dropdown>
                                    <Dropdown menu={{ items: districtItems, onClick: handleCityClick }}>
                                        <Button aria-labelledby='filter city' className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify="space-between" align="center" gap={30}>
                                                {selectedCity || "City"}
                                                <DownOutlined />
                                            </Flex>
                                        </Button>
                                    </Dropdown>
                                    <Dropdown menu={{ items: typeItems, onClick: handleCategoryClick }}>
                                        <Button aria-labelledby='filter type' className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify="space-between" align="center" gap={30}>
                                                {selectedCategory || "Type"}
                                                <DownOutlined />
                                            </Flex>
                                        </Button>
                                    </Dropdown>
                                    <Dropdown menu={{ items: statusItems, onClick: handleStatusClick }}>
                                        <Button aria-labelledby='filter status' className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify="space-between" align="center" gap={30}>
                                                {selectedStatus || "Status"}
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
                        columns={usermanageColumn}
                        dataSource={usermanageData.slice((current - 1) * pageSize, current * pageSize)}
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

            <ViewIdentity 
                visible={viewmodal}
                viewstate={viewstate}
                onClose={()=>{setViewModal(false);SetViewState(null)}}
            />
        </>
    );
};

export { UserManagementTable };