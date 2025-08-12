import React from 'react'
import { Button, Card, Checkbox, Col, Flex, Image, Row, Typography } from 'antd'
import { MaskedAccount } from '../../Ui'

const { Text } = Typography
const BankAccountDetails = () => {

    return (
        <Flex vertical gap={5}>
            <Text className='fw-600 fs-14'>Bank Account</Text>
            <Flex vertical className='deals-status w-100 sky-lightest'>
                <Text className='fs-15 fw-500 text-gray'>
                    Master Card
                </Text>
                <MaskedAccount iban={'DE89370400440532013000'} className={'fs-13 text-gray'} />
            </Flex>
        </Flex>
    )
}

export {BankAccountDetails}