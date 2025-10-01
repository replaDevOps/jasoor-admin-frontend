import { Button, Col, Dropdown, Flex, Form, Row, Table ,Typography} from 'antd';
import { SearchInput } from '../../Forms';
import { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { businessdealItems } from '../../../shared';
import { useNavigate } from 'react-router-dom';
import { CustomPagination } from '../../Ui';
import { GETDEALS } from '../../../graphql/query/meeting'
import { useLazyQuery } from '@apollo/client'
import { TableLoader } from '../../Ui/TableLoader';
import { t } from 'i18next';

const { Text } = Typography

const InprogressDealTable = () => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState(t('Status'));
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchValue, setSearchValue] = useState('');

    const [getDeals, { data, loading }] = useLazyQuery(GETDEALS, {
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        getDeals({
            variables: {
                limit: pageSize,
                offset: (current - 1) * pageSize,
                search: searchValue,
                status: selectedStatus !== 'Status' ? selectedStatus.toUpperCase() : null,
                isCompleted: false
            }
        });
    }, [searchValue, selectedStatus, current, pageSize, getDeals]);

    const inprogressdealData = (data?.getDeals?.deals || []).map((item) => ({
        key:item?.id,
        businessTitle:item?.business?.businessTitle || '-',
        buyerName: item?.buyer?.name || '-',
        sellerName: item?.business?.seller?.name || '-',
        finalizedOffer: item?.offer?.price ? `SAR ${item?.offer?.price?.toLocaleString()}` : '-',
        status: item?.status || 0,
        date:item?.createdAt ? new Date(item?.createdAt).toLocaleDateString() : '-',
    }));

    const total = data?.getDeals?.totalCount || 0;

    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    
    const handleStatusClick = ({ key }) => {
        const selectedItem = businessdealItems.find(item => item.key === key);
        if (selectedItem) {
            setSelectedStatus(selectedItem.label);
        }
    };

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    const inprogressdealColumn = [
        {
            title: t('Business Title'),
            dataIndex: 'businessTitle',
        },
        {
            title: t('Buyer Name'),
            dataIndex: 'buyerName',
        },
        {
            title: t('Seller Name'),
            dataIndex: 'sellerName',
        },
        {
            title: t('Finalized Offer'),
            dataIndex: 'finalizedOffer',
        },
        {
            title: t('Status'),
            dataIndex: 'status',
            render: (status) => {
                return (
                    status === 'COMMISSION_TRANSFER_FROM_BUYER_PENDING' ? (
                        <Text className='btnpill fs-12 branded'>Commission Pending</Text>
                    ) : 
                    status === 'COMMISSION_VERIFIED' ? (
                        <Text className='btnpill fs-12 pending'>DSA pending</Text>
                    )
                    :
                    status === 'DSA_FROM_SELLER_PENDING' ? (
                        <Text className='btnpill fs-12 sellerpendingstatus'>DSA Seller Pending</Text>
                    )
                    :
                    status === 'DSA_FROM_BUYER_PENDING' ? (
                        <Text className='btnpill fs-12 paybusinessamount'>DSA Buyer Pending</Text>
                    )
                    :
                    status === 'BANK_DETAILS_FROM_SELLER_PENDING' ? (
                        <Text className='btnpill fs-12 paymentapprovalpending'>Buyer Bank Dtails Pending</Text>
                    )
                    :
                    status === 'SELLER_PAYMENT_VERIFICATION_PENDING' ? (
                        <Text className='btnpill fs-12 paymentapprovalpending'>Payment Confirmation Pending</Text>
                    )
                    :
                    status === 'PAYMENT_APPROVAL_FROM_SELLER_PENDING' ? (
                        <Text className='btnpill fs-12 paymentapprovalpending'>Document Confirmation Pending</Text>
                    )
                    :
                    status === 'DOCUMENT_PAYMENT_CONFIRMATION' ? (
                        <Text className='btnpill fs-12 paymentapprovalpending'>Admin Verification Pending</Text>
                    )
                    :
                    (
                        <Text className='btnpill fs-12 commissiontransferbuyer'>Finalize Deal</Text>
                    )
                )
            }
        },
        {
            title: t('Date'),
            dataIndex: 'date',
        },
    ];

    return (
        <>
            <Flex vertical gap={20}>
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                        <Col lg={24} md={24} sm={24} xs={24}>
                            <Flex gap={5} wrap>
                                <SearchInput
                                    name='name'
                                    placeholder={t('Search')}
                                    prefix={<img src='/assets/icons/search.png' width={14} alt='search icon' fetchPriority="high" />}
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                <Dropdown 
                                    menu={{ 
                                        items: businessdealItems,
                                        onClick: handleStatusClick
                                    }} 
                                    trigger={['click']}
                                >
                                    <Button className="btncancel px-3 filter-bg fs-13 text-black" aria-labelledby='filter status'>
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
                    columns={inprogressdealColumn}
                    dataSource={inprogressdealData.slice((current - 1) * pageSize, current * pageSize)}
                    className='pagination table-cs table'
                    showSorterTooltip={false}
                    scroll={{ x: 1600 }}
                    rowHoverable={false}
                    onRow={(record) => ({
                        onClick: () => navigate('/businessdeal/details/'+record?.key)
                    })}
                    pagination={true}
                    loading={{
                        ...TableLoader,
                        spinning: loading
                    }}
                />
                <CustomPagination 
                    total={total}
                    current={current}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                />
            </Flex>
        </>
    );
};

export { InprogressDealTable };