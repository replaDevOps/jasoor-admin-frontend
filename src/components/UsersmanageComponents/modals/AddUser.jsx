import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  Upload,
  message,
} from "antd";
import { MyInput, MySelect } from "../../Forms";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_STAFF_MEMBER } from "../../../graphql/mutation/login";
import { UPDATE_USER } from "../../../graphql/mutation";
import imageCompression from "browser-image-compression";
import { t } from "i18next";
import { USERS, GETCUSTOMERROLE } from "../../../graphql/query";
import { useDistricts, useCities } from "../../../shared";

const { Title } = Typography;
const AddUser = ({ visible, onClose, edititem }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const districts = useDistricts();
  const cities = useCities();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [idType, setIdType] = useState("national_id");
  const [frontFileName, setFrontFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [passportFileName, setPassportFileName] = useState("");
  const [, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploadErrors, setUploadErrors] = useState({
    front: "",
    back: "",
    passport: "",
  });

  // Fetch customer roles
  const [getRoles, { data: rolesData }] = useLazyQuery(GETCUSTOMERROLE, {
    fetchPolicy: "cache-first",
  });

  const [createStaff, { loading: userLoading }] = useMutation(
    CREATE_STAFF_MEMBER,
    {
      refetchQueries: [USERS],
    }
  );
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    refetchQueries: [USERS],
  });

  // Fetch roles when modal opens
  useEffect(() => {
    if (visible) {
      getRoles();
    }
  }, [visible, getRoles]);
  // Helper function to reset all form data
  const resetFormData = () => {
    form.resetFields();
    setSelectedDistrict(null);
    setIdType("national_id");
    setFrontFileName("");
    setBackFileName("");
    setPassportFileName("");
    setDocuments([]);
    setUploadErrors({ front: "", back: "", passport: "" });
  };

  // Handle modal close
  const handleClose = () => {
    resetFormData();
    onClose();
  };

  // Reset form and state when modal opens/closes
  useEffect(() => {
    if (visible && edititem) {
      // Edit mode - populate form with existing data
      form.setFieldsValue({
        id: edititem.key,
        fullName: edititem?.fullname,
        email: edititem?.email,
        district: edititem?.district,
        city: edititem?.city,
        phoneNo: edititem?.mobileno,
      });
      // Set selectedDistrict to enable city dropdown in edit mode
      setSelectedDistrict(edititem?.district);

      // Populate document states if documents exist
      if (edititem?.documents && edititem.documents.length > 0) {
        setDocuments(edititem.documents);

        // Check if documents contain National ID or Passport
        const hasFront = edititem.documents.some(
          (doc) => doc.title === "front"
        );
        const hasBack = edititem.documents.some((doc) => doc.title === "back");
        const hasPassport = edititem.documents.some(
          (doc) => doc.title === "passport"
        );

        if (hasPassport) {
          setIdType("passport");
          const passportDoc = edititem.documents.find(
            (doc) => doc.title === "passport"
          );
          setPassportFileName(passportDoc?.fileName || t("Passport uploaded"));
        } else if (hasFront || hasBack) {
          setIdType("national_id");
          if (hasFront) {
            const frontDoc = edititem.documents.find(
              (doc) => doc.title === "front"
            );
            setFrontFileName(frontDoc?.fileName || t("Front side uploaded"));
          }
          if (hasBack) {
            const backDoc = edititem.documents.find(
              (doc) => doc.title === "back"
            );
            setBackFileName(backDoc?.fileName || t("Back side uploaded"));
          }
        }
      }
    } else if (visible && !edititem) {
      // Add mode - reset everything
      form.resetFields();
      setSelectedDistrict(null);
      setIdType("national_id");
      setFrontFileName("");
      setBackFileName("");
      setPassportFileName("");
      setDocuments([]);
    } else if (!visible) {
      // Modal closed - reset everything
      form.resetFields();
      setSelectedDistrict(null);
      setIdType("national_id");
      setFrontFileName("");
      setBackFileName("");
      setPassportFileName("");
      setDocuments([]);
    }
  }, [visible, edititem, form]);

  const onFinish = async () => {
    try {
      const formData = form.getFieldsValue(true);

      if (!edititem) {
        if (documents.length === 0) {
          if (idType === "national_id") {
            setUploadErrors({
              front: t("Front side is required"),
              back: t("Back side is required"),
              passport: "",
            });
          } else {
            setUploadErrors({
              front: "",
              back: "",
              passport: t("Passport is required"),
            });
          }
          messageApi.error(
            t("Please upload required documents (National ID or Passport)")
          );
          return;
        }

        // Check if proper documents are uploaded based on ID type
        if (idType === "national_id") {
          const hasFront = documents.some((doc) => doc.title === "front");
          const hasBack = documents.some((doc) => doc.title === "back");

          const errors = {
            front: hasFront ? "" : t("Front side is required"),
            back: hasBack ? "" : t("Back side is required"),
            passport: "",
          };
          setUploadErrors(errors);

          if (!hasFront || !hasBack) {
            messageApi.error(
              t("Please upload both front and back side of National ID")
            );
            return;
          }
        } else if (idType === "passport") {
          const hasPassport = documents.some((doc) => doc.title === "passport");

          const errors = {
            front: "",
            back: "",
            passport: hasPassport ? "" : t("Passport is required"),
          };
          setUploadErrors(errors);

          if (!hasPassport) {
            messageApi.error(t("Please upload passport document"));
            return;
          }
        }
      }

      // Clear upload errors if validation passed
      setUploadErrors({ front: "", back: "", passport: "" });

      // Clean documents array - remove __typename from GraphQL
      const cleanDocuments =
        documents.length > 0
          ? documents.map(({ __typename, ...doc }) => doc) // eslint-disable-line no-unused-vars
          : undefined;

      const basePayload = {
        name: formData.fullName,
        district: formData.district,
        city: formData.city,
        phone: formData.phoneNo,
        roleId: rolesData?.getCustomerRole?.id,
        password:
          formData.password && String(formData.password).trim().length > 0
            ? formData.password
            : undefined,
        documents: cleanDocuments,
      };

      if (edititem) {
        // Update existing user
        const input = { id: edititem.key, ...basePayload };
        await updateUser({ variables: { input } });
        messageApi.success(t("User account updated successfully!"));
      } else {
        // Create new staff member - include email
        const input = {
          ...basePayload,
          email: formData.email.toLowerCase(),
        };
        await createStaff({ variables: { input } });
        messageApi.success(t("User account created successfully!"));
      }

      // Reset form and close modal on success
      resetFormData();
      onClose();
    } catch (error) {
      messageApi.error(
        error?.message || t("Failed to save user. Please try again.")
      );
    }
  };

  const handleUpload = async ({ file, title }) => {
    try {
      setLoading(true);

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        messageApi.error(
          t("Invalid file type. Please upload JPG, PNG, or PDF only.")
        );
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        messageApi.error(t("File size too large. Maximum size is 5MB."));
        return;
      }

      let compressedFile = file;
      if (file.type.startsWith("image/")) {
        compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      }
      const formData = new FormData();
      formData.append("file", compressedFile);

      // Call your upload API
      const res = await fetch("https://verify.jusoor-sa.co/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      // Update documents state
      setDocuments((prevDocs) => {
        const filtered = prevDocs.filter((doc) => doc.title !== title);

        const existingDoc = prevDocs.find((doc) => doc.title === title);

        return [
          ...filtered,
          {
            ...(existingDoc?.id && { id: existingDoc.id }),
            title: title,
            fileName: data.fileName,
            filePath: data.fileUrl,
            fileType: data.fileType,
          },
        ];
      });

      if (title === "front") setFrontFileName(data.fileName);
      else if (title === "back") setBackFileName(data.fileName);
      else if (title === "passport") setPassportFileName(data.fileName);

      // Clear error for this field
      setUploadErrors((prev) => ({ ...prev, [title]: "" }));

      messageApi.success(t("File uploaded successfully"));
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to upload file. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={null}
        open={visible}
        onCancel={handleClose}
        closeIcon={false}
        centered
        footer={
          <Flex justify="end" gap={5}>
            <Button
              aria-labelledby="Cancel"
              type="button"
              onClick={handleClose}
              className="btncancel text-black border-gray"
            >
              {t("Cancel")}
            </Button>
            <Button
              aria-labelledby="submit button"
              className={`btnsave border0 text-white brand-bg`}
              onClick={() => form.submit()}
              loading={userLoading || updating}
            >
              {edititem ? t("Update") : t("Save")}
            </Button>
          </Flex>
        }
        width={600}
      >
        <div>
          <Flex justify="space-between" className="mb-3" gap={6}>
            <Title level={5} className="m-0">
              {edititem ? t("Update user") : t("Add new user")}
            </Title>
            <Button
              aria-labelledby="Close"
              type="button"
              onClick={handleClose}
              className="p-0 border-0 bg-transparent"
            >
              <CloseOutlined className="fs-18" />
            </Button>
          </Flex>
          <Form
            layout="vertical"
            form={form}
            requiredMark={false}
            onFinish={onFinish}
          >
            <Row>
              <Col span={24}>
                <MyInput
                  label={t("Full Name")}
                  name="fullName"
                  required
                  message={t("Please enter your full name")}
                  placeholder={t("Enter full name")}
                />
              </Col>
              <Col span={24}>
                <MyInput
                  label={t("Email Address")}
                  name="email"
                  required
                  message={t("Please enter your email address")}
                  placeholder={t("Enter email address")}
                  disabled={!!edititem}
                />
              </Col>
              <Col span={24}>
                <MySelect
                  label={t("Region")}
                  name="district"
                  required
                  message={t("Please select region")}
                  placeholder={t("Select region")}
                  options={districts}
                  onChange={(val) => {
                    setSelectedDistrict(val);
                    form.setFieldsValue({ city: undefined });
                  }}
                />
              </Col>
              <Col span={24}>
                <MySelect
                  label={t("City")}
                  name="city"
                  required
                  message={t("Please select city")}
                  options={
                    selectedDistrict
                      ? cities[selectedDistrict.toLowerCase()] || []
                      : []
                  }
                  placeholder={t("Select city")}
                  disabled={!selectedDistrict}
                />
              </Col>
              <Col span={24}>
                <MyInput
                  name="phoneNo"
                  label={t("Mobile Number")}
                  required
                  message={t("Please enter a valid phone number")}
                  addonBefore={
                    <Select
                      defaultValue={t("SA")}
                      className="w-80"
                      onChange={(value) =>
                        form.setFieldsValue({ countryCode: value })
                      }
                    >
                      <Select.Option value="sa">{t("SA")}</Select.Option>
                      <Select.Option value="ae">{t("AE")}</Select.Option>
                    </Select>
                  }
                  placeholder="3445592382"
                  value={form.getFieldValue("phoneNo") || ""}
                  className="w-100"
                  validator={{
                    pattern: /^[0-9\u0660-\u0669]{8,15}$/,
                    message: t(
                      "Please enter a valid phone number (8–15 digits, Arabic or English)"
                    ),
                  }}
                />
              </Col>
              <Col span={24}>
                <Row gutter={8}>
                  <Col span={24}>
                    <Form.Item
                      label={t("Upload National ID or Passport")}
                      className="m-0"
                      required
                    >
                      <Radio.Group
                        value={idType}
                        onChange={(e) => {
                          setIdType(e.target.value);
                          // Clear file names and documents when switching ID type
                          setFrontFileName("");
                          setBackFileName("");
                          setPassportFileName("");
                          setDocuments([]);
                          setUploadErrors({
                            front: "",
                            back: "",
                            passport: "",
                          });
                        }}
                      >
                        <Space>
                          <Radio value="national_id">{t("National ID")}</Radio>
                          <Radio value="passport">{t("Passport")}</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  {idType === "national_id" ? (
                    <>
                      <Col span={24}>
                        <Form.Item
                          validateStatus={uploadErrors.front ? "error" : ""}
                          help={uploadErrors.front}
                          className="m-0"
                        >
                          <Row gutter={8}>
                            <Col flex="auto">
                              <MyInput
                                withoutForm
                                size={"large"}
                                className="m-0"
                                placeholder={t("Upload Front Side")}
                                readOnly
                                value={frontFileName}
                              />
                            </Col>
                            <Col>
                              <Upload
                                beforeUpload={() => false}
                                showUploadList={false}
                                maxCount={1}
                                onChange={(info) =>
                                  handleUpload({
                                    file: info.file,
                                    title: "front",
                                  })
                                }
                              >
                                <Button
                                  aria-labelledby="Upload"
                                  className="btncancel pad-x bg-gray-2 text-black border-gray"
                                >
                                  {t("Upload")}
                                </Button>
                              </Upload>
                            </Col>
                          </Row>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          validateStatus={uploadErrors.back ? "error" : ""}
                          help={uploadErrors.back}
                          className="m-0"
                        >
                          <Row gutter={8}>
                            <Col flex="auto">
                              <MyInput
                                withoutForm
                                size={"large"}
                                className="m-0"
                                placeholder={t("Upload Back Side")}
                                readOnly
                                value={backFileName}
                              />
                            </Col>
                            <Col>
                              <Upload
                                beforeUpload={() => false}
                                showUploadList={false}
                                maxCount={1}
                                onChange={(info) =>
                                  handleUpload({
                                    file: info.file,
                                    title: "back",
                                  })
                                }
                              >
                                <Button
                                  aria-labelledby="Upload"
                                  className="btncancel pad-x bg-gray-2 text-black border-gray"
                                >
                                  {t("Upload")}
                                </Button>
                              </Upload>
                            </Col>
                          </Row>
                        </Form.Item>
                      </Col>
                    </>
                  ) : (
                    <Col span={24}>
                      <Form.Item
                        validateStatus={uploadErrors.passport ? "error" : ""}
                        help={uploadErrors.passport}
                        className="m-0"
                      >
                        <Row gutter={8}>
                          <Col flex="auto">
                            <MyInput
                              withoutForm
                              size={"large"}
                              className="m-0"
                              placeholder={t("Upload Passport")}
                              readOnly
                              value={passportFileName}
                            />
                          </Col>
                          <Col>
                            <Upload
                              beforeUpload={() => false}
                              showUploadList={false}
                              maxCount={1}
                              onChange={(info) =>
                                handleUpload({
                                  file: info.file,
                                  title: "passport",
                                })
                              }
                            >
                              <Button
                                aria-labelledby="Upload"
                                className="btncancel pad-x bg-gray-2 text-black border-gray"
                              >
                                {t("Upload")}
                              </Button>
                            </Upload>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col span={24}>
                <MyInput
                  label={t("Password")}
                  type="password"
                  name="password"
                  size="large"
                  className="fs-14"
                  placeholder={t("Enter password")}
                  rules={
                    edititem
                      ? [
                          {
                            validator: (_, value) => {
                              if (!value || value.trim() === "") {
                                return Promise.resolve();
                              }

                              if (value.length < 8) {
                                return Promise.reject(
                                  new Error(
                                    t("Password must be at least 8 characters")
                                  )
                                );
                              }

                              const pattern =
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/;
                              if (!pattern.test(value)) {
                                return Promise.reject(
                                  new Error(
                                    t(
                                      "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character"
                                    )
                                  )
                                );
                              }

                              return Promise.resolve();
                            },
                          },
                        ]
                      : [
                          {
                            required: true,
                            message: t("Please enter password"),
                          },
                          {
                            min: 8,
                            message: t(
                              "Password must be at least 8 characters"
                            ),
                          },
                          {
                            pattern:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
                            message: t(
                              "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character"
                            ),
                          },
                        ]
                  }
                />
              </Col>
              <Col span={24}>
                <MyInput
                  label={t("Re-Type Password")}
                  type="password"
                  name="confirmationPassword"
                  size="large"
                  dependencies={["password"]}
                  className="fs-14"
                  placeholder={t("Enter confirm password")}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const password = getFieldValue("password");

                        // In edit mode, if no password is entered, confirmation is optional
                        if (edititem && (!password || password.trim() === "")) {
                          return Promise.resolve();
                        }

                        // If password is provided in any mode
                        if (password && password.trim() !== "") {
                          if (!value || value.trim() === "") {
                            return Promise.reject(
                              new Error(t("Please confirm your password"))
                            );
                          }

                          if (password !== value) {
                            return Promise.reject(
                              new Error(t("The two passwords do not match!"))
                            );
                          }
                        }

                        // In add mode, password is required
                        if (
                          !edititem &&
                          (!password || password.trim() === "")
                        ) {
                          return Promise.reject(
                            new Error(t("Please confirm your password"))
                          );
                        }

                        return Promise.resolve();
                      },
                    }),
                  ]}
                />
              </Col>
            </Row>
          </Form>
        </div>
        <Divider className="my-2 bg-light-brand" />
      </Modal>
    </>
  );
};

export { AddUser };
