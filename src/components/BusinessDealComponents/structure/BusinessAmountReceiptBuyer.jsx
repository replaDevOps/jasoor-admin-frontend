import { useEffect } from 'react'
import { Button, Card,  Col, Flex, Image, Row, Typography } from 'antd'
import { UPDATE_DEAL} from '../../../graphql/mutation/mutations';
import { useMutation,useQuery } from '@apollo/client';
import { message,Spin } from "antd";
import { GETDEAL,GETUSERBANK } from '../../../graphql/query';
import { useTranslation } from 'react-i18next';

const { Text } = Typography
const BusinessAmountReceiptBuyer = ({details}) => {
    const {t} = useTranslation()
    const [messageApi, contextHolder] = message.useMessage();
    const sellerReceipt = details?.busines?.documents?.find(doc => doc.title === 'Buyer Payment Receipt');

    const { loading, error:userError, data:banksData } = useQuery(GETUSERBANK, {
            variables: { getUserBankId: details?.busines?.seller?.id },
        });
    const banks = banksData?.getUserBanks?.find(doc => doc.isActive === true)

    const businessamountrecpData = [
        {title:t('Seller’s Bank Name'), desc: t(banks?.bankName) },
        {title:t('Seller’s IBAN'), desc:banks?.iban },
        {title:t('Account Holder Name'),desc:banks?.accountTitle },
        {title:t('Amount to Pay'), desc:details?.finalizedOffer },
    ]
    const [updateDeals, { loading: updating, data, error }] = useMutation(UPDATE_DEAL, {
        refetchQueries: [ { query: GETDEAL, variables: { getDealId: details?.key } } ],
        awaitRefetchQueries: true,
    });
    useEffect(() => {
        if (data?.updateDeal?.id) {
            messageApi.success(t("Buyer payment receipt verified successfully!"));
        }
    }, [data?.updateDeal?.id]);

    useEffect(() => {
        if (error) {
            messageApi.error(error.message || t("Something went wrong!"));
        }
    }, [error]);
    
    const handleMarkVerified = async () => {
        if (!details?.key) return;
        await updateDeals({
            variables: {
                input: {
                    id: details.key,
                    isPaymentVedifiedAdmin: true,
                },
            },
        });
    };
    const renderUploadedDoc = ({ fileName, fileSize, filePath }) => (
        <Flex vertical gap={6}>
            <Text className="fw-600 text-medium-gray fs-13">{t("Upload transaction receipt or screenshot")}</Text>
            <Card className="card-cs border-gray rounded-12">
                <Flex justify="space-between" align="center">
                    <Flex gap={15}>
                        <Image src={'/assets/icons/file.png'} preview={false} width={20} alt='file-image' fetchPriority="high" />
                        <Flex vertical>
                            <Text className="fs-13 text-gray">
                                {fileName}
                            </Text>
                            <Text className='fs-13 text-gray'>
                                {fileSize}
                            </Text>
                        </Flex>
                    </Flex>
                    {filePath && (
                    <a href={filePath} target="_blank" rel="noopener noreferrer">
                        <Image src={"/assets/icons/download.png"} alt='download-icon' fetchPriority="high" preview={false} width={20} />
                    </a>
                    )}
                </Flex>
            </Card>
        </Flex>
    );
    if (updating || loading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }
    return (
        <>
            {contextHolder}
            <Row gutter={[16, 24]}>
                <Col span={24}>
                    <Row gutter={[16, 16]}>
                        {businessamountrecpData?.map((list, index) => (
                            <Col xs={24} sm={12} md={6} lg={6} key={index}>
                                <Flex vertical gap={3}>
                                    <Text className="text-gray fs-14">{list?.title}</Text>
                                    <Text className="fs-15 fw-500">{list?.desc}</Text>
                                </Flex>
                            </Col>
                        ))}
                    </Row>
                </Col>

                <Col span={24}>
                    {
                        sellerReceipt && (
                        renderUploadedDoc({
                            fileName: sellerReceipt?.title,
                            fileSize: "5.3 MB",
                            filePath: sellerReceipt?.filePath,
                        })
                    )}
                </Col>

                {/* <Col span={24}>
                    <Flex>
                        <Button
                            type="primary"
                            className="btnsave bg-brand"
                            onClick={handleMarkVerified}
                            aria-labelledby="Mark as Verified"
                            disabled={!(sellerReceipt && !details?.isPaymentVedifiedAdmin)}
                        >
                            {t("Mark as Verified")}
                        </Button>
                    </Flex>
                </Col> */}
            </Row>
        </>
    )
}

export {BusinessAmountReceiptBuyer}