import React,{useState} from 'react'
import { Button, Card, Col, Flex, Image, Row, Typography,Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { UPDATE_DEAL,UPLOAD_DOCUMENT} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const { Text } = Typography
const CommissionReceiptBuyer = ({ details }) => {
    const commission = details?.busines
    const jasoorDoc = commission?.documents?.find(doc => doc.title === 'Jasoor Commission');
    const [messageApi, contextHolder] = message.useMessage();
    const [documents, setDocuments] = useState(null); // State to store uploaded file info

    const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
        onCompleted: () => {
            messageApi.success("Status changed successfully!");
        },
        onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
        },
    });

    const [uploadDocument, { loading: uploading }] = useMutation(UPLOAD_DOCUMENT, {
        onCompleted: () => {
            messageApi.success("Document uploaded successfully!");
        },
        onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
        },
    });

    const handleSingleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("https://220.152.66.148.host.secureserver.net/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const result = await response.json();

            // Set the uploaded file info to state
            setDocuments({
                fileName: file.name,
                fileType: file.type,
                filePath: result.fileUrl || result.url,
                fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            });

            // Call GraphQL mutation to save file info in backend
            await uploadDocument({
                variables: {
                    input: {
                        title:'Jasoor Commission',
                        businessId: details?.businessId,
                        filePath: result.fileUrl || result.url,
                        fileName: file.name,
                        fileType: file.type,
                        businessId:details?.busines?.id
                    },
                },
            });

            return false; // Prevent default upload behavior
        } catch (error) {
            console.error("Error uploading file:", error);
            messageApi.error(error.message || "Upload failed!");
            return false;
        }
    };

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

    if (updating || uploading) {
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
                    <Card className="card-cs border-gray rounded-12">
                        <Flex justify="space-between" align="center">
                            <Flex gap={15}>
                                <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                                <Flex vertical>
                                    <Text className="fs-13 text-gray">
                                        Business Transaction Receipt .pdf
                                    </Text>
                                    <Text className='fs-13 text-gray'>
                                        5.3 MB
                                    </Text>
                                </Flex>
                            </Flex>
                            <a href={''} target="_blank" rel="noopener noreferrer">
                                <Image src={"/assets/icons/download.png"} preview={false} width={20} />
                            </a>
                        </Flex>
                    </Card>
                    {/* {jasoorDoc ? (
                    <Card className="card-cs border-gray rounded-12">
                        <Flex justify="space-between" align="center">
                            <Flex gap={15}>
                                <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                                <Flex vertical>
                                    <Text className="fs-13 text-gray">
                                        {jasoorDoc.title}
                                    </Text>
                                </Flex>
                            </Flex>
                            <a href={jasoorDoc.filePath} target="_blank" rel="noopener noreferrer">
                                <Image src={"/assets/icons/download.png"} preview={false} width={20} />
                            </a>
                        </Flex>
                    </Card>
                    
                ) : (
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
                            disabled={!documents} // enable only after upload
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