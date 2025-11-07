import { Button, Card, Col, Dropdown, Flex, Form, Row, Table ,Typography,message } from 'antd';
import { NavLink } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react';
import { CustomPagination, DeleteModal } from '../../Ui';
import { MySelect, SearchInput } from '../../Forms';
import { ViewIdentity } from '../modals';
import { UPDATE_USER, DELETE_USER } from '../../../graphql/mutation'
import { USERS } from '../../../graphql/query/user';
import { useLazyQuery,useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next';

const { Text } = Typography
const UserManagementTable = ({setVisible,setEditItem}) => {

    const [form] = Form.useForm();
    const { t } = useTranslation();
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [viewmodal, setViewModal] = useState(false)
    const [viewstate, SetViewState] = useState(null)
    const [deleteVisible, setDeleteVisible] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)
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

    const [deleteUser, { loading: deleting }] = useMutation(DELETE_USER, {
        onCompleted: () => {
            messageApi.success(t('User deleted successfully!'));
            loadUsers({
                variables: {
                    limit: pageSize,
                    offset: (current - 1) * pageSize,
                    filter
                }
            });
        },
        onError: (err) => {
            messageApi.error(err.message || t('Something went wrong!'));
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
            title: t('Region'),
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
                type === 'new'
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
                                    label: <NavLink onClick={(e) => { e.preventDefault(); setSelectedUserId(row.key); setDeleteVisible(true); }}>{t("Delete")}</NavLink>, 
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

    const handleStatusClick = (key) => {
        const selectedItem = statusItems.find(item => String(item.id) === String(key));
        if (selectedItem) setSelectedStatus(selectedItem.name);
    };

    const handleCategoryClick = (key) => {
        const selectedItem = typeItems.find(item => String(item.id) === String(key));
        if (selectedItem) setSelectedCategory(selectedItem.name);
    };

    const handleDistrictClick = (key) => {
        const selectedItem = districtItems.find(item => String(item.id) === String(key));
        if (selectedItem) setSelectedDistrict(selectedItem.name);
    };

    const handleCityClick = (key) => {
        const selectedItem = districtItems.find(item => String(item.id) === String(key));
        if (selectedItem) setSelectedCity(selectedItem.name);
    };    

    const handleSearch = (value) => {
        setSearchText(value);
        setCurrent(1);
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
        documents: user.documents
    })) || [];

    const total = data?.getUsers?.totalCount;

    const districtItems = [
        { id: '1', name: t('Makkah') },
        { id: '2', name: t('Eastern') },
        { id: '3', name: t('Al-Madinah') },
        { id: '4', name: t('Asir') },
        { id: '5', name: t('Tabuk') },
        { id: '6', name: t('Najran') },
        { id: '7', name: t('Al-Qassim') },
        { id: '8', name: t('Hail') },
        { id: '9', name: t('Al-Jouf') },
        { id: '10', name: t('Al-Bahah') },
        { id: '11', name: t('Riyadh') },
        { id: '12', name: t('Northern Borders') },
        { id: '13', name: t('Jazan') },
    ]

    const typeItems = [
        { id: '1', name: t('All') },
        { id: '2', name: t('New') },
        { id: '3', name: t('Old') }
    ];

    const statusItems = [
        { id: '1', name: t('Active') },
        { id: '2', name: t('Inactive') },
        { id: '3', name: t('Pending') }
    ];

    return (
        <>
        {contextHolder}
        <Card className='radius-12 border-gray'>
            <Flex vertical gap={20}>
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <Flex gap={5} wrap>
                                <SearchInput
                                    name='name'
                                    placeholder={t('Search')}
                                    prefix={<img src='/assets/icons/search.png' width={14} alt='search icon' fetchPriority="high"/>}
                                    allowClear
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                    onChange={(e) => handleSearch(e.target.value.trim())}
                                    debounceMs={400}
                                />
                                <MySelect
                                    withoutForm
                                    options={districtItems}
                                    onChange={handleDistrictClick}
                                    placeholder={t("District")}
                                    allowClear
                                    style={{ minWidth: 150 }}
                                />
                                <MySelect
                                    withoutForm
                                    options={districtItems}
                                    onChange={handleCityClick} 
                                    placeholder={t("City")}
                                    allowClear
                                />
                                <MySelect
                                    withoutForm
                                    options={typeItems}
                                    onChange={handleCategoryClick}
                                    placeholder={t("Type")}
                                    allowClear
                                />
                                <MySelect
                                    withoutForm
                                    options={statusItems}
                                    onChange={handleStatusClick}
                                    placeholder={t("Status")}
                                    allowClear
                                />
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
                        loading={loading || updating}
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

            <DeleteModal
                visible={deleteVisible}
                onClose={() => setDeleteVisible(false)}
                title={t('Are you sure?')}
                subtitle={t('This action cannot be undone. Are you sure you want to delete this user?')}
                type='danger'
                loading={deleting}
                onConfirm={async () => {
                    try {
                        await deleteUser({ variables: { deleteUserId: selectedUserId } });
                        setDeleteVisible(false);
                        setSelectedUserId(null);
                    } catch {
                        // message handled in onError
                    }
                }}
            />
        </>
    );
};

export { UserManagementTable };