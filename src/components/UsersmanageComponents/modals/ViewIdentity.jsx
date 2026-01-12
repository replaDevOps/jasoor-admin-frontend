import React, { useState } from "react";
import { Button, Divider, Flex, Modal, Typography } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { t } from "i18next";

const { Title } = Typography;
const ViewIdentity = ({ visible, onClose, viewstate }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState({
    url: "",
    type: "",
    title: "",
  });

  const handlePreview = (url, type, title) => {
    setPreviewData({ url, type, title });
    setPreviewOpen(true);
  };

  return (
    <>
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
          </Flex>
        </div>
        <Divider className="my-2 bg-light-brand" />
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
