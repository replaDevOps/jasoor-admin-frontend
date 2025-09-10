import { Button, Card, Col, Dropdown, Flex, Form, Row, Typography,Spin,message } from 'antd';
import { SearchInput } from '../../../Forms';
import { useState,useRef } from 'react';
import { CustomPagination } from '../../../Ui';
import { NavLink } from 'react-router-dom';
import {GETARTICLES} from '../../../../graphql/query/queries'
import { useQuery } from "@apollo/client";

const { Paragraph, Text } = Typography
const ArticleCards = ({setDeleteItem, onDelete}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    const  {data, loading , error,refetch} = useQuery(GETARTICLES,{
        variables: { search: "" },
    });

    const total = data?.getArticles?.totalCount || 0;
    const articleData = data?.getArticles?.articles || [];
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

    if (loading) {
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
                        <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                            <Col span={24}>
                                <Flex gap={5} wrap>
                                    <SearchInput
                                        name='name'
                                        placeholder='Search'
                                        prefix={<img src='/assets/icons/search.png' width={14} />}
                                        className='border-light-gray pad-x ps-0 radius-8 fs-13'
                                        onChange={handleSearchChange} 
                                    />
                                </Flex>
                            </Col>
                        </Row>
                    </Form>
                    <Row gutter={[12,12]}>
                        {
                            articleData?.map((art,i)=>
                                <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}} xs={{span: 24}} key={i}>
                                    <Card className='h-100 border-gray rounded-12 card-cs'
                                        actions={[
                                            <Flex className='w-100' justify='space-between'>
                                                <Text className='fs-13 text-gray mt-2'>
                                                    {art?.date}
                                                </Text>
                                                <Dropdown
                                                    menu={{
                                                        items: [
                                                            { label: <NavLink to={'/articles/add/'+art?.id}>Edit</NavLink>, key: '1' },
                                                            { label: <NavLink onClick={(e) => {e.preventDefault();setDeleteItem(art?.id)}}>Delete</NavLink>, key: '2' },
                                                        ]
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button aria-labelledby='action button' className="bg-transparent border0 p-0">
                                                        <img src="/assets/icons/dots.png" alt="" width={16} />
                                                    </Button>
                                                </Dropdown>
                                            </Flex>
                                        ]}    
                                    >
                                        <Flex vertical gap={20}>
                                            <div>
                                                <div className='w-100 card-img-2 mb-2 radius-12'>
                                                    <img src={art?.img} width={'100%'} height={'100%'} className='object-cover object-top radius-12' alt="" />
                                                </div>
                                                <Paragraph 
                                                    ellipsis={{
                                                        rows: 2
                                                    }}
                                                    className='fs-16 fw-500'
                                                    style={{height: 50}}
                                                >
                                                    {art?.title}
                                                </Paragraph>
                                                <Paragraph 
                                                    ellipsis={{
                                                        rows: 2,
                                                        expandable: true,
                                                        symbol: 'more'
                                                    }}
                                                    className='fs-14 text-gray'
                                                >
                                                     <span dangerouslySetInnerHTML={{ __html: art?.body }} />
                                                </Paragraph>
                                            </div>
                                        </Flex>
                                    </Card>
                                </Col>
                            )
                        }
                    </Row>
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

export { ArticleCards };