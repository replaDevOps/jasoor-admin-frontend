import { Button, Card, Col, Dropdown, Flex, Form, Row, Table ,Input,Typography,Space,message,Spin} from 'antd';
import { NavLink } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react';
import { districtItems, statusItems, typeItems } from '../../../shared';
import { CustomPagination } from '../../Ui';
import { ViewIdentity } from '../modals';
import { UPDATE_USER } from '../../../graphql/mutation'
import { USERS } from '../../../graphql/query/user';
import { useLazyQuery,useMutation } from '@apollo/client'
import { DownOutlined } from '@ant-design/icons';
import { t } from 'i18next';


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
    const [viewmodal, setViewModal] = useState(false)
    const [viewstate, SetViewState] = useState(null)
    const [messageApi, contextHolder] = message.useMessage();

    const [loadUsers, { data, loading }] = useLazyQuery(USERS, {
        fetchPolicy: "network-only"
    });

    const filter = useMemo(() => {
        let createdType = null;
        if (selectedCategory === 'Old') createdType = 'old';
        if (selectedCategory === 'New') createdType = 'new';

        let isActive = null;
        if (selectedStatus === 'Active') isActive = true;
        if (selectedStatus === 'Inactive') isActive = false;

        return {
            city: selectedCity || null,
            district: selectedDistrict || null,
            isActive,
            name: searchText || null,
            createdType
        };
    }, [selectedCity, selectedDistrict, selectedStatus, selectedCategory, searchText]);

    useEffect(() => {
        loadUsers({
            variables: {
                limit: pageSize,
                offset: (current - 1) * pageSize,
                filter
            }
        });
    }, [pageSize, current, filter, loadUsers]);

    const [updateUser,{ loading: updating }] = useMutation(UPDATE_USER, {
        onCompleted: () => {
            loadUsers({
                variables: {
                    limit: pageSize,
                    offset: (current - 1) * pageSize,
                    filter
                }
            });
        }
    });

    const usermanageColumn = [
        {
            title: t('Full Name'),
            dataIndex: 'fullname',
        },
        {
            title: t('Email'),
            dataIndex: 'email',
        },
        {
            title: t('District'),
            dataIndex: 'district',
        },
        {
            title: t('City'),
            dataIndex: 'city',
        },
        {
            title: t('Mobile Number'),
            dataIndex: 'mobileno',
        },
        {
            title: t('Type'),
            dataIndex: 'type',
            render: (type) => (
                type === 'New'
                    ? <Text className='btnpill fs-12 branded'>{t("New")}</Text>
                    : <Text className='btnpill fs-12 pending'>{t("Old")}</Text>
            )
        },
        {
            title: t('Status'),
            dataIndex: 'status',
            render: (status) => {
                if (status === 'verified') {
                    return <Text className="btnpill fs-12 success">{t("Active")}</Text>;
                } else if (status === 'pending') {
                    return <Text className="btnpill fs-12 inactive">{t("Pending")}</Text>;
                } else if (status === 'inactive') {
                    return <Text className="btnpill fs-12 inactive">{t("Inactive")}</Text>;
                } 
            }
        },
        {
            title: t('Action'),
            key: "action",
            fixed: "right",
            width: 100,
            render: (_, row) => {
                const handleStatusChange = async () => {
                    try {
                        await updateUser({
                            variables: {
                                input: {
                                    id: row.key, 
                                    status: row.status==='verified'? 'inactive' : 'verified',
                                }
                            }
                        });
                        messageApi.success(t("User status updated successfully!"));
                    } catch (err) {
                        messageApi.error(err.message || "Something went wrong!");
                    }
                };
                return (
                    <Dropdown
                        menu={{
                            items: [
                                { 
                                    label: <NavLink onClick={(e) => { e.preventDefault(); setVisible(true); setEditItem(row); }}>{t("Edit")}</NavLink>, 
                                    key: '1' 
                                },
                                ...(row.status === 'verified'
                                    ? [
                                        {
                                            label: (
                                                <NavLink onClick={(e) => { e.preventDefault(); handleStatusChange(row); }}>
                                                    {t("Inactive")}
                                                </NavLink>
                                            ),
                                            key: '2'
                                        }
                                    ]
                                    : [
                                        {
                                            label: (
                                                <NavLink onClick={(e) => { e.preventDefault(); handleStatusChange(row); }}>
                                                    {t("Verify")}
                                                </NavLink>
                                            ),
                                            key: '2'
                                        }
                                    ]
                                ),
                                { 
                                    label: <NavLink onClick={(e) => { e.preventDefault(); }}>{t("Delete")}</NavLink>, 
                                    key: '3' 
                                },
                                { 
                                    label: <NavLink onClick={(e) => { e.preventDefault(); setViewModal(true);SetViewState(row) }}>{t("View Passport & National ID")}</NavLink>, 
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

    // ----------------- Handlers -----------------
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };

    const handleStatusClick = ({ key }) => {
        const selectedItem = statusItems.find(item => String(item.key) === String(key));
        if (selectedItem) setSelectedStatus(selectedItem.label);
    };

    const handleCategoryClick = ({ key }) => {
        const selectedItem = typeItems.find(item => String(item.key) === String(key));
        if (selectedItem) setSelectedCategory(selectedItem.label);
    };

    const handleDistrictClick = ({ key }) => {
        const selectedItem = districtItems.find(item => String(item.key) === String(key));
        if (selectedItem) setSelectedDistrict(selectedItem.label);
    };

    const handleCityClick = ({ key }) => {
        const selectedItem = districtItems.find(item => String(item.key) === String(key));
        if (selectedItem) setSelectedCity(selectedItem.label);
    };    

    const handleSearch = (value) => {
        setSearchText(value);
        setCurrent(1); // reset to first page when searching
    };

    // ----------------- Data Mapping -----------------
    const usermanageData = data?.getUsers?.users?.map((user) => ({
        key: user.id,
        fullname: user.name,
        email: user.email,
        district: user.district,
        city: user.city,
        mobileno: user.phone,
        type: user.type,
        status: user.status,
    })) || [];

    const total = data?.getUsers?.totalCount;

    if (loading || updating) {
        return (
          <Flex justify="center" align="center" className='h-200'>
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
                                    placeholder={t('Search')}
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
                                                {selectedDistrict || t("District")}
                                                <DownOutlined />
                                            </Flex>
                                        </Button>
                                    </Dropdown>
                                    <Dropdown menu={{ items: districtItems, onClick: handleCityClick }}>
                                        <Button aria-labelledby='filter city' className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify="space-between" align="center" gap={30}>
                                                {selectedCity || t("City")}
                                                <DownOutlined />
                                            </Flex>
                                        </Button>
                                    </Dropdown>
                                    <Dropdown menu={{ items: typeItems, onClick: handleCategoryClick }}>
                                        <Button aria-labelledby='filter type' className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify="space-between" align="center" gap={30}>
                                                {selectedCategory || t("Type")}
                                                <DownOutlined />
                                            </Flex>
                                        </Button>
                                    </Dropdown>
                                    <Dropdown menu={{ items: statusItems, onClick: handleStatusClick }}>
                                        <Button aria-labelledby='filter status' className="btncancel px-3 filter-bg fs-13 text-black">
                                            <Flex justify="space-between" align="center" gap={30}>
                                                {selectedStatus || t("Status")}
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
                        dataSource={usermanageData}
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

            <ViewIdentity 
                visible={viewmodal}
                viewstate={viewstate}
                onClose={()=>{setViewModal(false);SetViewState(null)}}
            />
        </>
    );
};

export { UserManagementTable };