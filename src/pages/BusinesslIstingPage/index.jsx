import { Row, Col, Flex, Button,Spin,message } from 'antd'
import { BusinesslistCards, BusinessListingTable, ModuleTopHeading } from '../../components'
import { PlusOutlined } from '@ant-design/icons';
import { GET_BUSINESSES } from '../../graphql/query/business'
import { useQuery } from '@apollo/client'
import moment from 'moment';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BusinesslIstingPage = () => {
    const [page, setPage] = useState(1); // current page
    const [search, setSearch] = useState(""); // search string
    const [status, setStatus] = useState(null); // filter status (e.g., SOLD)
    const [current, setCurrent] = useState(1);
    const navigate = useNavigate()
    const limit = 10;
    const offSet = page;
  
    const { data, loading, error, refetch } = useQuery(GET_BUSINESSES, {
      variables: {
        limit,
        offSet,
        search: search || null,
        filter: {
          categoryId: null,
          startDate: null,
          endDate: null,
          status: status || null
        }
      },
      fetchPolicy: "network-only"
    });

    if (loading) {
      return (
        <Flex justify="center" align="center" style={{ height: '200px' }}>
          <Spin size="large" />
        </Flex>
      );
    }
  
    const totalActiveCount = data?.getAllBusinesses?.totalActiveCount
    const totalCount = data?.getAllBusinesses?.totalCount
    const totalPendingCount = data?.getAllBusinesses?.totalPendingCount

    const handleFiltersChange = (filters) => {
        // Reset to page 1 when filters change
        setPage(1);
        refetch({
          limit,
          offset: 0,
          search: filters.search || null,
          filter: {
            categoryId: filters.categoryId || null,
            startDate: filters.startDate || null,
            endDate: filters.endDate || null,
            status: filters.status || null
          }
        });
      };
    
      const handlePageChange = (newPage) => {
        setPage(newPage);
        refetch({
          limit,
          offset: newPage, // page number directly
          search,
          filter: { categoryId: null, startDate: null, endDate: null, status }
        });
      };

      
    return (
        <>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name='Business Listing' />
                        <Button type='primary' className='btnsave' onClick={()=>navigate('/createbusinesslist')}> 
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
                    pageSize={limit}
                    onPageChange={handlePageChange}
                    onFiltersChange={handleFiltersChange}
                    search={search}
                    setSearch={setSearch}
                    setStatus={setStatus}
                  />
                </Col>
            </Row>
        </>
    )
}

export { BusinesslIstingPage }; 