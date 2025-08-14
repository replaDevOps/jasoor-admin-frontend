import { Button, Card, Col, Flex, Form, Row, Table } from 'antd';
import { MyDatepicker, SearchInput } from '../../Forms';
import { financeColumn, financeData } from '../../../data';
import { useEffect, useState } from 'react';
import { CustomPagination } from '../../Ui';
import moment from 'moment';
import dayjs from 'dayjs';
const FinanceTable = () => {
    const [form] = Form.useForm();
    const [dateRange, setDateRange] = useState();
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const total = financeData.length;
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
                                        console.log(dates)
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