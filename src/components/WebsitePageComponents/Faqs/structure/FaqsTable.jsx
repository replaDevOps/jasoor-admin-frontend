import { Button, Card, Dropdown, Flex, Form, Table,message,Spin } from 'antd';
import { SearchInput } from '../../../Forms';
import { useState,useRef } from 'react';
import { CustomPagination, DeleteModal } from '../../../Ui';
import {GETFAQ} from '../../../../graphql/query/queries'
import {DELETE_FAQ} from '../../../../graphql/mutation/mutations'
import { useQuery,useMutation } from "@apollo/client";
import { NavLink } from "react-router-dom";

const FaqsTable = ({setVisible,setEditItem}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [deleteItem, setDeleteItem] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const  {data, loading , error,refetch} = useQuery(GETFAQ,{
        variables: { search: "" },
    });
    const [deleteFAQ, { loading: deleting }] = useMutation(DELETE_FAQ,{
        variables:{
            deleteFaqId: deleteItem?.id
        }
    });

    const faqsData = data?.getFAQs?.faqs || [];

    const faqsColumn = ( setVisible, setEditItem, setDeleteItem ) =>  [
        {
            title: 'Questions',
            dataIndex: 'question',
        },
        {
            title: 'Action',
            key: "action",
            fixed: "right",
            width: 100,
            render: (_,row) => (
                <Dropdown
                    menu={{
                        items: [
                            { label: <NavLink onClick={(e) =>{e.preventDefault(); setVisible(true); setEditItem(row)}}>Edit</NavLink>, key: '1' },
                            { label: <NavLink onClick={(e) =>{e.preventDefault(); setDeleteItem(row) }}>Delete</NavLink>, key: '2' },
                        ],
                    }}
                    trigger={['click']}
                >
                    <Button aria-labelledby='action button' className="bg-transparent border0 p-0">
                        <img src="/assets/icons/dots.png" alt="" width={16}  fetchpriority="high"/>
                    </Button>
                </Dropdown>
            ),
        },
    ];
    const total = data?.getFAQs?.totalCount

    const handleDelete = async () => {
        if (!deleteItem) return;
    
        try {
          await deleteFAQ({
            variables: { deleteFaqId: deleteItem.id },
          });
          messageApi.success('FAQ deleted successfully');
          setDeleteItem(null);
          refetch(); // refresh the FAQ list
        } catch (err) {
          console.error(err);
          messageApi.error('Failed to delete FAQ');
        }
      };
    
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    const searchTimeout = useRef(null);

    const handleSearchChange = (e) => {
        const value = e.target.value;

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            refetch({ search: value });
            setCurrent(1); // reset pagination
        }, 500); // 500ms delay
    };
    if (loading || deleting) {
        return (
            <Flex justify="center" align="center" style={{ height: "200px" }}>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <>
        {contextHolder}
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={20}>
                    <Form form={form} layout="vertical">
                        <Flex gap={5} wrap>
                            <SearchInput
                                name='name'
                                placeholder='Search'
                                prefix={<img src='/assets/icons/search.png' alt='search icon' width={14} />}
                                className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                onChange={handleSearchChange} 
                                fetchpriority="high"
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
                onConfirm={handleDelete} 
                loading={deleting}
            />
        </>
    );
};

export { FaqsTable };