import { Button, Card, Col, Dropdown, Flex, Form, Row, Table, Typography } from 'antd';
import { SearchInput } from '../../../Forms';
import { faqsData, faqsColumn } from '../../../../data';
import { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { CustomPagination, DeleteModal } from '../../../Ui';


const FaqsTable = ({setVisible,setEditItem}) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [deleteItem, setDeleteItem] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const total = faqsData.length;
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    
    return (
        <>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={20}>
                    <Form form={form} layout="vertical">
                        <Flex gap={5} wrap>
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
                        columns={faqsColumn(setVisible, setEditItem, setDeleteItem)}
                        dataSource={faqsData.slice((current - 1) * pageSize, current * pageSize)}
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
            <DeleteModal 
                visible={deleteItem}
                onClose={()=>setDeleteItem(false)}
                title='Are you sure?'
                subtitle='This action cannot be undone. Are you sure you want to delete this question?'
                type='danger'
            />
        </>
    );
};

export { FaqsTable };