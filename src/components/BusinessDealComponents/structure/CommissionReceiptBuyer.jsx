import {
  Button,
  Card,
  Col,
  Flex,
  Image,
  Row,
  Typography,
  message,
  Spin,
} from "antd";
import { UPDATE_DEAL } from "../../../graphql/mutation/mutations";
import { useMutation } from "@apollo/client";
import { GETDEAL } from "../../../graphql/query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const CommissionReceiptBuyer = ({ details }) => {
  const { t } = useTranslation();
  // Payment proofs are uploaded by the buyer as deal-level documents with type PAYMENT_PROOF.
  // Fall back to scanning business documents by title for backwards compatibility.
  const paymentProofs = (details?.documents || []).filter(
    (doc) => doc.type === "PAYMENT_PROOF"
  );
  const legacyDoc = (details?.busines?.documents || []).find(
    (doc) =>
      doc.title === "Jasoor Commission" ||
      doc.title === "جسور العمولة" ||
      doc.title === "عمولة جسور"
  );
  const hasProof = paymentProofs.length > 0 || !!legacyDoc;
  const [messageApi, contextHolder] = message.useMessage();
  const [updateDeals, { loading: updating, data, error }] = useMutation(
    UPDATE_DEAL,
    {
      refetchQueries: [
        { query: GETDEAL, variables: { getDealId: details?.key } },
      ],
      awaitRefetchQueries: true,
    }
  );
  useEffect(() => {
    if (data?.updateDeal?.id) {
      messageApi.success(t("Commission verified successfully!"));
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
      variables: { input: { id: details.key, isCommissionVerified: true } },
    });
  };

  const renderUploadedDoc = ({ fileName, fileSize, filePath }) => (
    <Flex vertical gap={2} className="uploaded-doc">
      <Card className="card-cs border-gray rounded-12">
        <Flex justify="space-between" align="center">
          <Flex gap={15}>
            <Image
              src={"/assets/icons/file.png"}
              alt="file-image"
              fetchPriority="high"
              preview={false}
              width={20}
            />
            <Flex vertical>
              <Text className="fs-13 text-gray">{fileName}</Text>
              <Text className="fs-13 text-gray">{fileSize}</Text>
            </Flex>
          </Flex>
          {filePath && (
            <a href={filePath} target="_blank" rel="noopener noreferrer">
              <Image
                src={"/assets/icons/download.png"}
                fetchPriority="high"
                alt="download-icon"
                preview={false}
                width={20}
              />
            </a>
          )}
        </Flex>
      </Card>
    </Flex>
  );

  if (updating) {
    return (
      <Flex justify="center" align="center" className="h-200">
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
              {t("Jusoor's Commission bank statement or screenshot")}
            </Text>
            {paymentProofs.length > 0
              ? paymentProofs.map((doc) => (
                  <div key={doc.id}>
                    {renderUploadedDoc({
                      fileName: doc.title || t("Payment Proof"),
                      filePath: doc.filePath,
                    })}
                  </div>
                ))
              : legacyDoc &&
                renderUploadedDoc({
                  fileName: legacyDoc.title,
                  filePath: legacyDoc.filePath,
                })}
            {!hasProof && (
              <Text className="fs-13 text-gray">{t("No proof uploaded yet")}</Text>
            )}
          </Flex>
        </Col>
        <Col span={24}>
          <Flex>
            <Button
              type="primary"
              className="btnsave bg-brand"
              onClick={handleMarkVerified}
              aria-labelledby="Mark as Verified"
              disabled={!(hasProof && !details?.isCommissionVerified)}
            >
              {t("Mark as Verified")}
            </Button>
          </Flex>
        </Col>
      </Row>
    </>
  );
};
export { CommissionReceiptBuyer };
