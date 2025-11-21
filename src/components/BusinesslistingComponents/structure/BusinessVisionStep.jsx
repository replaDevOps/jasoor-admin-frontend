import { useEffect } from 'react'
import { Card, Col, Flex, Form, Image, Row, Typography } from 'antd'
import { MyInput } from '../../Forms'
import { ModuleTopHeading } from '../../PageComponents'
import { t } from 'i18next'

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
                    <ModuleTopHeading level={4} name={t('Business Vision & Exit Plans')} />
                    <Text className='text-gray'>{t("Help buyers understand the future potential and your exit strategy")}</Text>
                </Flex>
                <Flex className='pill-round' gap={8} align='center'>
                    <Image src="/assets/icons/info-b.png" fetchPriority="high" preview={false} width={16} alt="info-icon" />
                    <Text className='fs-12 text-sky'>{t("For any query, contact us on +966 543 543 654")}</Text>
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
                                label={t('Support Duration')}
                                name='supportDuration'
                                required
                                message={t("Please enter support duration")}
                                placeholder={t('Enter support duration')}
                                addonAfter={t('Month')}
                                className='w-100 transparent-addon'
                            />
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MyInput
                                label={t("Number of Support Sessions")}
                                name="noSession"
                                required
                                message={t('Please enter number of support sessions')}
                                placeholder={t('Enter number of sessions')}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                textArea
                                label={t('Growth Opportunities (Optional)')}
                                name='growthOpportunities'
                                placeholder={t('Write about future opportunities for the buyer.')}
                                rows={5}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                textArea
                                label={t('Reason for Selling')}
                                name='reasonSelling'
                                required
                                message={t('Please enter reason for selling')}
                                placeholder={t('Briefly explain why you’re selling this business.')}
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