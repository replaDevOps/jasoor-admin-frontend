import { Button, Card, Col, Divider, Dropdown, Flex, Form, Image, Radio, Row, Typography } from 'antd'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { DeleteModal, MaskedAccount } from '../../Ui';
import { AddNewBankAccount } from '../modal';

const { Title, Text } = Typography
const BankAccountCard = ({banks,settingId}) => {
    const [form] = Form.useForm();
    const [value, setValue] = useState(1);
    const [ visible, setVisible ] = useState(false)
    const [ edititem, setEditItem ] = useState(null)
    const [ deleteitem, setDeleteItem ] = useState(null)
    const onChange = e => {
        setValue(e.target.value);
    };

    const data = banks?.map((b, index) => ({
        id: b.id,
        title: index === 0 ? 'Default' : `Account ${index + 1}`,
        bankname: b.bankName,
        accountno: b.accountNumber,
        ibanNo: b.iban
    })) || [];

    return (
        <>
            <Card className='radius-12 border-gray'>
                <Flex gap={10} align='center' justify='space-between' className='mb-3'>
                    <Title level={5} className='m-0'>
                        Bank Account
                    </Title>
                    <Button aria-labelledby='Add Bank Detail' className="btnsave brand-bg border0 text-white" onClick={()=>setVisible(true)}>
                        Add Bank Detail
                    </Button>
                </Flex>
                <Form
                    layout='vertical'
                    form={form}
                    // onFinish={onFinish} 
                    requiredMark={false}
                >
                    <Radio.Group
                        onChange={onChange}
                        value={value}
                        className='w-100'
                    >
                        <Row gutter={[24,12]}>
                            {
                                data?.map((items,_)=>
                                    <Col span={24} key={items.id}>
                                        <Card className='border-gray bg-transparent card-cs cursor' onClick={()=>setValue(items?.id)}>
                                            <Flex justify='space-between' className='w-100' align='center' gap={10}>
                                                <Flex gap={10} align='center'>
                                                    <Radio value={items.id}>{items.title}</Radio>
                                                    <Divider className='bg-gray' style={{height: 20}} type='vertical' />
                                                    <Flex gap={12} align='center'> 
                                                        <Image src='/assets/icons/bank-ic.svg' width={20} preview={false} fetchPriority="high" alt='bank-icon' />
                                                        <Flex vertical gap={0}>
                                                            <Text className='fs-14'>{items.bankname}</Text>
                                                            <MaskedAccount iban={items.ibanNo} className={'fs-13 text-gray'} />
                                                        </Flex>
                                                    </Flex>
                                                </Flex>
                                                <Dropdown
                                                    menu={{
                                                        items: [
                                                            { label: <NavLink onClick={(e) => {e.preventDefault();setVisible(true);setEditItem(items)}}>Edit</NavLink>, key: '1' },
                                                            { label: <NavLink onClick={(e) => {e.preventDefault();setDeleteItem(true);}}>Delete</NavLink>, key: '2' },
                                                        ],
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button aria-labelledby='action button' className="bg-transparent border0 p-0">
                                                        <img src="/assets/icons/dots.png" alt="dot icon" width={16} fetchPriority="high" />
                                                    </Button>
                                                </Dropdown>
                                            </Flex>
                                        </Card>
                                    </Col>
                                )
                            }
                        </Row>
                    </Radio.Group>
                </Form>
            </Card>
            <AddNewBankAccount 
                visible={visible}
                edititem={edititem}
                onClose={()=>{setVisible(false);setEditItem(null)}}
                settingId={settingId}
            />
            <DeleteModal 
                visible={deleteitem}
                onClose={()=>setDeleteItem(false)}
                title='Remove Bank Account?'
                subtitle='Are you sure you want to delete this bank account? 
                This action cannot be undone, and any active deals won’t be able to send payments to this account.'
                type='danger'
            />
        </>
    )
}

export {BankAccountCard}