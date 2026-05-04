import React, { useState } from "react";
import { Button, Divider, Flex, Modal, Typography, message, Space } from "antd";
import { CloseOutlined, CheckOutlined, StopOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../../graphql/mutation";
import { USERS } from "../../../graphql/query/user";

const { Title, Text } = Typography;

const ViewIdentity = ({ visible, onClose, viewstate, onStatusChanged }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({
    url: "",
    type: "",
    title: "",
  });
  const [messageApi, contextHolder] = message.useMessage();

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    refetchQueries: [USERS],
    onCompleted: () => {
      if (onStatusChanged) onStatusChanged();
    },
    onError: (err) => {
      messageApi.error(err.message || t("Something went wrong!"));
    },
  });

  const handleApprove = async () => {
    if (!viewstate?.key) return;
    await updateUser({
      variables: { input: { id: viewstate.key, status: "verified" } },
    });
    messageApi.success(t("User verified successfully!"));
    onClose();
  };

  const handleReject = async () => {
    if (!viewstate?.key) return;
    await updateUser({
      variables: { input: { id: viewstate.key, status: "pending" } },
    });
    messageApi.success(t("User verification rejected."));
    onClose();
  };

  const handlePreview = (url, type, title) => {
    setPreviewData({ url, type, title });
    setPreviewOpen(true);
  };

  const isUnderReview = viewstate?.status === "under_review";
  const isVerified    = viewstate?.status === "verified";

  return (
    <>
      {contextHolder}
      <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        centered
        footer={null}
      >
        <div>
          <Flex justify="space-between" className="mb-3" gap={6}>
            <Title level={5} className="m-0">
              {t("View Passport & National Identity")}
            </Title>
            <Button
              aria-labelledby="Close"
              type="button"
              onClick={onClose}
              className="p-0 border-0 bg-transparent"
            >
              <CloseOutlined className="fs-18" />
            </Button>
          </Flex>

          {/* User info */}
          {viewstate && (
            <div style={{ marginBottom: 12 }}>
              <Text strong>{viewstate.fullname}</Text>
              {viewstate.status && (
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 12,
                    padding: "2px 8px",
                    borderRadius: 20,
                    fontWeight: 600,
                    background:
                      viewstate.status === "verified"
                        ? "#f0fdf4"
                        : viewstate.status === "under_review"
                        ? "#fffbeb"
                        : "#f9fafb",
                    color:
                      viewstate.status === "verified"
                        ? "#166534"
                        : viewstate.status === "under_review"
                        ? "#d97706"
                        : "#6b7280",
                  }}
                >
                  {viewstate.status === "verified"
                    ? t("Verified")
                    : viewstate.status === "under_review"
                    ? t("Under Review")
                    : t(viewstate.status)}
                </span>
              )}
            </div>
          )}

          <Flex gap={10} wrap>
            {viewstate?.documents?.map((doc, index) => {
              const fileUrl = doc?.filePath;
              const isPdf =
                typeof fileUrl === "string" && /\.pdf($|\?)/i.test(fileUrl);

              return (
                <div
                  key={`${fileUrl || "file"}-${index}`}
                  className="viewimg"
                  onClick={() =>
                    handlePreview(
                      fileUrl,
                      isPdf ? "pdf" : "image",
                      doc?.title || t("Preview")
                    )
                  }
                  style={{
                    width: 100,
                    height: 100,
                    cursor: "pointer",
                    backgroundColor: "#f7f7f7",
                    border: "1px solid #e5e5e5",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 6,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isPdf ? (
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 12,
                          marginBottom: 4,
                          color: "#6b7280",
                        }}
                      >
                        PDF
                      </div>
                      <Button size="small" type="primary">
                        {t("View")}
                      </Button>
                    </div>
                  ) : (
                    <img
                      src={fileUrl}
                      alt={doc?.title || "document preview"}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        backgroundColor: "#fff",
                        borderRadius: 4,
                      }}
                      onError={(e) => {
                        e.currentTarget.src = "";
                      }}
                    />
                  )}
                </div>
              );
            })}

            {(!viewstate?.documents || viewstate.documents.length === 0) && (
              <Text type="secondary">{t("No documents uploaded yet.")}</Text>
            )}
          </Flex>
        </div>

        <Divider className="my-3 bg-light-brand" />

        {/* Approve / Reject actions — shown for any non-verified user */}
        {viewstate && !isVerified && (
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={updating}
              onClick={handleApprove}
              style={{ background: "#008A66", borderColor: "#008A66" }}
            >
              {t("Approve")}
            </Button>
            <Button
              danger
              icon={<StopOutlined />}
              loading={updating}
              onClick={handleReject}
            >
              {t("Reject")}
            </Button>
          </Space>
        )}

        {isVerified && (
          <Space>
            <Button
              danger
              icon={<StopOutlined />}
              loading={updating}
              onClick={handleReject}
            >
              {t("Revoke Verification")}
            </Button>
          </Space>
        )}
      </Modal>

      <Modal
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={null}
        width={previewData.type === "pdf" ? "800" : 600}
        centered
        title={previewData.title}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
      >
        <div
          style={{
            background: "#f0f2f5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: previewData.type === "pdf" ? "75vh" : "auto",
            minHeight: "400px",
          }}
        >
          {previewData.type === "pdf" ? (
            <iframe
              src={previewData.url}
              width="100%"
              height="100%"
              style={{ border: "none", borderRadius: "4px" }}
              title="PDF Preview"
            />
          ) : (
            <div
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={previewData.url}
                style={{
                  maxWidth: "100%",
                  maxHeight: "75vh",
                  display: "block",
                }}
                alt="Preview"
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export { ViewIdentity };
