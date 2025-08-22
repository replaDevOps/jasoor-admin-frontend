import React,{useState} from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Image, Row, Typography,Upload } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { UPDATE_DEAL,UPLOAD_DOCUMENT} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const { Text } = Typography
const DocumentPaymentConfirmation = ({details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [documents, setDocuments] = useState({});
    const sellerReceipt = details?.busines?.documents?.find(doc => doc.title === 'Buyer Payment Receipt');
    const data = {title:'Business Transaction Receipt', subtitle: sellerReceipt?.title }
    const upload =[
        {
            title:'Updated Commercial Registration (CR)',
            subtitle:'Commercial Registration (CR).png',
        },
        {
            title:'Notarized Ownership Transfer Letter',
            subtitle:'Notarized Ownership Transfer Letter.png',
        },
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

    const confirmPayment = async () => {
        if (!details?.key) return;
        await updateDeals({
            variables: {
                input: {
                    id: details.key,
                    status: "DOCUMENT_PAYMENT_CONFIRMATION", // Example status
                },
            },
        });
    };
    const handleMarkVerified = async () => {
        if (!details?.key) return;
        await updateDeals({
            variables: {
                input: {
                    id: details.key,
                    status: "WAITING", // Example status
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
    const uploadDocs = [
        { title: "Updated Commercial Registration (CR)" },
        { title: "Notarized Ownership Transfer Letter" },
    ];

    const renderUploadedDoc = (doc) => (
        <Card className="card-cs border-gray rounded-12 mt-3">
            <Flex justify="space-between" align="center">
                <Flex gap={15}>
                    <Image src={"/assets/icons/file.png"} preview={false} width={20} />
                    <Flex vertical>
                        <Text className="fs-13 text-gray">{doc?.fileName}</Text>
                        <Text className="fs-13 text-gray">{doc?.fileSize}</Text>
                    </Flex>
                </Flex>
                <a href={doc?.filePath} target="_blank" rel="noopener noreferrer">
                    <Image src={"/assets/icons/download.png"} preview={false} width={20} />
                </a>
            </Flex>
        </Card>
    );
    return (
        <>
            {contextHolder}
            <Row gutter={[16, 24]}>
                {/* Buyer Payment Receipt */}
                <Col span={24}>
                    <Text className="fw-600 fs-14">Business Transaction Receipt</Text>
                    {sellerReceipt ? (
                        renderUploadedDoc({
                            fileName: sellerReceipt?.fileName,
                            fileSize: "5.3 MB",
                            filePath: sellerReceipt?.filePath,
                        })
                    ) : (
                        <Upload
                            beforeUpload={(file) => handleSingleFileUpload(file, "Buyer Payment Receipt")}
                            showUploadList={false}
                            accept=".pdf,.jpg,.png"
                        >
                            <Button icon={<UploadOutlined />}>Upload Buyer Payment Receipt</Button>
                        </Upload>
                    )}
                    <Flex className="mt-3">
                        <Button
                            type="primary"
                            className="btnsave bg-brand"
                            onClick={confirmPayment}
                            disabled={!sellerReceipt && !documents["Buyer Payment Receipt"]}
                        >
                            Confirm Payment
                        </Button>
                    </Flex>
                </Col>

                {/* Upload Additional Docs */}
                {uploadDocs.map((item, index) => (
                    <Col span={24} key={index}>
                        <Text className="fw-600 fs-14">{item.title}</Text>
                        {documents[item.title] ? (
                            renderUploadedDoc(documents[item.title])
                        ) : (
                            <Upload
                                beforeUpload={(file) => handleSingleFileUpload(file, item.title)}
                                showUploadList={false}
                                accept=".pdf,.jpg,.png"
                            >
                                <Button icon={<UploadOutlined />}>Upload {item.title}</Button>
                            </Upload>
                        )}
                    </Col>
                ))}

                {/* Seller final confirmation */}
                <Col span={24}>
                    <Flex vertical gap={10}>
                        <Flex gap={5} className="badge-cs success fs-12 fit-content" align="center">
                            <CheckCircleOutlined className="fs-14" /> Seller marked "Payment Received"
                        </Flex>
                        <Flex>
                            <Button type="primary" className="btnsave bg-brand" onClick={handleMarkVerified}>
                                Mark as Verified
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
            </Row>
        </>
    )
}

export {DocumentPaymentConfirmation}