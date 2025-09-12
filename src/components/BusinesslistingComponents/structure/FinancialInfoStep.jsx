import React, { useEffect } from 'react'
import { Card, Col, Flex, Form, Row, Select, Typography,Input, Image } from 'antd'
import { MyInput } from '../../Forms'
import { ModuleTopHeading } from '../../PageComponents'
import { FormReplicate } from '../../Header'
import { revenueLookups } from '../../../shared'

const { Text } = Typography
const FinancialInfoStep = ({ data, setData }) => {

    const [form] = Form.useForm();

    const foundedYear = new Date(data?.foundedDate).getFullYear();
    const currentYear = new Date().getFullYear();

    const yearOp = [];
    for (let y = foundedYear; y <= currentYear; y++) {
        yearOp.push({ id: String(y), name: y });
    }

    const handleFormChange = (_, allValues) => {
        setData(prev => ({
            ...prev,
            revenueTime: allValues.revenueTime,
            revenue: allValues.revenue,
            profittime: allValues.profittime,
            profit: allValues.profit,
            price: allValues.businessPrice,
            profitMargen: allValues.profitMargin,
            assets: allValues.keyassets?.map(item => ({
                name: item?.assetName || '',
                quantity: item?.noItems || '',
                purchaseYear: item?.purchaseYear || '',
                price: item?.price || '',
            })) || [],
            liabilities: allValues.liability?.map(item => ({
                name: item?.liabilityName || '',
                quantity: item?.quantity || '',
                purchaseYear: item?.liabilitypurchaseYear || '',
                price: item?.liabilityPrice || '',
            })) || [],
            inventoryItems: allValues.inventory?.map(item => ({
                name: item?.inventoryName || '',
                quantity: item?.inventoryquantity || '',
                purchaseYear: item?.inventoryypurchaseYear || '',
                price: item?.inventoryPrice || '',
            })) || [],
        }));
    };

    useEffect(() => {
        form.setFieldsValue({
            revenueTime: data.revenueTime,
            revenue: data.revenue,
            profittime: data.profittime,
            profit: data.profit,
            businessPrice: data.price,
            profitMargin: data.profitMargen,
            keyassets: data.assets?.map(item => ({
                assetName: item.name,
                noItems: item.quantity,
                purchaseYear: item.purchaseYear,
                price: item.price,
            })),
            liability: data.liabilities?.map(item => ({
                liabilityName: item.name,
                quantity: item.quantity,
                liabilitypurchaseYear: item.purchaseYear,
                liabilityPrice: item.price,
            })),
            inventory: data.inventoryItems?.map(item => ({
                inventoryName: item.name,
                inventoryquantity: item.quantity,
                inventoryypurchaseYear: item.purchaseYear,
                inventoryPrice: item.price,
            })),
        });
    }, [data]);

    useEffect(() => {
        const allValues = form.getFieldsValue();

        const revenue = Number(allValues.revenue || 0);
        const profit = Number(allValues.profit || 0);
        const price = Number(allValues.businessPrice || 0);
        const profitPeriod = Number(allValues.profittime);
        const revenuePeriod = Number(allValues.revenueTime);

        let adjustedRevenue = revenue;
        let adjustedProfit = profit;

        if (profitPeriod !== revenuePeriod) {
            if (profitPeriod === 1 && revenuePeriod === 2) {
                adjustedRevenue = revenue / 2;
            } else if (profitPeriod === 2 && revenuePeriod === 1) {
                adjustedProfit = profit / 2;
            }
        }

        const months = profitPeriod === 1 ? 6 : 12;
        const avgMonthlyProfit = adjustedProfit / months;

        const multiple = price && avgMonthlyProfit
            ? (price / avgMonthlyProfit)
            : '';
        const scaledMultiple = multiple
            ? Number(String(Math.floor(Math.abs(multiple)))[0])
            : null;

        const profitMargin = adjustedRevenue
            ? ((adjustedProfit / adjustedRevenue) * 100).toFixed(2)
            : '';

        const annualProfit = profitPeriod === 1 ? adjustedProfit * 2 : adjustedProfit;
        const recoveryTime = annualProfit ? (price / annualProfit).toFixed(2) : '';
        const capitalRecovery = avgMonthlyProfit ? (price / avgMonthlyProfit).toFixed(2) : '';

        setData(prev => ({
            ...prev,
            multiple: scaledMultiple,
            profitMargen: profitMargin,
            recoveryTime,
            capitalRecovery
        }));

        form.setFieldsValue({
            multiple: scaledMultiple,
            profitMargin,
            recoveryTime,
            capitalRecovery
        });
    }, [form,
        form.getFieldValue('revenue'),
        form.getFieldValue('profit'),
        form.getFieldValue('businessPrice'),
        form.getFieldValue('profittime'),
        form.getFieldValue('revenueTime')]);

    return (
        <>
            <Flex justify='space-between' className='mb-3' gap={10} wrap align='flex-start'>
                 <Flex vertical gap={1}>
                    <ModuleTopHeading level={4} name='Share your business numbers & potential' />
                    <Text className='text-gray'>These numbers help buyers understand your business value.</Text>
                </Flex>
                <Flex className='pill-round' gap={8} align='center'>
                    <Image src="/assets/icons/info-b.png" preview={false} width={16} alt="info-icon" />
                    <Text className='fs-12 text-sky'>For any query, contact us on +966 543 543 654</Text>
                </Flex>
            </Flex>
            <Form layout="vertical" form={form} requiredMark={false} onValuesChange={handleFormChange}
            >
                <Card className='radius-12 border-gray mb-3'>
                    <Row gutter={24}>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                        <Form.Item label="Revenue" className="w-100">
                            <Flex gap={2} className="w-100">
                                <Form.Item name="revenueTime" noStyle>
                                    <Select
                                        placeholder="Select period"
                                        className="addonselect fs-14"
                                        style={{ width: 180 }}
                                    >
                                    {revenueLookups?.map((list, index) => (
                                        <Select.Option value={list?.id} key={index}>
                                        {list?.name}
                                        </Select.Option>
                                    ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="revenue"
                                    rules={[{ required: true, message: "Please enter revenue" }]}
                                    noStyle
                                >
                                    <Input
                                        type='number'
                                        placeholder="Enter revenue"
                                        className="w-100 add-p"
                                        addonBefore={<img src="/assets/icons/reyal-g.png" width={15} fetchpriority="high" />}
                                    />
                                </Form.Item>
                            </Flex>
                        </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                            <Form.Item label="Profit" className="w-100">
                                <Flex gap={2} className="w-100">
                                <Form.Item name="profittime" noStyle>
                                    <Select
                                    placeholder="Select period"
                                    className="addonselect fs-14"
                                    style={{ width: 180 }}
                                    >
                                    {revenueLookups?.map((list, index) => (
                                        <Select.Option value={list?.id} key={index}>
                                        {list?.name}
                                        </Select.Option>
                                    ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="profit"
                                    rules={[{ required: true, message: "Please enter profit" }]}
                                    noStyle
                                >
                                    <Input
                                        type='number'
                                        placeholder="Enter profit"
                                        className="w-100 add-p"
                                        addonBefore={<img src="/assets/icons/reyal-g.png" width={14} fetchpriority="high" />}
                                    />
                                </Form.Item>
                                </Flex>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        {(() => {
                            const profitPeriod = form.getFieldValue('profittime');
                            const revenuePeriod = form.getFieldValue('revenueTime');

                            if (profitPeriod && revenuePeriod && profitPeriod !== revenuePeriod) {
                            return (
                                <Text type="danger">
                                Revenue is for {revenuePeriod === 1 ? '6 months' : '12 months'}, but Profit is for {profitPeriod === 1 ? '6 months' : '12 months'}. Profit Margin is adjusted accordingly.
                                </Text>
                            );
                            }
                            return null;
                        })()}
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MyInput
                                label="Profit Margin"
                                name="profitMargin"
                                required
                                readOnly
                                placeholder='Enter profit margin'
                                suffix = '%'
                            />
                        </Col>
                        
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MyInput
                                label='Business Price'
                                name='businessPrice'
                                required
                                message="Please enter business price"
                                placeholder='Enter business price'
                                addonBefore={
                                    <img src='/assets/icons/reyal-g.png' width={14} fetchpriority="high" />
                                }
                                className='w-100'
                            />
                        </Col>
                    </Row>   
                </Card> 
                <Card className='radius-12 border-gray mb-3'>
                    <FormReplicate
                        dayKey="keyassets"
                        title="Key Assets (Optional)"
                        form={form}
                        fieldsConfig={[
                            {
                                name: "assetName",
                                label: "Asset Name",
                                placeholder: "Write asset name",
                                type: "input",
                            },
                            {
                                name: "noItems",
                                label: "Number of items",
                                placeholder: "Enter quantity",
                                type: "input",
                            },
                            {
                                name: "purchaseYear",
                                label: "Purchase Year",
                                placeholder: "Choose purchase year",
                                type: "select",
                                options: yearOp,
                            },
                            {
                                name: "price",
                                label: "Total Price",
                                placeholder: "Enter price",
                                type: "input",
                                addonBefore: <img src="/assets/icons/reyal-g.png" width={14} fetchpriority="high"/>,
                                className: "w-100 bg-white",
                            },
                        ]}
                    />
                </Card>
                <Card className='radius-12 border-gray mb-3'>
                    <FormReplicate
                        dayKey="liability"
                        title="Outstanding Liabilities / Debt (Optional)"
                        form={form}
                        fieldsConfig={[
                            {
                                name: "liabilityName",
                                label: "Liabilities Name",
                                placeholder: "Write liability name",
                                type: "input",
                            },
                            {
                                name: "quantity",
                                label: "Number of items",
                                placeholder: "Enter quantity",
                                type: "input",
                            },
                            {
                                name: "liabilitypurchaseYear",
                                label: "Purchase Year",
                                placeholder: "Choose purchase year",
                                type: "select",
                                options: yearOp,
                            },
                            {
                                name: "liabilityPrice",
                                label: "Total Price",
                                placeholder: "Enter price",
                                type: "input",
                                addonBefore: <img src="/assets/icons/reyal-g.png" width={14} fetchpriority="high" />,
                                className: "w-100 bg-white",
                            },
                        ]}
                    />
                </Card> 
                <Card className='radius-12 border-gray mb-3'>
                    <FormReplicate
                        dayKey="inventory"
                        title="Inventory (Optional)"
                        form={form}
                        fieldsConfig={[
                            {
                                name: "inventoryName",
                                label: "Inventory Name",
                                placeholder: "Write inventory name",
                                type: "input",
                            },
                            {
                                name: "inventoryquantity",
                                label: "Number of items",
                                placeholder: "Enter quantity",
                                type: "input",
                            },
                            {
                                name: "inventoryypurchaseYear",
                                label: "Purchase Year",
                                placeholder: "Choose purchase year",
                                type: "select",
                                options: yearOp,
                            },
                            {
                                name: "inventoryPrice",
                                label: "Total Price",
                                placeholder: "Enter price",
                                type: "input",
                                addonBefore: <img src="/assets/icons/reyal-g.png" width={14} fetchpriority="high" />,
                                className: "w-100 bg-white",
                            },
                        ]}
                    />
                </Card>  
            </Form>
        </>
    )
}

export {FinancialInfoStep}