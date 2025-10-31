import { Button, Col, Dropdown, Flex, Form, Row, Table ,Typography} from 'antd';
import { SearchInput } from '../../Forms';
import { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CustomPagination } from '../../Ui';
import { GETDEALS } from '../../../graphql/query/meeting'
import { useLazyQuery } from '@apollo/client'
import { TableLoader } from '../../Ui/TableLoader';
import { useTranslation } from 'react-i18next';

const { Text } = Typography

// Helper function to determine status display based on boolean flags
const getStatusFromBooleans = (deal) => {
    // Check for cancellation first
    if (deal.status === 'CANCEL') {
        return { key: 'CANCEL', label: 'Canceled', className: 'dealcancelled' };
    }
    
    // Step 5: Finalize Deal - Both buyer and seller completed (GREEN)
    if (deal.isBuyerCompleted && deal.isSellerCompleted && deal.status === 'COMPLETED') {
        return { key: 'COMPLETED', label: 'Completed', className: 'success' };
    }

    if (deal.isBuyerCompleted && deal.isSellerCompleted ) {
        return { key: 'JUSOOR_VERIFICATION_PENDING', label: 'Jusoor Verification Pending', className: 'pending' };
    }
    
    // Step 4: Document Confirmation - Waiting for admin/seller verification (YELLOW - PENDING)
    if (deal.isPaymentVedifiedSeller) {
        return { key: 'DOCUMENT_CONFIRMATION', label: 'Document Confirmation Pending', className: 'pending' };
    }
    
    // Step 3: Pay Business Amount - Waiting for payment verification (YELLOW - PENDING)
    if (deal.isDsaSeller && deal.isDsaBuyer) {
        return { key: 'PAYMENT_PENDING', label: 'Payment Confirmation Pending', className: 'pending' };
    }
    
    // Step 2: Digital Sale Agreement (YELLOW - PENDING)
    if (deal.isCommissionVerified) {
        if (!deal.isDsaSeller && !deal.isDsaBuyer) {
            return { key: 'DSA_PENDING', label: 'DSA Pending', className: 'pending' };
        } else if (!deal.isDsaSeller) {
            return { key: 'DSA_SELLER_PENDING', label: 'DSA Seller Pending', className: 'pending' };
        } else if (!deal.isDsaBuyer) {
            return { key: 'DSA_BUYER_PENDING', label: 'DSA Buyer Pending', className: 'pending' };
        }
    }
    if(!deal?.isCommissionVerified && deal?.isCommissionUploaded ){
        return{ key: 'COMMISSION_VERIFICATION_PENDING', label: 'Commission Verification Pending', className: 'pending' };
    }
    // Step 1: Commission Receipt (YELLOW - PENDING)
    if (deal.isCommissionUploaded) {
        return { key: 'COMMISSION_PENDING', label: 'Commission Pending', className: 'pending' };
    }
    
    // Default fallback (YELLOW - PENDING)
    return { key: 'PENDING', label: 'Pending', className: 'pending' };
};

const InprogressDealTable = () => {

    const { t, i18n } = useTranslation();
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState(t("Status"));
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchValue, setSearchValue] = useState('');

    const [getDeals, { data, loading }] = useLazyQuery(GETDEALS, {
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        setSelectedStatus(t("Status"));
    }, [i18n.language, t]);
    
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
        statusInfo: getStatusFromBooleans(item), // Use boolean-based status
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
            dataIndex: 'statusInfo',
            render: (statusInfo) => {
                return (
                    <Text className={`btnpill fs-12 ${statusInfo.className}`}>
                        {t(statusInfo.label)}
                    </Text>
                );
            }
        },
        {
            title: t('Date'),
            dataIndex: 'date',
        },
    ];

    const businessdealItems = [
        { key: '1', label: t('All') },
        { key: '2', label: t('Commission Verification') },
        { key: '3', label: t('DSA From Seller') },
        { key: '4', label: t('DSA From Buyer') },
        { key: '5', label: t('Buyer Payment') },
        { key: '6', label: t('Payment Approval') },
        { key: '7', label: t('Document Confirmation') },
        { key: '8', label: t('Deal To Fainal Pending') },
    ]

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
                                    debounceMs={400}
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
                    dataSource={inprogressdealData}
                    className='pagination table-cs table'
                    showSorterTooltip={false}
                    scroll={{ x: 1600 }}
                    rowHoverable={false}
                    onRow={(record) => ({
                        onClick: () => navigate('/businessdeal/details/'+record?.key)
                    })}
                    pagination={false}
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