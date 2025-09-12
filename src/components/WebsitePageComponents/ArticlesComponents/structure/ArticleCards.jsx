import { Button, Card, Col, Dropdown, Flex, Form, Row, Typography } from 'antd';
import { SearchInput } from '../../../Forms';
import { articleData, pushnotifyData } from '../../../../data';
import { useState } from 'react';
import { CustomPagination } from '../../../Ui';
import { NavLink } from 'react-router-dom';

const { Paragraph, Text } = Typography
const ArticleCards = ({setDeleteItem}) => {
    const [form] = Form.useForm();
    const [pageSize, setPageSize] = useState(10);
    const [current, setCurrent] = useState(1);

    const total = pushnotifyData.length;
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    

    return (
        <>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={20}>
                    <Form form={form} layout="vertical">
                        <Row gutter={[16, 16]} align={'middle'} justify={'space-between'}>
                            <Col span={24}>
                                <Flex gap={5} wrap>
                                    <SearchInput
                                        name='name'
                                        placeholder='Search'
                                        prefix={<img src='/assets/icons/search.png' alt='search icon' width={14} />}
                                        className='border-light-gray pad-x ps-0 radius-8 fs-13'
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
                                                            { label: <NavLink onClick={(e) => {e.preventDefault();setDeleteItem(true)}}>Delete</NavLink>, key: '2' },
                                                        ]
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button aria-labelledby='action button' className="bg-transparent border0 p-0">
                                                        <img src="/assets/icons/dots.png" alt="dots icon" width={16} />
                                                    </Button>
                                                </Dropdown>
                                            </Flex>
                                        ]}    
                                    >
                                        <Flex vertical gap={20}>
                                            <div>
                                                <div className='w-100 card-img-2 mb-2 radius-12'>
                                                    <img src={art?.img} width={'100%'} height={'100%'} className='object-cover object-top radius-12' alt="article image" />
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
                                                    {art?.description}
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