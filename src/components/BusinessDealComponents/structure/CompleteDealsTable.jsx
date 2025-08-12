import { Flex, Form, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { completedealColumn, completedealData} from '../../../data';
import { CustomPagination } from '../../Ui';
import { useState } from 'react';


const CompleteDealsTable = () => {
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const total = completedealData.length;
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
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