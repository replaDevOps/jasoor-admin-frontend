import React, { useEffect } from 'react'
import { Card, Col, Flex, Form, Image, Row, Typography } from 'antd'
import { MyInput } from '../../Forms'
import { ModuleTopHeading } from '../../Pagecomponents'

const { Text } = Typography
const BusinessVisionStep = ({ data, setData }) => {
    const handleFormChange = (_, allValues) => {
        const { supportDuration, noSession, growthOpportunities, reasonSelling } = allValues;

        setData((prev) => {
            const updated = {
                ...prev,
                supportDuration,
                supportSession:noSession,
                growthOpportunities,
                reason:reasonSelling
            };

            // prevent unnecessary re-renders
            return JSON.stringify(updated) !== JSON.stringify(prev) ? updated : prev;
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            supportDuration: data.supportDuration,
            noSession: data.supportSession,
            growthOpportunities: data.growthOpportunities,
            businessPrice: data.price,
            reasonSelling: data.reason,
        });
    }, [data]);
    const [form] = Form.useForm();    
    return (
        <>
            <Flex justify='space-between' className='mb-3' gap={10} wrap align='flex-start'>
                <Flex vertical gap={1} >
                    <ModuleTopHeading level={4} name='Business Vision & Exit Plans' onClick={()=>{}} />
                    <Text className='text-gray'>Help buyers understand the future potential and your exit strategy</Text>
                </Flex>
                <Flex className='pill-round' gap={8} align='center'>
                    <Image src="/assets/icons/info-b.png" preview={false} width={16} alt="" />
                    <Text className='fs-12 text-sky'>For any query, contact us on +966 543 543 654</Text>
                </Flex>
            </Flex>
            <Form
                layout="vertical"
                form={form}
                requiredMark={false}
                onValuesChange={handleFormChange}
            >
                <Card className='radius-12 border-gray mb-3'>
                    <Row gutter={24}>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MyInput
                                label='Support Duration'
                                name='supportDuration'
                                required
                                message="Please enter support duration"
                                placeholder='Enter support duration'
                                addonAfter={'Month'}
                                className='w-100 transparent-addon'
                            />
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MyInput
                                label="Number of Support Sessions"
                                name="noSession"
                                required
                                message='Please enter number of support sessions'
                                placeholder='Enter number of sessions'
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                textArea
                                label='Growth Opportunities (Optional)'
                                name='growthOpportunities'
                                placeholder='Write about future opportunities for the buyer.'
                                rows={5}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                textArea
                                label='Reason for Selling'
                                name='reasonSelling'
                                required
                                message='Please enter reason for selling'
                                placeholder='Briefly explain why you’re selling this business.'
                                rows={5}
                            />
                        </Col>
                    </Row>   
                </Card>  
            </Form>
        </>
    )
}

export {BusinessVisionStep}