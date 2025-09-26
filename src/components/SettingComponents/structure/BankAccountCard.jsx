import { Button, Card, Col, Divider, Dropdown, Flex, Image, message, Radio, Row, Typography, Spin } from 'antd'
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { DeleteModal, MaskedAccount } from '../../Ui';
import { AddNewBankAccount } from '../modal';
import { gql, useMutation, useLazyQuery } from '@apollo/client';
import { GETADMINBANK } from '../../../graphql/query/user';

const { Title, Text } = Typography
const ACTIVEBANK = gql`
mutation SetActiveBank($setActiveBankId: ID!) {
    setActiveBank(id: $setActiveBankId)
}
`

const DELETEBANK = gql`
mutation DeleteBank($deleteBankId: ID!) {
    deleteBank(id: $deleteBankId)
}
`
const BankAccountCard = ({ settingId }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [value, setValue] = useState(null);
    const [ visible, setVisible ] = useState(false)
    const [ edititem, setEditItem ] = useState(null)
    const [ deleteitem, setDeleteItem ] = useState(null)
    const [ deleteBankId, setDeleteBankId ] = useState(null);

    const [getAdminBanks, { data: adminBanksData, loading: banksLoading }] = useLazyQuery(GETADMINBANK);

    useEffect(() => {
        getAdminBanks();
    }, [getAdminBanks]);

    const banks = adminBanksData?.getAdminBanks || [];
    const defaultBankId = banks?.find(b => b.isActive)?.id || (banks?.[0]?.id ?? null);

    useEffect(() => {
        setValue(defaultBankId);
    }, [defaultBankId]);

    const [setActiveBank, { loading: mutationLoading }] = useMutation(ACTIVEBANK, {
        refetchQueries: [{ query: GETADMINBANK }],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success('Bank status updated successfully');
        },
        onError: (err) => {
            messageApi.error(err.message);
        },
    });

    const [deleteBankMutation, { loading: deleteLoading }] = useMutation(DELETEBANK, {
        refetchQueries: [{ query: GETADMINBANK }],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success('Bank deleted successfully');
            setDeleteItem(false);
            setDeleteBankId(null);
        },
        onError: (err) => {
            messageApi.error(err.message);
        },
    });

    const onChange = async e => {
        const bankId = e.target.value;
        setValue(bankId);
        try {
            await setActiveBank({ variables: { setActiveBankId: bankId } });
        } catch {
            // error handled by onError
        }
    };

    const data = banks?.map((b, index) => ({
        id: b.id,
        title: b.isActive ? 'Default' : `Account ${index + 1}`,
        accountTitle: b?.accountTitle,
        bankname: b.bankName,
        accountno: b.accountNumber,
        ibanNo: b.iban
    })) || [];

    return (
        <>
            {contextHolder}
            <Spin spinning={mutationLoading || deleteLoading || banksLoading} tip={mutationLoading ? "Updating..." : deleteLoading ? "Deleting..." : banksLoading ? "Loading..." : undefined}>
                <Card className='radius-12 border-gray'>
                    <Flex gap={10} align='center' justify='space-between' className='mb-3'>
                        <Title level={5} className='m-0'>
                            Bank Account
                        </Title>
                        <Button aria-labelledby='Add Bank Detail' className="btnsave brand-bg border0 text-white" onClick={()=>setVisible(true)}>
                            Add Bank Detail
                        </Button>
                    </Flex>
                    <Radio.Group
                        onChange={onChange}
                        value={value}
                        className='w-100'
                        disabled={mutationLoading || deleteLoading}
                    >
                        <Row gutter={[24,12]}>
                            {
                                data?.map((items)=>
                                    <Col span={24} key={items.id}>
                                        <Card className='border-gray bg-transparent card-cs cursor' onClick={()=> setValue(items?.id)}>
                                            <Flex justify='space-between' className='w-100' align='center' gap={10}>
                                                <Flex gap={10} align='center'>
                                                    <Radio value={items.id}>{items.title}</Radio>
                                                    <Divider className='bg-gray h-20' type='vertical' />
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
                                                            { label: <NavLink onClick={(e) => {e.preventDefault();e.stopPropagation();setVisible(true);setEditItem(items)}}>Edit</NavLink>, key: '1' },
                                                            { label: <NavLink onClick={(e) => {e.preventDefault();e.stopPropagation();setDeleteItem(true);setDeleteBankId(items.id);}}>Delete</NavLink>, key: '2' },
                                                        ],
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button 
                                                        aria-labelledby='action button' 
                                                        className="bg-transparent border0 p-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                        }}
                                                    >
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
                </Card>
            </Spin>
            <AddNewBankAccount 
                visible={visible}
                edititem={edititem}
                onClose={()=>{setVisible(false);setEditItem(null)}}
                settingId={settingId}
            />
            <DeleteModal 
                visible={deleteitem}
                onClose={()=>{setDeleteItem(false);setDeleteBankId(null);}}
                title='Remove Bank Account?'
                subtitle='Are you sure you want to delete this bank account? 
                This action cannot be undone, and any active deals won’t be able to send payments to this account.'
                type='danger'
                onConfirm={() => {
                    if (deleteBankId) {
                        deleteBankMutation({ variables: { deleteBankId } });
                    }
                }}
            />
        </>
    )
}

export {BankAccountCard}