import { Button, Card, Dropdown, Flex, Form, Table,message,Spin } from 'antd';
import { SearchInput } from '../../../Forms';
import { useState, useEffect } from 'react';
import { CustomPagination, DeleteModal } from '../../../Ui';
import {GETFAQ} from '../../../../graphql/query/queries'
import {DELETE_FAQ} from '../../../../graphql/mutation/mutations'
import { useQuery,useMutation } from "@apollo/client";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FaqsTable = ({setVisible,setEditItem}) => {
    const {t, i18n}= useTranslation()
    const lang = localStorage.getItem("lang") || i18n.language || "en";
    const isArabic = lang.toLowerCase() === "ar";
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [deleteItem, setDeleteItem] = useState(null);
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchValue, setSearchValue] = useState("");

    const  {data, loading , refetch:refetchFaqs} = useQuery(GETFAQ,{
        variables: { search: searchValue || null },
    });

    const [deleteFAQ, { loading: deleting }] = useMutation(DELETE_FAQ,{
        variables:{
            deleteFaqId: deleteItem?.id
        }
    });

    // Debounce search term
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setSearchValue(searchTerm.trim());
            setCurrent(1);
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };
    const faqsData = (isArabic
        ? data?.getFAQs?.faqs?.filter(faqs => faqs.isArabic)
        : data?.getFAQs?.faqs?.filter(faqs => !faqs.isArabic)
      ) || [];

    const faqsColumn = ( setVisible, setEditItem, setDeleteItem ) =>  [
        {
            title: t('Questions'),
            dataIndex: 'question',
            render: (_, row) => (
                row.isArabic ? row.arabicQuestion : row.question
            ),
        },
        {
            title: t('Action'),
            key: "action",
            fixed: "right",
            width: 100,
            render: (_,row) => (
                <Dropdown
                    menu={{
                        items: [
                            { label: <NavLink onClick={(e) =>{e.preventDefault(); setVisible(true); setEditItem(row)}}>{t("Edit")}</NavLink>, key: '1' },
                            { label: <NavLink onClick={(e) =>{e.preventDefault(); setDeleteItem(row) }}>{t("Delete")}</NavLink>, key: '2' },
                        ],
                    }}
                    trigger={['click']}
                >
                    <Button aria-labelledby='action button' className="bg-transparent border0 p-0">
                        <img src="/assets/icons/dots.png" alt="dot icon" width={16}  fetchPriority="high"/>
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
          refetchFaqs({ search: searchValue || null });
        } catch (err) {
          console.error(err);
          messageApi.error('Failed to delete FAQ');
        }
      };
    
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    if (loading || deleting) {
        return (
            <Flex justify="center" align="center"  className='h-200'>
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
                                placeholder={t('Search')}
                                prefix={<img src='/assets/icons/search.png' alt='search icon' fetchPriority='high' width={14} />}
                                className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
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