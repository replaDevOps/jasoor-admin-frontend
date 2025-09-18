import { Row, Col, Flex, Button } from 'antd'
import { BusinesslistCards, BusinessListingTable, ModuleTopHeading } from '../../components'
import { PlusOutlined } from '@ant-design/icons';
import { GET_BUSINESSES } from '../../graphql/query/business'
import { useLazyQuery } from '@apollo/client'
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinesslIstingPage = () => {
  const [page, setPage] = useState(1); 
  const [pageSize, setPageSize] = useState(10); 
  const [search, setSearch] = useState(""); 
  const [status, setStatus] = useState(null); 
  const navigate = useNavigate()
  const offSet = (page - 1) * pageSize;

  const [loadBusinesses, { data, loading, error }] = useLazyQuery(GET_BUSINESSES, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    loadBusinesses({
      variables: {
        limit: pageSize,
        offSet,
        search: search || null,
        filter: { categoryId: null, startDate: null, endDate: null, status: status || null }
      }
    });
  }, [ page, pageSize, search, status ]);
  
  const totalActiveCount = data?.getAllBusinesses?.totalActiveCount
  const totalCount = data?.getAllBusinesses?.totalCount
  const totalPendingCount = data?.getAllBusinesses?.totalPendingCount

  const handleFiltersChange = (filters) => {
    setPage(1);
    setFilters(prev => ({
      ...prev,
      ...filters
    }));
  };

  const handlePageChange = (newPage, newPageSize) => {
    const effectivePageSize = newPageSize || pageSize;
    const effectivePage = newPage || 1;

    if (effectivePageSize !== pageSize) {
      setPage(1);
      setPageSize(effectivePageSize);
      return;
    }
    setPage(effectivePage);
  };
console.log("business data",data)
  return (
      <>
          <Row gutter={[24,24]}>
              <Col span={24}>
                  <Flex justify='space-between'>
                      <ModuleTopHeading level={4} name='Business Listing' />
                      <Button aria-labelledby='Add Business' type='primary' className='btnsave' onClick={()=>navigate('/createbusinesslist')}> 
                        <PlusOutlined /> Add Business
                      </Button>
                  </Flex>
              </Col>
              <Col span={24}>
                  <BusinesslistCards totalActiveCount={totalActiveCount} totalCount={totalCount} totalPendingCount={totalPendingCount}  />
              </Col>
              <Col span={24}>
                <BusinessListingTable
                  businesses={data?.getAllBusinesses?.businesses || []}
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