import {useState} from 'react'
import { Button, Card, Col, Flex, Image, Row, Typography, message,Spin  } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { UPDATE_DEAL,UPLOAD_DOCUMENT} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';

const { Text } = Typography
const DocumentPaymentConfirmation = ({details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [documents, setDocuments] = useState({});
    const uploadDocs = [
        {
            title: "Updated Commercial Registration (CR)",
            ...details?.busines?.documents?.find(doc => doc.title === "Updated Commercial Registration (CR)")
        },
        {
            title: "Notarized Ownership Transfer Letter",
            ...details?.busines?.documents?.find(doc => doc.title === "Notarized Ownership Transfer Letter")
        }
    ];
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
    
                const response = await fetch("https://verify.jusoor-sa.co/upload", {
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
                            // businessId:details?.busines?.id
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
                    status: "WAITING", 
                    isDocVedifiedAdmin: true, 
                },
            },
        });
    };
    if (updating || uploading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }

    const renderUploadedDoc = (doc) => (
        <Card className="card-cs border-gray rounded-12 mt-3">
            <Flex justify="space-between" align="center">
                <Flex gap={15}>
                    <Image src={"/assets/icons/file.png"}  alt='file-image' preview={false} width={20} />
                    <Flex vertical>
                        <Text className="fs-13 text-gray">{doc?.fileName}</Text>
                        <Text className="fs-13 text-gray">{doc?.fileSize}</Text>
                    </Flex>
                </Flex>
                <a href={doc?.filePath} target="_blank" rel="noopener noreferrer">
                    <Image src={"/assets/icons/download.png"} fetchPriority="high" alt='download-icon' preview={false} width={20} />
                </a>
            </Flex>
        </Card>
    );

    return (
        <>
            {contextHolder}
            <Row gutter={[16, 24]}>
                {uploadDocs.map((item, index) => (
                    <Col span={24} key={index}>
                        <Text className="fw-600 text-medium-gray fs-13">{item.title}</Text>
                        <Card className="card-cs border-gray rounded-12 mt-2">
                            <Flex justify="space-between" align="center">
                                <Flex gap={15}>
                                    <Image src={"/assets/icons/file.png"} fetchPriority="high" alt='file-image' preview={false} width={20} />
                                    <Flex vertical>
                                        <Text className="fs-13 text-gray">{item?.title}</Text>
                                        <Text className="fs-13 text-gray">5.3 MB</Text>
                                    </Flex>
                                </Flex>
                                <a href={''} target="_blank" rel="noopener noreferrer">
                                    <Image src={"/assets/icons/download.png"} fetchPriority="high" alt='download-icon' preview={false} width={20} />
                                </a>
                            </Flex>
                        </Card>
                    </Col>
                ))}

                {/* Seller final confirmation */}
                <Col span={24}>
                    <Flex vertical gap={10}>
                        {/* Dynamic Badge */}
                        <Flex
                            gap={5}
                            className={details?.isDocVedifiedSeller ? "badge-cs success fs-12 fit-content" : "badge-cs pending fs-12 fit-content"}
                            align="center"
                        >
                        <CheckCircleOutlined className="fs-14" />
                            {details?.isDocVedifiedSeller
                                ? 'Seller marked "Payment Received"'
                                : '"Payment Received" Seller Confirmation pending'}
                        </Flex>

                        {/* Single Button */}
                        <Flex>
                            <Button
                                type="primary"
                                className="btnsave bg-brand"
                                onClick={handleMarkVerified}
                                disabled={!details?.isPaymentVerifiedSeller} // disable if already verified
                                aria-labelledby='Mark as Verified'
                            >
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