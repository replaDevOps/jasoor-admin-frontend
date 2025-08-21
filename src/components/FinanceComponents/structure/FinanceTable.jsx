import { Button, Card, Col, Flex, Form, Row, Table } from 'antd';
import { MyDatepicker, SearchInput } from '../../Forms';
import { financeColumn, financeData } from '../../../data';
import { useEffect, useState } from 'react';
import { CustomPagination } from '../../Ui';
import moment from 'moment';
import dayjs from 'dayjs';
import {GET_COMPLETED_DEALS} from '../../../graphql/query/business';
import { useQuery } from '@apollo/client';

const FinanceTable = () => {
    const [form] = Form.useForm();
    const [dateRange, setDateRange] = useState();
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const { data, loading, error } = useQuery(GET_COMPLETED_DEALS, {
        variables: {
            limit: pageSize,
            offset: (current - 1) * pageSize,
            filter: {
                startDate: dateRange ? dayjs(dateRange[0]).format('YYYY-MM-DD') : null,
                endDate: dateRange ? dayjs(dateRange[1]).format('YYYY-MM-DD') : null,
                search: form.getFieldValue('name') || null
            }
        },
        fetchPolicy: 'cache-and-network',
    });

    const total = data?.getCompletedDeals?.totalCount;
    const financeData = data?.getCompletedDeals?.deals.map(deal => ({
        key: deal.id,
        businessTitle: deal.business?.businessTitle || 'N/A',
        sellerName: deal.business?.seller?.name || 'N/A',
        buyerName: deal.buyer?.name || 'N/A',
        dealAmount: `SAR ${deal.price ? Number(deal.price).toFixed(2) : '0.00'}`,
        commissionEarn: `SAR ${deal.commission ? Number(deal.commission).toFixed(2) : '0.00'}`,
        dateTime: moment(deal.createdAt).format('DD/MM/YYYY hh:mm A')
    })) || [];
    
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    }
    return (
        <>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={20}>
                    <Form form={form} layout="vertical">
                        <Row gutter={[12,12]} justify={'space-between'} align={'middle'}>
                            <Col lg={{span: 7}} md={{span: 12}} span={24}>
                                <SearchInput
                                    name='name'
                                    placeholder='Search'
                                    prefix={<img src='/assets/icons/search.png' width={14} />}
                                    className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                />
                            </Col>
                            <Col lg={{span: 7}} md={{span: 12}} span={24}>
                                <MyDatepicker 
                                    withoutForm
                                    rangePicker
                                    className='datepicker-cs'
                                    value={dateRange}
                                    onChange={(dates) => {
                                        if(!dates?.length)
                                            setDateRange(null)
                                        else
                                        setDateRange(dates)
                                    }}
                                />
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        size='large'
                        columns={financeColumn}
                        dataSource={financeData.slice((current - 1) * pageSize, current * pageSize)}
                        className='pagination table-cs table'
                        showSorterTooltip={false}
                        scroll={{ x: 1000 }}
                        rowHoverable={false}
                        pagination={false}
                        // loading={
                        //     {
                        //         ...TableLoader,
                        //         spinning: loading
                        //     }
                        // }
                    />
                    <CustomPagination 
                        total={total}
                        current={current}
                        pageSize={pageSize}
                        onPageChange={handlePageChange}
                    />
                </Flex>
            </Card>
        </>
    );
};

export { FinanceTable };