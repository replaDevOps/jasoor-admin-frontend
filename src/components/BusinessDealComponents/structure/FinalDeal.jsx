import { Button, Col, Flex, Row, Typography, message } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { UPDATE_DEAL,UPDATE_BUSINESS} from '../../../graphql/mutation/mutations';
import { useMutation } from '@apollo/client';

const { Text } = Typography
const FinalDeal = ({details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
        onCompleted: () => {
            messageApi.success("Deal Closed successfully!");
        },
        onError: (err) => {
            messageApi.error(err.message || "Something went wrong!");
        },
    });
    const [updateBusiness, { loading }] = useMutation(UPDATE_BUSINESS, {
      onCompleted: () => {
          messageApi.success("Business Sold!");
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
                    status: "COMPLETED", 
                },
            },
        });
        await updateBusiness({
          variables: {
              input: {
                  id: details?.busines?.id,
                  isSold: true, 
              },
          },
      });
    };

  const isFinal = details.status === 'PENDING'
  const isCompleted = details.status === 'COMPLETED'

  return (
    <>
      {contextHolder}
      <Row gutter={[16, 16]}>
          
          <Col span={24}>
              <Flex vertical gap={10}>
              <Col span={24}>
              <Flex vertical gap={10}>
              <Col span={24}>
              <Flex vertical gap={10}>
                {isFinal ||isCompleted ? (
                  <>
                    <Flex gap={5} className="badge-cs success fs-12 fit-content" align="center">
                      <CheckCircleOutlined className="fs-14" /> Buyer marked the deal as "Finalized"
                    </Flex>
                    <Flex gap={5} className="badge-cs success fs-12 fit-content" align="center">
                      <CheckCircleOutlined className="fs-14" /> Seller marked the deal as "Finalized"
                    </Flex>
                  </>
                ) : (
                  <>
                    {details.isDocVedifiedBuyer && (
                        <>
                      <Flex gap={5} className="badge-cs success fs-12 fit-content" align="center">
                        <CheckCircleOutlined className="fs-14" /> Buyer marked the deal as "Finalized"
                      </Flex>
                      <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                          <CheckCircleOutlined className="fs-14" /> Waiting for seller to mark the deal as "Finalized"
                        </Flex>
                      </>
                    )}
                    {details.isDocVedifiedSeller && (
                        <>
                      <Flex gap={5} className="badge-cs success fs-12 fit-content" align="center">
                        <CheckCircleOutlined className="fs-14" /> Seller marked the deal as "Finalized"
                      </Flex>
                        <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                          <CheckCircleOutlined className="fs-14" /> Waiting for buyer to mark the deal as "Finalized"
                        </Flex>
                      </>
                    )}
                    {!details.isDocVedifiedBuyer && !details.isDocVedifiedSeller && (
                      <>
                        <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                          <CheckCircleOutlined className="fs-14" /> Waiting for buyer to mark the deal as "Finalized"
                        </Flex>
                        <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                          <CheckCircleOutlined className="fs-14" /> Waiting for seller to mark the deal as "Finalized"
                        </Flex>
                      </>
                    )}
                  </>
                )}
              </Flex>
            </Col>

              </Flex>
            </Col>
                <Flex>
                    <Button
                        type="primary"
                        className="btnsave bg-brand"
                        disabled={isCompleted}
                        onClick={handleMarkVerified}
                        aria-labelledby='Mark Deal as Completed'
                    >
                        Mark Deal as Completed
                    </Button>
                </Flex>
              </Flex>
          </Col>
      </Row>
    </>
  )
}

export {FinalDeal}