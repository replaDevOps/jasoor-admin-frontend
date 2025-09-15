import React,{useState} from 'react'
import { Button, Card, Col, Flex, Image, Row, Typography,Upload } from 'antd'
import { UPDATE_DEAL,UPLOAD_DOCUMENT} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const { Text } = Typography
const CommissionReceiptBuyer = ({ details }) => {
    const commission = details?.busines
    const jasoorDoc = commission?.documents?.find(doc => doc.title === 'Jasoor Commission');
    const [messageApi, contextHolder] = message.useMessage();
    const isDisable = details?.status === 'COMMISSION_VERIFICATION_PENDING'
    const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
        onCompleted: () => {
            messageApi.success("Status changed successfully!");
        },
        onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
        },
    });

    const handleMarkVerified = async () => {
        if (!details?.key) return;
        await updateDeals({
            variables: {
                input: {
                    id: details.key,
                    status: "DSA_FROM_BUYER_PENDING", // Example status
                },
            },
        });
    };

    const renderUploadedDoc = ({ fileName, fileSize, filePath }) => (
            <Flex vertical gap={2} className="uploaded-doc">
                <Card className="card-cs border-gray rounded-12">
                    <Flex justify="space-between" align="center">
                        <Flex gap={15}>
                            <Image src={'/assets/icons/file.png'} alt='file-image' fetchPriority="high" preview={false} width={20} />
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
                                <Image src={"/assets/icons/download.png"} fetchPriority="high" alt='download-icon' preview={false} width={20} />
                            </a>
                        )}
                    </Flex>
                </Card>
            </Flex>
        );

    if (updating) {
        return (
            <Flex justify="center" align="center" style={{ height: "200px" }}>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <>
            {contextHolder}
            <Row gutter={[16, 24]}>
                <Col span={24}>
                    <Flex vertical gap={6}>
                        <Text className="fw-600 text-medium-gray fs-13">
                            Jasoor’s Commission bank statement or screenshot
                        </Text>
                        {
                            jasoorDoc && (
                                renderUploadedDoc({
                                    fileName: jasoorDoc?.title,
                                    fileSize: "5.3 MB",
                                    filePath: jasoorDoc?.filePath,
                                })
                            )
                        }
                        {/* (
                        <Upload
                            beforeUpload={handleSingleFileUpload}
                            showUploadList={false}
                            accept=".pdf,.jpg,.png"
                        >
                            <Card className="card-cs border-gray rounded-12" style={{ cursor: "pointer" }}>
                                <Flex justify="space-between" align="center">
                                    <Flex gap={15}>
                                        <UploadOutlined style={{ fontSize: 20 }} />
                                        <Flex vertical>
                                            <Text className="fs-13 text-gray">
                                                {documents?.fileName || "Upload Business Transaction Receipt.pdf"}
                                            </Text>
                                            <Text className="fs-13 text-gray">
                                                {documents?.fileSize || "—"}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    <Image src={"/assets/icons/download.png"} preview={false} width={20} />
                                </Flex>
                            </Card>
                        </Upload>
                    )} */}
                </Flex>
                </Col>
                <Col span={24}>
                    <Flex>
                        <Button
                            type="primary"
                            className="btnsave bg-brand"
                            onClick={handleMarkVerified}
                            aria-labelledby='Mark as Verified'
                            disabled={!isDisable}
                        >
                            Mark as Verified
                        </Button>
                    </Flex>
                </Col>
            </Row>
        </>
    );
};
export {CommissionReceiptBuyer}