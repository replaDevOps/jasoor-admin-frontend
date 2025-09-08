import { Button, Card, Col, Dropdown, Flex, Form, Row, Table,Input,Image,Typography } from 'antd';
import { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CustomPagination, DeleteModal } from '../../Ui';
import { DELETE_BUSINESS } from '../../../graphql/mutation'
import { GET_CATEGORIES } from '../../../graphql/query/business'
import { useQuery,useMutation } from '@apollo/client'
import { message,Spin } from "antd";
import { NavLink } from "react-router-dom";

const { Text } = Typography

const CategoryTable = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const categoryColumn = ( setDeleteItem, navigate ) =>  [
        {
            title: 'Category Icon',
            dataIndex: 'categoryicon',
            render:(categoryicon)=> <Image src={categoryicon} preview={false} width={25} alt='category-icon' />
        },
        {
            title: 'Category Name',
            dataIndex: 'categoryname',
        },
        {
            title: 'Business Type',
            dataIndex: 'businesstype',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                return (
                    status === 'UNDER_REVIEW' ? (
                        <Text className='btnpill fs-12 pending'>Pending</Text>
                    ) : status === 'INACTIVE' ? (
                        <Text className='btnpill fs-12 inactive'>Inactive</Text>
                    ) : status === 'ACTIVE' ? (
                        <Text className='btnpill fs-12 success'>Completed</Text>
                    ) : null
                );
            }
        },
        {
            title: 'Action',
            key: "action",
            fixed: "right",
            width: 100,
            render: (_,row) => (
                <Dropdown
                    menu={{
                        items: [
                            { label: <NavLink onClick={(e) => {e.preventDefault(); navigate('/addnewcategory/detail/'+row?.key)}}>Edit</NavLink>, key: '1' },
                            { label: <NavLink onClick={() => {setSelectedCategoryId(row.key); setDeleteItem(true) }}>Delete</NavLink>, key: '2' },
                        ],
                    }}
                    trigger={['click']}
                >
                    <Button aria-labelledby='action dropdown' className="bg-transparent border0 p-0">
                        <img src="/assets/icons/dots.png" alt="dots icon" width={16} />
                    </Button>
                </Dropdown>
            ),
        },
    ];
    // State for filters
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchName, setSearchName] = useState(null);

    // Pagination state
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const [categories, setCategories] = useState([]);
    const [deleteItem, setDeleteItem] = useState(false);

    const statusItems = [
        { key: null, label: 'All' },
        { key: 'ACTIVE', label: 'Active' },
        { key: 'UNDER_REVIEW', label: 'Pending' },
        { key: 'INACTIVE', label: 'Inactive' }
    ];

    const typeItems = [
        { key: null, label: 'All' },
        { key: false, label: 'Physical Business' },
        { key: true, label: 'Online Business' }
    ];

    // Apollo query with variables
    const { data, loading: isLoading, error, refetch } = useQuery(GET_CATEGORIES, {
        variables: {
            limit: pageSize,
            offset: (current - 1) * pageSize,
            filter: {
                isDigital: selectedCategory,
                name: searchName,
                status: selectedStatus
            }
        },
        fetchPolicy: "network-only"
    });

    // Map API response to table data
    useEffect(() => {
        if (data?.getAllCategories?.length) {
            const mappedCategories = data.getAllCategories.map((item) => ({
                key: item.id,
                categoryicon: item.icon,
                categoryname: item.name,
                businesstype: item.isDigital ? 'Online Business' : 'Physical Business',
                status: item.status
            }));
            setCategories(mappedCategories);
        } else {
            setCategories([]);
        }
    }, [data]);

    // Pagination change
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };

    // Dropdown selections
    const handleStatusClick = ({ key }) => {
        setSelectedStatus(key === "null" ? null : key);
        refetch({
            limit: pageSize,
            offset: (current - 1) * pageSize,
            filter: {
                isDigital: selectedCategory,
                name: searchName,
                status: key === "null" ? null : key
            }
        });
    };

    const handleCategoryClick = ({ key }) => {
        const isDigitalValue = key === "null" ? null : key === "true";
        setSelectedCategory(isDigitalValue);
        refetch({
            limit: pageSize,
            offset: (current - 1) * pageSize,
            filter: {
                isDigital: isDigitalValue,
                name: searchName,
                status: selectedStatus
            }
        });
    };

    const handleSearch = (value) => {
        setSearchName(value || null);
      };
      
    useEffect(() => {
        refetch({
        limit: pageSize,
        offset: (current - 1) * pageSize,
        filter: {
            isDigital: selectedCategory,
            name: searchName,
            status: selectedStatus
        }
        });
    }, [searchName, selectedCategory, selectedStatus, pageSize, current]);

    const [deleteBusiness, { loading: deleting }] = useMutation(DELETE_BUSINESS, {
        refetchQueries: [{ query: GET_CATEGORIES },],
        awaitRefetchQueries: true,
        onCompleted: () => {
          message.success("Category deleted successfully");
          setDeleteItem(false);
        },
        onError: (err) => {
          message.error(err.message || "Something went wrong");
        }
    });
    if (isLoading || deleting) {
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
                    <Row gutter={[16, 16]} justify="left" align="middle">
                        <Col lg={12} md={16} sm={24} xs={24}>
                            <Row gutter={[16, 16]}>
                                {/* Search Input - double width */}
                                <Col span={12}>
                                    <Input
                                    name="name"
                                    placeholder="Search"
                                    prefix={<img src="/assets/icons/search.png" width={14} />}
                                    allowClear
                                    className="border-light-gray pad-x ps-0 radius-8 fs-13"
                                    onChange={(e) => handleSearch(e.target.value.trim())}
                                    />
                                </Col>

                                {/* Category Filter */}
                                <Col span={6}>
                                    <Flex gap={5}>
                                        <Dropdown
                                            menu={{
                                                items: typeItems.map((item) => ({
                                                key: String(item.key),
                                                label: item.label
                                                })),
                                                onClick: handleCategoryClick
                                            }}
                                            trigger={['click']}
                                            >
                                            <Button aria-labelledby='filter category' className="btncancel px-3 filter-bg fs-13 text-black">
                                                <Flex justify="space-between" align="center" gap={30}>
                                                {typeItems.find((i) => i.key === selectedCategory)?.label || "Business Type"}
                                                <DownOutlined />
                                                </Flex>
                                            </Button>
                                        </Dropdown>
                                        <Dropdown
                                            menu={{
                                                items: statusItems.map((item) => ({
                                                key: String(item.key),
                                                label: item.label
                                                })),
                                                onClick: handleStatusClick
                                            }}
                                            trigger={['click']}
                                        >
                                            <Button aria-labelledby='filter status' className="btncancel px-3 filter-bg fs-13 text-black">
                                                <Flex justify="space-between" align="center" gap={30}>
                                                    {statusItems.find((i) => i.key === selectedStatus)?.label || "Status"}
                                                    <DownOutlined />
                                                </Flex>
                                            </Button>
                                        </Dropdown>
                                    </Flex>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    </Form>
                    <Table
                        size='large'
                        columns={categoryColumn(setDeleteItem, navigate)}
                        dataSource={categories}
                        className='pagination table-cs table'
                        showSorterTooltip={false}
                        scroll={{ x: 1000 }}
                        rowHoverable={false}
                        pagination={false}
                        loading={isLoading}
                    />
                    <CustomPagination 
                        total={categories.length}
                        current={current}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                    />
                </Flex>
            </Card>
            <DeleteModal 
                visible={deleteItem}
                onClose={()=>setDeleteItem(false)}
                title='Are you sure?'
                subtitle='This action cannot be undone. Are you sure you want to delete this Category?'
                type='danger'
                onConfirm={() => {
                    if (selectedCategoryId) {
                      deleteBusiness({
                        variables:  { deleteCategoryId: selectedCategoryId } ,
                      });
                    }
                }}
            />
        </>
    );
};

export { CategoryTable };