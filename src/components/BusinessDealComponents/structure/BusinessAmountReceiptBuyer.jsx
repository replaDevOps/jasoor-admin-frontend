import React,{useState} from 'react'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card,  Col, Flex, Image, Row, Typography,Upload } from 'antd'
import { UPDATE_DEAL,UPLOAD_DOCUMENT} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { message,Spin } from "antd";

const { Text } = Typography
const BusinessAmountReceiptBuyer = ({details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [documents, setDocuments] = useState({});
    
    // const paymentReceipt = details?.busines?.documents?.find(doc => doc.title === 'Buyer Payment Receipt');
    const sellerReceipt = details?.busines?.documents?.find(doc => doc.title === 'Buyer Payment Receipt');
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
                    status: "PAYMENT_APPROVAL_FROM_SELLER_PENDING", // Example status
                },
            },
        });
    };
    const renderUploadedDoc = ({ fileName, fileSize, filePath }) => (
        <Flex vertical gap={6}>
            <Text className="fw-600 text-medium-gray fs-13">Upload transaction receipt or screenshot</Text>
            <Card className="card-cs border-gray rounded-12">
                <Flex justify="space-between" align="center">
                    <Flex gap={15}>
                        <Image src={'/assets/icons/file.png'} preview={false} width={20} />
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
                        <Image src={"/assets/icons/download.png"} preview={false} width={20} />
                    </a>
                    )}
                </Flex>
            </Card>
        </Flex>
    );
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
                    {/* If receipt already exists, show it */}
                    {
                        sellerReceipt && (
                        renderUploadedDoc({
                            fileName: sellerReceipt?.title,
                            fileSize: "5.3 MB",
                            filePath: sellerReceipt?.filePath,
                        })
                    )}
                    {/* : (
                         <Upload
                    //         beforeUpload={(file) => handleSingleFileUpload(file, "Buyer Payment Receipt")}
                    //         showUploadList={false}
                    //         accept=".pdf,.jpg,.png"
                    //     >
                    //         <Button icon={<UploadOutlined />}>Upload Buyer Payment Receipt</Button>
                    //     </Upload>
                    // )} */}
                    {/* <Flex className="mt-3">
                        <Button
                            type="primary"
                            className="btnsave bg-brand"
                            onClick={confirmPayment}
                            disabled={!sellerReceipt || !documents["Buyer Payment Receipt"]}
                        >
                            Confirm Payment
                        </Button>
                    </Flex> */}
                </Col>
                

                <Col span={24}>
                    <Flex>
                        <Button
                            type="primary"
                            className="btnsave bg-brand"
                            onClick={handleMarkVerified}
                            disabled={!documents && !paymentReceipt}
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