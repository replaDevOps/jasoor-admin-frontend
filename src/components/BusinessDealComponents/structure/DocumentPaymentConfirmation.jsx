import React, { useEffect } from 'react'
import { Button, Card, Col, Flex, Image, Row, Typography, message,Spin  } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { UPDATE_DEAL} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';
import { GETDEAL } from '../../../graphql/query';

const { Text } = Typography
const DocumentPaymentConfirmation = ({details}) => {

    const uploadDocs = [
        {
            title: "Updated Commercial Registration (CR)",
            ...details?.busines?.documents?.find(doc => doc.title === "Commercial Registration (CR)")
        },
        {
            title: "Notarized Ownership Transfer Letter",
            ...details?.busines?.documents?.find(doc => doc.title === "Notarized Ownership Transfer Letter")
        }
    ];
    const hasDocuments = uploadDocs.length > 0;
    const isPaymentVerified = details?.isPaymentVedifiedSeller
    console.log("uploadDocs",uploadDocs)
    return (
        <>
        {/* {contextHolder} */}
        <Row gutter={[16, 24]}>
          {!hasDocuments ? (
            <Col span={24}>
              <Flex justify="center" align="center" className="h-150">
                <Text className="fs-14 text-gray">Documents not uploaded by seller yet</Text>
              </Flex>
            </Col>
          ) : (
            uploadDocs.map((item, index) =>
              item?.filePath ? (
                <Col span={24} key={index}>
                  <Text className="fw-600 text-medium-gray fs-13">{item.title}</Text>
                  <Card className="card-cs border-gray rounded-12 mt-2">
                    <Flex justify="space-between" align="center">
                      <Flex gap={15}>
                        <Image
                          src={"/assets/icons/file.png"}
                          fetchPriority="high"
                          alt="file-image"
                          preview={false}
                          width={20}
                        />
                        <Flex vertical>
                          <Text className="fs-13 text-gray">{item?.title}</Text>
                          <Text className="fs-13 text-gray">5.3 MB</Text>
                        </Flex>
                      </Flex>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <Image
                          src={"/assets/icons/download.png"}
                          fetchPriority="high"
                          alt="download-icon"
                          preview={false}
                          width={20}
                        />
                      </a>
                    </Flex>
                  </Card>
                </Col>
              ) : null
            )
          )}
  
          {/* Seller final confirmation */}
          <Col span={24}>
            <Flex vertical gap={10}>
              <Flex
                gap={5}
                className={
                  isPaymentVerified
                    ? "badge-cs success fs-12 fit-content"
                    : "badge-cs pending fs-12 fit-content"
                }
                align="center"
              >
                <CheckCircleOutlined className="fs-14" />
                {isPaymentVerified
                  ? 'Seller marked "Payment Received"'
                  : '"Payment Received" Seller Confirmation pending'}
              </Flex>
            </Flex>
          </Col>
        </Row>
      </>
  
    )
}

export {DocumentPaymentConfirmation}