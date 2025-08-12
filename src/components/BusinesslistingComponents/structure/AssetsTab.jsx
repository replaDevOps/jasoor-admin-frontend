import { Card, Flex, Typography } from 'antd'
import { inventoryColumn, inventoryData, keyassetColumn, keyassetData, outstandliabColumn, outstandliabilitiesData } from '../../../data'
import { TableContent } from './TableContent'

const { Title } = Typography
const AssetsTab = () => {

    return (
        <Flex vertical gap={15}>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={15}>
                    <Title level={5} className="m-0">
                        Outstanding Liabilities / Debt
                    </Title>
                    <TableContent data={outstandliabilitiesData} columns={outstandliabColumn} />
                </Flex>
            </Card>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={15}>
                    <Title level={5} className="m-0">
                        Key Asset
                    </Title>
                    <TableContent data={keyassetData} columns={keyassetColumn} />
                </Flex>
            </Card>
            <Card className='radius-12 border-gray'>
                <Flex vertical gap={15}>
                    <Title level={5} className="m-0">
                        Inventory
                    </Title>
                    <TableContent data={inventoryData} columns={inventoryColumn} />
                </Flex>
            </Card>
        </Flex>
    )
}

export {AssetsTab}