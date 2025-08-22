import React from 'react'
import { Button, Card, Flex, Typography } from 'antd'
import { MaskedAccount } from '../../Ui'
import { SEND_BANK, UPDATE_DEAL} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const { Text } = Typography
const BankAccountDetails = ({details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [sendBank, { loading: sending }] = useMutation(SEND_BANK, {
        onCompleted: () => {
            messageApi.success("Status changed successfully!");
        },
        onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
        },
    });
    const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
            onCompleted: () => {
                messageApi.success("Status changed successfully!");
            },
            onError: (err) => {
                messageApi.error(err.message || "Something went wrong!");
            },
        });
    
    const buyerBanks = details?.banks;

    const handleSendAccount = async (bank) => {
        try {
            await sendBank({
                variables: {
                    sendBankToBuyerId: bank.id,        // assuming bank has `id`
                },
            });
            await updateDeals({
                variables: {
                    input: {
                        id: details.key,
                        status: "SELLER_PAYMENT_VERIFICATION_PENDING", // Example status
                    },
                },
            });
        } catch (error) {
            console.error("Send bank error:", error);
        }
    };

    if (updating || sending) {
        return (
            <Flex justify="center" align="center" style={{ height: "200px" }}>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <>
        {contextHolder}
        <Flex vertical gap={10}>
            <Text className="fw-600 fs-14">Bank Account</Text>
            {buyerBanks.length > 0 ? (
                buyerBanks.map((bank, index) => (
                    <Card key={index} className="deals-status w-100 sky-lightest rounded-12">
                        <Flex vertical gap={6}>
                            <Text className="fs-15 fw-500 text-gray">
                                {bank.bankName}
                            </Text>
                            <Text className="fs-13 text-gray">
                                Account Title: {bank.accountTitle}
                            </Text>
                            <MaskedAccount
                                iban={bank.iban}
                                className="fs-13 text-gray"
                            />
                            <Button
                                type="primary"
                                className="btnsave bg-brand mt-2"
                                onClick={() => handleSendAccount(bank)}
                                disabled={bank.isSend} 
                            >
                                {bank.isSend ? "Sent to Buyer" : "Send Account to Buyer"}
                            </Button>
                        </Flex>
                    </Card>
                ))
            ) : (
                <Text className="fs-13 text-gray">No bank accounts available</Text>
            )}
        </Flex>
        </>
    )
}

export {BankAccountDetails}