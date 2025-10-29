import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography,Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { SingleInprogressSteps } from "./SingleInprogressSteps";
import { GETDEAL } from "../../../graphql/query";
import { useQuery,useMutation } from "@apollo/client";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { UPDATE_DEAL} from '../../../graphql/mutation/mutations';

// Helper function to get status display from boolean flags
const getStatusDisplay = (deal) => {
    if (!deal) return "Pending";
    
    if (deal.status === 'CANCEL') return 'Canceled';
    
    if (deal.isBuyerCompleted && deal.isSellerCompleted) {
        return 'Completed';
    }
    
    if (deal.isPaymentVedifiedSeller) {
        return 'Document Confirmation Pending';
    }
    
    if (deal.isDsaSeller && deal.isDsaBuyer) {
        return 'Payment Confirmation Pending';
    }
    
    if (deal.isCommissionVerified) {
        if (!deal.isDsaSeller && !deal.isDsaBuyer) {
            return 'DSA Pending';
        } else if (!deal.isDsaSeller) {
            return 'DSA Seller Pending';
        } else if (!deal.isDsaBuyer) {
            return 'DSA Buyer Pending';
        }
    }
    
    if (!deal.isCommissionVerified) {
        return 'Commission Pending';
    }
    
    return 'Pending';
};

const { Title, Text } = Typography;
const BusinessDealsDetails = ({ completedeal }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, data } = useQuery(GETDEAL, {
    variables: { getDealId: id },
    skip: !id, // skip if no id
  });

  const details = data?.getDeal
    ? {
        key: data.getDeal.id, // use actual id from API
        businessTitle: data.getDeal.business?.businessTitle || "-",
        buyerName: data.getDeal.buyer?.name || "-",
        sellerId: data.getDeal.business?.seller?.id || "-",
        sellerName: data.getDeal.business?.seller?.name || "-",
        finalizedOffer: data.getDeal.offer?.price
          ? `SAR ${data.getDeal.offer.price.toLocaleString()}`
          : "-",
        status: data.getDeal.status || 0,
        date: data.getDeal.createdAt
          ? new Date(data.getDeal.createdAt).toLocaleDateString()
          : "-",
        busines: data.getDeal.business || "-",
        banks: data.getDeal.buyer?.banks || "-",
        isCommissionVerified: data.getDeal.isCommissionVerified,
        isDocVedifiedSeller: data.getDeal.isDocVedifiedSeller,
        isDocVedifiedAdmin: data.getDeal.isDocVedifiedAdmin,
        isPaymentVedifiedSeller: data.getDeal.isPaymentVedifiedSeller,
        isPaymentVedifiedAdmin: data.getDeal.isPaymentVedifiedAdmin,
        isDsaSeller: data.getDeal.isDsaSeller,
        isDsaBuyer: data.getDeal.isDsaBuyer,
        isSellerCompleted: data.getDeal.isSellerCompleted,
        isBuyerCompleted: data.getDeal.isBuyerCompleted,
        isDocVedifiedBuyer: data.getDeal.isDocVedifiedBuyer,
        ndaPdfPath: data.getDeal.ndaPdfPath,
      }
    : null;
  const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
      refetchQueries: [ { query: GETDEAL, variables: { getDealId: details?.key } } ],
      awaitRefetchQueries: true,
      onCompleted: (data) => {
        if (data?.updateDeal?.status === 'CANCEL') {
          messageApi.success(t("Deal cancelled successfully!"));
        } else {
          messageApi.success(t("Deal updated successfully!"));
        }
      },
      onError: (error) => {
        messageApi.error(error.message || t("Something went wrong!"));
      }
  });
  
  const buyerdealsData = [
    {
      title: "Seller Name",
      desc: details?.sellerName,
    },
    {
      title:"Buyer Name",
      desc: details?.buyerName,
    },
    {
      title: "Finalized Offer",
      desc: details?.finalizedOffer,
    },
    {
      title: "Status",
      desc: <Text>{t(getStatusDisplay(data?.getDeal))}</Text>
    },
  ];
  const handleMCancelDeal = async () => {
    if (!details?.key) return;
    await updateDeals({
        variables: { input: { id: details.key, status: 'CANCEL' } },
    });
  };

  if (loading) {
    return (
        <Flex justify="center" align="center" className='h-200'>
            <Spin size="large" />
        </Flex>
    );
}
  return (
    <>
    {contextHolder}
    <Flex vertical gap={20}>
      <Flex vertical gap={25}>
        <Breadcrumb
          separator={
            <Text className="text-gray">
              <RightOutlined className="fs-10" />
            </Text>
          }
          items={[
            {
              title: (
                <Text
                  className="fs-13 text-gray cursor"
                  onClick={() => navigate("/businessdeal")}
                >
                  {t("Business Deals")}
                </Text>
              ),
            },
            {
              title: (
                <Text className="fw-500 fs-13 text-black">
                  {details?.businessTitle}
                </Text>
              ),
            },
          ]}
        />
      </Flex>
      <Flex justify="space-between" align="center">
        <Flex gap={15} align="center">
          <Button
            aria-labelledby="Arrow left"
            className="border0 p-0 bg-transparent"
            onClick={() => navigate("/businessdeal")}
          >
            <ArrowLeftOutlined />
          </Button>
          <Title level={4} className="m-0">
            {details?.businessTitle}
          </Title>
        </Flex>
        <Button
          aria-labelledby="Cancel Deal"
          type="primary"
          className={`btnsave border0 text-white ${(data?.getDeal?.business?.isSold || details?.status === 'CANCEL') ? '' : 'bg-red'}`}
          disabled={data?.getDeal?.business?.isSold || details?.status === 'CANCEL'}
          onClick={handleMCancelDeal}
          loading={updating}
          style={(data?.getDeal?.business?.isSold || details?.status === 'CANCEL') ? {
            backgroundColor: '#d9d9d9',
            borderColor: '#d9d9d9',
            color: 'rgba(0, 0, 0, 0.25)',
            cursor: 'not-allowed',
          } : {}}
        >
          {t("Cancel Deal")}
        </Button>
      </Flex>
      <Card className="radius-12 border-gray">
        <Flex vertical gap={40}>
          <div className="deals-status">
            <Row gutter={[16, 16]}>
              {buyerdealsData?.map((list, index) => (
                <Col xs={24} sm={12} md={6} lg={6} key={index}>
                  <Flex vertical gap={3}>
                    <Text className="text-gray fs-14">{t(list?.title)}</Text>
                    {list?.title === "Status" ? (
                      list.desc === "In-progress" ? (
                        <Text className="brand-bg text-white fs-12 sm-pill">
                          {list?.desc}
                        </Text>
                      ) : (
                        <Text className="bg-green text-white fs-12 sm-pill">
                          {list?.desc}
                        </Text>
                      )
                    ) : (
                      <Text className="fs-12 fw-500">{list?.desc}</Text>
                    )}
                  </Flex>
                </Col>
              ))}
            </Row>
          </div>
          {details?.status === 'CANCEL' ? (
            <Flex vertical justify="center" align="center" gap={10} style={{ padding: '40px 20px', opacity: 0.6 }}>
              <Title level={4} className="m-0 text-red">
                {t("This deal has been cancelled")}
              </Title>
              <Text className="fs-14 text-gray text-center">
                {t("All activities for this deal have been stopped. No further actions can be taken.")}
              </Text>
            </Flex>
          ) : (
            <SingleInprogressSteps
              details={details}
              completedeal={completedeal}
            />
          )}
        </Flex>
      </Card>
    </Flex>
    </>
  );
};

export { BusinessDealsDetails };
