import { Row, Col, Flex, Button } from 'antd'
import { BusinesslistCards, BusinessListingTable, ModuleTopHeading } from '../../components'
import { PlusOutlined } from '@ant-design/icons';
import { GET_BUSINESSES } from '../../graphql/query/business'
import { useLazyQuery } from '@apollo/client'
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BusinesslIstingPage = () => {
  const {t} =useTranslation()
  const [page, setPage] = useState(1); 
  const [pageSize, setPageSize] = useState(10); 
  const [search, setSearch] = useState(""); 
  const [status, setStatus] = useState(null); 
  const navigate = useNavigate()

  const [loadBusinesses, { data, loading, error }] = useLazyQuery(GET_BUSINESSES, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    loadBusinesses({
      variables: {
        limit: pageSize,
        offSet: (page - 1) * pageSize,
        search: search || null,
        filter: { categoryId: null, startDate: null, endDate: null, businessStatus: status || null }
      }
    });
  }, [page, pageSize, search, status, loadBusinesses]);  
  
  const totalActiveCount = data?.getAdminBusinesses?.totalActiveCount
  const totalCount = data?.getAdminBusinesses?.totalCount
  const totalPendingCount = data?.getAdminBusinesses?.totalPendingCount

  const handleFiltersChange = (filters) => {
    console.log("filters",filters)
    setPage(1);
    setFilters(prev => ({
      ...prev,
      ...filters
    }));
  };

  const handlePageChange = (page, size) => {
    setPage(page);
    setPageSize(size);
  };
  return (
      <>
          <Row gutter={[24,24]}>
              <Col span={24}>
                  <Flex justify='space-between'>
                      <ModuleTopHeading level={4} name={t('Business Listing')} />
                      <Button aria-labelledby='Add Business' type='primary' className='btnsave' onClick={()=>navigate('/createbusinesslist')}> 
                        <PlusOutlined /> {t("Add Business")}
                      </Button>
                  </Flex>
              </Col>
              <Col span={24}>
                  <BusinesslistCards totalActiveCount={totalActiveCount} totalCount={totalCount} totalPendingCount={totalPendingCount}  />
              </Col>
              <Col span={24}>
                <BusinessListingTable
                  businesses={data?.getAdminBusinesses?.businesses || []}
                  totalCount={totalCount}
                  loading={loading}
                  page={page}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onFiltersChange={handleFiltersChange}
                  search={search}
                  setSearch={(val) => {
                    setPage(1);
                    setSearch(val);
                  }}
                  setStatus={(val) => {
                    setPage(1);
                    setStatus(val);
                  }}
                />
              </Col>
          </Row>
      </>
  )
}

export { BusinesslIstingPage }; 