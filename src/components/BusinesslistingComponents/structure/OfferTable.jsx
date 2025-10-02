import { Card, Flex, Table, Typography,Spin,Tooltip,Pagination,Row, Col,Select } from 'antd'
import {OFFERBYBUSINESSID} from '../../../graphql/query'
import { useQuery } from '@apollo/client'
import {useState} from 'react'
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';


const { Text } = Typography


const offertableColumn = [
    {
      title: t('Buyer Name'),
      dataIndex: 'buyername',
      render: (buyername) => {
        if (!buyername) return <Text>-</Text>;
        const visiblePart = buyername.substring(0, 5);
        const hiddenPart = '*'.repeat(Math.max(0, buyername.length - 5));
        return <Text>{visiblePart}{hiddenPart}</Text>;
      }
    },
    {
      title: t('Business Price'),
      dataIndex: 'businessprice',
    },
    {
      title: t('Offer Price'),
      dataIndex: 'offerprice',
      render: (_, row) => {
        return (
          <Flex gap={10} align="center">
            {row?.offerprice}
            {row?.priceType === 1 ? (
              <Tooltip title="CO - Counteroffer">
                <Text className='brand-bg radius-4 p-1 fs-11 text-white'>CO</Text>
              </Tooltip>
            ) : (
              <Tooltip title="PP - Proceed to Purchase">
                <Text className='bg-orange radius-4 p-1 fs-11 text-white'>PP</Text>
              </Tooltip>
            )}
          </Flex>
        )
      }
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      render: (status) => {
        return (
          status === 0 ? (
            <Space align='center'>
              <Text className='btnpill fs-12 pending'>Send</Text>
            </Space>
          ) : status === 1 ? (
            <Text className='btnpill fs-12 inactive'>Reject</Text>
          ) : status === 2 ? (
            <Text className='btnpill fs-12 success'>Received</Text>
          ) : null
        )
      }
    },
    {
      title: t('Offer Date'),
      dataIndex: 'offerdate',
    },
  ]
const { Title } = Typography
const OfferTable = (businessId) => {
    const { t } = useTranslation();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
      })
    const { data, loading, error } = useQuery(OFFERBYBUSINESSID, {
        variables: {
          getOfferByBusinessIdId: businessId?.businessId,
          limit: pagination.pageSize,
          offSet: (pagination.current - 1) * pagination.pageSize,
          search: "",
          status: ""
        },
        fetchPolicy: "cache-and-network"
    })
    
    const total = data?.getOfferByBusinessId?.count || 0
    
    const offerData = data?.getOfferByBusinessId?.offers?.map((offer, index) => ({
        key: index,
        buyername: offer?.buyer?.name,
        businessprice: `SAR ${offer?.business?.price}`,
        offerprice: `SAR ${offer?.price}`,
        priceType: offer?.status === "COUNTEROFFER" ? 1 : 2, // example mapping
        status: offer?.status === "SEND" ? 0 : offer?.status === "REJECT" ? 1 : 2,
        offerdate: new Date(offer?.createdAt).toLocaleDateString(),
    })) || []

    const handleTableChange = (paginationConfig) => {
        setPagination({
          ...pagination,
          current: paginationConfig.current,
          pageSize: paginationConfig.pageSize,
        })
        refetch({
          getOfferByBusinessIdId: businessId,
          limit: paginationConfig.pageSize,
          offSet: (paginationConfig.current - 1) * paginationConfig.pageSize,
        })
    }

      
    if (loading) {
        return (
          <Flex justify="center" align="center" className='h-200'>
            <Spin size="large" />
          </Flex>
        );
    }
    return (
        <Card className='radius-12 border-gray'>
            <Flex vertical gap={10}>
                <Title level={5} className="m-0">
                    {t("Offer")}
                </Title>
                <Table
                    size="large"
                    columns={offertableColumn}
                    dataSource={offerData}
                    className="pagination table table-cs"
                    showSorterTooltip={false}
                    scroll={{ x: 500 }}
                    rowHoverable={false}
                    pagination={false}
                />
            </Flex>
            {total > 0 ? (
            <Col span={24} className='mt-3'>
                <Row justify="space-between" align="middle">
                    <Col span={6}>
                        <Flex gap={5} align='center'>
                            <Text>{t('Rows Per Page')}:</Text>
                            <Select
                                className="select-filter"
                                value={pagination.pageSize}
                                onChange={(value) => {
                                    setLimit(value);
                                    setCurrentPage(1);
                                }}
                                options={[
                                    { value: 6, label: 6 },
                                    { value: 10, label: 10 },
                                    { value: 20, label: 20 },
                                    { value: 50, label: 50 },
                                ]}
                            />
                        </Flex>
                    </Col>
                    <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                        <Pagination
                            className='pagination'
                            align="end"
                            pageSize={pagination.pageSize}
                            total={total || 0}
                            onChange={(page) => setCurrentPage(page)}
                        />
                    </Col>
                </Row>
            </Col>
            ) : (
            <Row>
                <Col span={24} className='text-center mt-4'>
                    <Text>{t('No Business Found')}</Text>
                </Col>
            </Row>
            )}
        </Card>
    )
}

export {OfferTable}