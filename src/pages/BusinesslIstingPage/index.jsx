import { Row, Col, Flex, Button,Spin,message } from 'antd'
import { BusinesslistCards, BusinessListingTable, ModuleTopHeading } from '../../components'
import { PlusOutlined } from '@ant-design/icons';
import { GET_BUSINESSES } from '../../graphql/query/business'
import { useLazyQuery } from '@apollo/client'
import moment from 'moment';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinesslIstingPage = () => {
    const [page, setPage] = useState(1); // current page
    const [pageSize, setPageSize] = useState(10); // current page size (limit)
    const [search, setSearch] = useState(""); // search string
    const [status, setStatus] = useState(null); // filter status (e.g., SOLD)
    const navigate = useNavigate()
    const offSet = (page - 1) * pageSize;
  
console.log(offSet, "lu")
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

    // if (loading) {
    //   return (
    //     <Flex justify="center" align="center" style={{ height: '200px' }}>
    //       <Spin size="large" />
    //     </Flex>
    //   );
    // }
  
    const totalActiveCount = data?.getAllBusinesses?.totalActiveCount
    const totalCount = data?.getAllBusinesses?.totalCount
    const totalPendingCount = data?.getAllBusinesses?.totalPendingCount

    const handleFiltersChange = (filters) => {
      // Reset to page 1 when filters change (do NOT call refetch here)
      setPage(1);

      // merge category/start/end or whatever partial filters you get
      setFilters(prev => ({
        ...prev,
        ...filters
      }));

      // do NOT call refetch here — the useEffect below will run once and load
    };

    const handlePageChange = (newPage, newPageSize) => {
      const effectivePageSize = newPageSize || pageSize;
      const effectivePage = newPage || 1;

      // if page size changed, reset to page 1 and update pageSize
      if (effectivePageSize !== pageSize) {
        setPage(1);
        setPageSize(effectivePageSize);
        return; // let useEffect do the load
      }

      // normal page navigation
      setPage(effectivePage);
    };

    
      
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