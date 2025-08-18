import { Flex, Form, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { completedealColumn, completedealData} from '../../../data';
import { CustomPagination } from '../../Ui';
import { useState } from 'react';
import { GETDEALS } from '../../../graphql/query/meeting'
import { useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom';
import { message,Spin } from "antd";

const CompleteDealsTable = () => {
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchValue, setSearchValue] = useState('');

    const { data, loading, refetch } = useQuery(GETDEALS, {
        variables: {
            search: searchValue,
            isCompleted: true
        },
        fetchPolicy: 'network-only'
    });
    //              <Spin size="large" />

    const completedealData = (data?.getDeals?.deals || []).map((item, index) => ({
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

    const handleSearch = (value) => {
        setSearchValue(value);
        refetch({ status: selectedStatus !== 'Status' ? selectedStatus.toUpperCase() : null, search: value });
    };

    return (
        <>
            <Flex vertical gap={20}>
                <Form form={form} layout="vertical">
                    <Flex gap={5}>
                        <SearchInput
                            name='name'
                            placeholder='Search'
                            prefix={<img src='/assets/icons/search.png' width={14} />}
                            className='border-light-gray pad-x ps-0 radius-8 fs-13'
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Flex>
                </Form>
                <Table
                    size='large'
                    columns={completedealColumn}
                    dataSource={completedealData.slice((current - 1) * pageSize, current * pageSize)}
                    className='pagination table-cs table'
                    showSorterTooltip={false}
                    scroll={{ x: 1200 }}
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
        </>
    );
};

export { CompleteDealsTable };