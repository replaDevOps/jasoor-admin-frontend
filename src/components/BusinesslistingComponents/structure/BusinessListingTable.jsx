import { Button, Card, Col, Dropdown, Flex, Form, Row, Table,Space,Typography } from 'antd';
import { MyDatepicker, SearchInput } from '../../Forms';
import { useState,useMemo } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CustomPagination, TableLoader } from '../../Ui';
import { GET_CATEGORIES } from '../../../graphql/query/business'
import { useQuery } from '@apollo/client'
import dayjs from 'dayjs';
import { t } from 'i18next';

const { Text } = Typography
const BusinessListingTable = ({
    businesses,
    totalCount,
    loading,
    page,
    pageSize,
    onPageChange,
    onFiltersChange,
    search, 
    setSearch,
    setStatus
}) => {
    const { data, loading:isLoading, error } = useQuery(GET_CATEGORIES);
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [selectedCategory, setSelectedCategory] = useState('Category');
    const [dateRange, setDateRange] = useState(null);
    const navigate = useNavigate();
  
    const handleStatusClick = ({ key }) => {
      const selectedItem = statusItems.find(item => item.key === key);
      if (selectedItem) {
        setSelectedStatus(selectedItem.label);
        if (key === '1') {
            setStatus(null);
        }
        else{
        setStatus(selectedItem.key);
        }
      }
    };

    const categoryItems = useMemo(() => {
        if (!data?.getAllCategories) return [];
        return data.getAllCategories.map(cat => ({
            key: cat.id, 
            label: t(cat.name)
        }));
    }, [data]);
    
    const handleCategoryClick = ({ key }) => {
        const selectedItem = categoryItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedCategory(selectedItem.label);
            onFiltersChange({ categoryId: selectedItem.key });
        }
    };

    const statusItems = [
        { key: '1', label: t('All') },
        { key: 'ACTIVE', label: t('Active') },
        { key: 'UNDER_REVIEW', label: t('Pending') },
        { key: 'INACTIVE', label: t('Inactive') }
    ];
    const columns =[
        {
            title: t('Business Title'),
            dataIndex: 'businessTitle',
        },
        {
            title: t('Seller Name'),
            render:(_,record)=>record?.seller?.name
        },
        {
            title: t('Category'),
            dataIndex: 'category',
            render:(_,record)=>record?.category?.name
        },
        {
            title: t('Business Price'),
            dataIndex: 'price',
        },
        {
            title: t('Status'),
            dataIndex: 'businessStatus',
            render:(_,record) => {
                const status=record?.businessStatus;
                return (
                    status === 'UNDER_REVIEW' ? (
                        <Space align='center'>
                            <Text className='btnpill fs-12 pending'>Under Review</Text>
                        </Space>
                    ) : status === 'INACTIVE' ? (
                        <Text className='btnpill fs-12 inactive'>Inactive</Text>
                    ) : status === 'ACTIVE' ? (
                        <Text className='btnpill fs-12 success'>Active</Text>
                    ) : status === 'SOLD' ? (
                        <Text className='btnpill fs-12 success'>Sold</Text>
                    ) : null
                );
            }
        },
        {
            title: t('Date'),
            render:(_,record)=>{
                const date = new Date(record?.createdAt);
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                return date.toLocaleDateString('en-US', options);
            }
        },
    ]

    return (
        <Card className='radius-12 border-gray'>
            <Flex vertical gap={20}>
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                        <Col xl={18} lg={16} md={24} sm={24} xs={24}>
                            <Flex gap={5} wrap>
                                <SearchInput
                                    name='name'
                                    placeholder={t('Search')}
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                    }}
                                    prefix={<img src='/assets/icons/search.png' width={14} alt='search icon' fetchPriority="high"/>}
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                />
                                <Dropdown 
                                    menu={{ 
                                        items: statusItems,
                                        onClick: handleStatusClick
                                    }} 
                                    trigger={['click']}
                                >
                                    <Button aria-labelledby='filter status' className="btncancel px-3 filter-bg fs-13 text-black">
                                        <Flex justify='space-between' align='center' gap={30}>
                                            {t(selectedStatus)}
                                            <DownOutlined />
                                        </Flex>
                                    </Button>
                                </Dropdown>
                                <Dropdown 
                                    menu={{ 
                                        items: [{ key: null, label: t('All') }, ...categoryItems], // Add "All" option
                                        onClick: handleCategoryClick
                                    }} 
                                    trigger={['click']}
                                >
                                    <Button aria-labelledby='filter category' className="btncancel px-3 filter-bg fs-13 text-black">
                                        <Flex justify='space-between' align='center' gap={30}>
                                            {t(selectedCategory)}
                                            <DownOutlined />
                                        </Flex>
                                    </Button>
                                </Dropdown>
                            </Flex>
                        </Col>
                        <Col xl={6} lg={8} md={24} sm={24} xs={24}>
                            <Flex justify='end' gap={10}>
                                <MyDatepicker 
                                    withoutForm
                                    label='Date'
                                    rangePicker
                                    value={dateRange}
                                    onChange={(dates) => {
                                        setDateRange([dayjs(dates[0]), dayjs(dates[1])]); // keep as Day.js objects
                                        const startDate = dates?.[0] ? dates[0].format('YYYY-MM-DD') : null;
                                        const endDate = dates?.[1] ? dates[1].format('YYYY-MM-DD') : null;
                                        onFiltersChange({ startDate, endDate });
                                      }}
                                />
                            </Flex>
                        </Col>
                    </Row>
                </Form>
                <Table
                    size='large'
                    columns={columns}
                    dataSource={businesses}
                    className='pagination table-cs table'
                    showSorterTooltip={false}
                    scroll={{ x: 1000 }}
                    rowHoverable={false}
                    onRow={(record) => ({
                        onClick: () => navigate('/businesslisting/details/'+record?.id)
                    })}
                    pagination={false}
                    loading={
                        {
                            ...TableLoader,
                            spinning: loading
                        }
                    }
                />
                <CustomPagination 
                    total={totalCount}
                    current={page}
                    pageSize={pageSize}
                    onPageChange={(newPage, newPageSize) => {
                        onPageChange(newPage, newPageSize);
                      }}            
                />
            </Flex>
        </Card>
    );
};

export { BusinessListingTable };