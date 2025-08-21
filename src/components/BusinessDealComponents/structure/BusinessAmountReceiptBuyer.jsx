import React,{useState} from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card,  Col, Flex, Image, Row, Typography,Upload } from 'antd'
import { UPDATE_DEAL,UPLOAD_DOCUMENT} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const { Text } = Typography
const BusinessAmountReceiptBuyer = ({details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [documents, setDocuments] = useState(null);
    const paymentReceipt = details?.busines?.documents?.find(doc => doc.title === 'Buyer Payment Receipt');
    const sellerBank = details?.banks?.find(doc => doc.isSend === true);
    const businessamountrecpData = [
        {title:'Seller’s Bank Name', desc: sellerBank?.bankName },
        {title:'Seller’s IBAN', desc:sellerBank?.iban },
        {title:'Account Holder Name',desc:sellerBank?.accountTitle },
        {title:'Amount to Pay', desc:details?.finalizedOffer },
    ]

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
                            title:'Buyer Payment Receipt',
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
                    status: "PAYMENT_APPROVAL_FROM_SELLER_PENDING", // Example status
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
                    <Text className="fs-14 text-gray">Upload transaction receipt or screenshot</Text>

                    {/* If receipt already exists, show it */}
                    {paymentReceipt || documents ? (
                        <Card className="card-cs border-gray rounded-12">
                            <Flex justify="space-between" align="center">
                                <Flex gap={15}>
                                    <Image src={"/assets/icons/file.png"} preview={false} width={20} />
                                    <Flex vertical>
                                        <Text className="fs-13 text-gray">
                                            {documents?.fileName || paymentReceipt?.fileName}
                                        </Text>
                                        <Text className="fs-13 text-gray">
                                            {documents?.fileSize || "Uploaded Receipt"}
                                        </Text>
                                    </Flex>
                                </Flex>
                                <a
                                    href={documents?.filePath || paymentReceipt?.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Image src={"/assets/icons/download.png"} preview={false} width={20} />
                                </a>
                            </Flex>
                        </Card>
                    ) : (
                        // Else show upload option
                        <Upload
                            beforeUpload={handleSingleFileUpload}
                            showUploadList={false}
                            accept=".pdf,.jpg,.png"
                        >
                            <Card className="card-cs border-gray rounded-12" style={{ cursor: "pointer" }}>
                                <Flex justify="center" align="center" gap={10}>
                                    <UploadOutlined style={{ fontSize: 20 }} />
                                    <Text className="fs-13 text-gray">
                                        Click to Upload Business Transaction Receipt
                                    </Text>
                                </Flex>
                            </Card>
                        </Upload>
                    )}
                </Col>

                <Col span={24}>
                    <Flex>
                        <Button
                            type="primary"
                            className="btnsave bg-brand"
                            onClick={handleMarkVerified}
                            disabled={!documents && !paymentReceipt} // ✅ enable only if uploaded or already exists
                        >
                            Mark as Verified
                        </Button>
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export {BusinessAmountReceiptBuyer}