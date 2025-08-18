import { Card, Flex, Typography,Switch } from 'antd'
import { TableContent } from './TableContent'
import { UPDATE_ASSET ,UPDATE_INVENTORY,UPDATE_LIABILITY} from '../../../graphql/mutation'
import { useMutation,useQuery } from '@apollo/client';
import {GET_BUSINESSES_ASSETS_BY_ID} from '../../../graphql/query'
import { message,Spin } from "antd";

const { Title } = Typography
const AssetsTab = ({businessId}) => {

const outstandliabColumn = [
    {
        title: 'Liabilities name',
        dataIndex: 'liabilitiesname',
    },
    {
        title: 'Number of Items',
        dataIndex: 'noitems',
    },
    {
        title: 'Purchase Year',
        dataIndex: 'purchaseyear',
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Verify',
        dataIndex: 'verify',
        render:(_,row)=>{
            return(
                <Switch 
                    checked={row.verify === 1 || row.verify === true}
                    size="small"
                    onChange={(checked) => {
                        updateBusinessLibility({
                            variables: {
                                input: {
                                    id: row.key,
                                    isActive: checked,
                                }
                            }
                        });
                    }}
                />
            )
        }
    },
]

const keyassetColumn = [
    {
        title: 'Asset Name',
        dataIndex: 'assetname',
    },
    {
        title: 'Number of Items',
        dataIndex: 'noitems',
    },
    {
        title: 'Purchase Year',
        dataIndex: 'purchaseyear',
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Verify',
        dataIndex: 'verify',
        render:(_,row)=>{
            return(
                <Switch 
                checked={row.verify === 1 || row.verify === true} // handle boolean or 1
                size="small"
                onChange={(checked) => {
                    updateBusinessAssets({
                        variables: {
                            input: {
                                id: row.key,
                                isActive: checked,
                            }
                        }
                    });
                }}
            />
            )
        }
    },
]

const inventoryColumn = [
    {
        title: 'Inventory Name',
        dataIndex: 'inventoryname',
    },
    {
        title: 'Number of Items',
        dataIndex: 'noitems',
    },
    {
        title: 'Purchase Year',
        dataIndex: 'purchaseyear',
    },
    {
        title: 'Price',
        dataIndex: 'price',
    },
    {
        title: 'Verify',
        dataIndex: 'verify',
        render:(_,row)=>{
            return(
                <Switch 
                checked={row.verify === 1 || row.verify === true} // handle boolean or 1
                size="small"
                onChange={(checked) => {
                    updateBusinessInventory({
                        variables: {
                            input: {
                                id: row.key,
                                isActive: checked,
                            }
                        }
                    });
                }}
            />
            )
        }
    },
]
    const [messageApi, contextHolder] = message.useMessage();
    const { loading, error, data:business } = useQuery(GET_BUSINESSES_ASSETS_BY_ID, {
        variables: { getBusinessByIdId: businessId },
      });

      const outstandliabilitiesData = business?.getBusinessById?.liabilities.map(libility=>({
        key:libility?.id,
        liabilitiesname:libility?.name,
        noitems:libility?.quantity,
        purchaseyear:libility?.purchaseYear,
        price:libility?.price,
        verify:libility?.isActive,
      }));
      const keyassetData = business?.getBusinessById?.assets.map(asset=>({
        key:asset?.id,
        assetname:asset?.name,
        noitems:asset?.quantity,
        purchaseyear:asset?.purchaseYear,
        price:asset?.price,
        verify:asset?.isActive,
      }));
      const inventoryData = business?.getBusinessById?.inventoryItems.map(inventory=>({
        key:inventory?.id,
        inventoryname:inventory?.name,
        noitems:inventory?.quantity,
        purchaseyear:inventory?.purchaseYear,
        price:inventory?.price,
        verify:inventory?.isActive,
      }));
      const [updateBusinessAssets] = useMutation(UPDATE_ASSET, {
        refetchQueries: [
          {
            query: GET_BUSINESSES_ASSETS_BY_ID,
            variables: { getBusinessByIdId: businessId}, // make sure you pass the current business id
          },
        ],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success("Stats changed successfully!");
          },
          onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
          },
      });
      const [updateBusinessInventory] = useMutation(UPDATE_INVENTORY, {
        refetchQueries: [
          {
            query: GET_BUSINESSES_ASSETS_BY_ID,
            variables: { getBusinessByIdId: businessId }, // make sure you pass the current business id
          },
        ],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success("Stats changed successfully!");
          },
          onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
          },
      });
      const [updateBusinessLibility] = useMutation(UPDATE_LIABILITY, {
        refetchQueries: [
          {
            query: GET_BUSINESSES_ASSETS_BY_ID,
            variables: { getBusinessByIdId: businessId }, // make sure you pass the current business id
          },
        ],
        awaitRefetchQueries: true,
        onCompleted: () => {
            messageApi.success("Stats changed successfully!");
          },
          onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
          },
      });
    return (
        <>
        {contextHolder}
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
        </>
    )
}

export {AssetsTab}