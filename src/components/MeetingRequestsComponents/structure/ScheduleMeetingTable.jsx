import {
  Button,
  Col,
  Dropdown,
  Flex,
  Form,
  Row,
  Table,
  Typography,
  Modal,
  Input,
  message,
} from "antd";
import { NavLink } from "react-router-dom";
import { MySelect, SearchInput } from "../../Forms";
import { useState, useEffect, useMemo } from "react";
import { meetingItems } from "../../../shared";
import { CustomPagination, TableLoader, DeleteModal } from "../../Ui";
import { RescheduleMeeting } from "../modal";
import {
  UPDATE_BUSINESS_MEETING,
  UPDATE_OFFER,
  CREATE_OFFER,
} from "../../../graphql/mutation";
import { GETADMINSCHEDULEMEETINGS } from "../../../graphql/query/meeting";
import { IS_BUSINESS_IN_DEAL_PROCESS } from "../../../graphql/query/business";
import { useLazyQuery, useMutation } from "@apollo/client";
import { t } from "i18next";

const { Text } = Typography;
function calculateCommission(price) {
  let commission = 0;

  // Bracket 1: 0 - 100K → 4%
  if (price > 0) {
    commission += Math.min(price, 100000) * 0.04;
  }

  // Bracket 2: 100K - 500K → 3%
  if (price > 100000) {
    commission += Math.min(price - 100000, 400000) * 0.03;
  }

  // Bracket 3: 500K - 2M → 2.5%
  if (price > 500000) {
    commission += Math.min(price - 500000, 1500000) * 0.025;
  }

  // Bracket 4: 2M+ → 1.5%
  if (price > 2000000) {
    commission += (price - 2000000) * 0.015;
  }

  // Minimum commission rule
  if (price < 50000 && commission < 2000) {
    commission = 2000;
  }

  return commission;
}

const ScheduleMeetingTable = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [visible, setVisible] = useState(false);
  const [rescheduleVisible, setRescheduleVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const [updateMeeting, { loading: updating }] = useMutation(
    UPDATE_BUSINESS_MEETING
  );
  const [updateOffer, { loading: onUpdating }] = useMutation(UPDATE_OFFER);
  const [createOffer] = useMutation(CREATE_OFFER);
  const [openDropdownRowId, setOpenDropdownRowId] = useState(null);
  const [disabledActionBusinessIds, setDisabledActionBusinessIds] = useState(
    new Set()
  );

  const schedulemeetingColumn = (setVisible) => [
    {
      title: t("Business Title"),
      dataIndex: "businessTitle",
    },
    {
      title: t("Buyer Name"),
      dataIndex: "buyerName",
    },
    {
      title: t("Email"),
      dataIndex: "email",
    },
    {
      title: t("Phone Number"),
      dataIndex: "phoneNumber",
    },
    {
      title: t("Seller Name"),
      dataIndex: "sellerName",
    },
    {
      title: t("Email"),
      dataIndex: "sellerEmail",
    },
    {
      title: t("Phone Number"),
      dataIndex: "sellerPhoneNumber",
    },
    {
      title: t("Schedule Date & Time"),
      dataIndex: "scheduleDateTime",
    },
    {
      title: t("Business Price"),
      dataIndex: "businessPrice",
      render: (_, row) => {
        const price = row?.businessPrice;

        return price != null && price !== "" ? (
          <Flex gap={5} align="center">
            <img
              src="/assets/icons/reyal.webp"
              width={16}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />
            <Text>{price}</Text>
          </Flex>
        ) : (
          <Text>-</Text>
        );
      },
    },
    {
      title: t("Offer Price"),
      dataIndex: "offerPrice",
      render: (_, row) => {
        const price = row?.offerPrice;

        return price != null && price !== "" ? (
          <Flex gap={5} align="center">
            <img
              src="/assets/icons/reyal.webp"
              width={16}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />
            <Text>{price}</Text>
          </Flex>
        ) : (
          <Text>-</Text>
        );
      },
    },
    {
      title: t("Meet Link"),
      dataIndex: "meetLink",
      render: (meetLink) => <NavLink to={meetLink}>{meetLink}</NavLink>,
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        if (status === "APPROVED") {
          return <Text className="btnpill fs-12 pending">{t("Pending")}</Text>;
        } else if (status === "HELD") {
          return <Text className="btnpill fs-12 success">{t("Held")}</Text>;
        } else if (status === "CANCELED") {
          return (
            <Text className="btnpill fs-12 inactive">{t("Cancelled")}</Text>
          );
        }
        return <Text className="btnpill fs-12 inactive">{status || "-"}</Text>;
      },
    },
    {
      title: t("Action"),
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, row) => (
        <Dropdown
          menu={{
            items: [
              {
                label: t("Open Deal"),
                key: "1",
                disabled: disabledActionBusinessIds.has(row.businessId),
                onClick: () => {
                  if (disabledActionBusinessIds.has(row.businessId)) {
                    messageApi.warning(
                      t("Deal already opened for this business.")
                    );
                    return;
                  }
                  setVisible(true);
                  setSelectedOffer({
                    id: row.offerId,
                    price: row.offerPrice,
                    commission: row.offerCommission,
                    meetingId: row.key,
                    businessId: row.businessId,
                  });
                },
              },
              {
                label: t("Reschedule Meeting"),
                key: "4",
                disabled:
                  row.status === "HELD" ||
                  row.status === "CANCELED" ||
                  row.status === "RESCHEDULED",
                onClick: () => {
                  if (row.status === "HELD") {
                    messageApi.warning(t("Cannot reschedule a held meeting."));
                    return;
                  }
                  if (row.status === "CANCELED") {
                    messageApi.warning(
                      t("Cannot reschedule a cancelled meeting.")
                    );
                    return;
                  }
                  if (row.status === "RESCHEDULED") {
                    messageApi.warning(t("Meeting is already rescheduled."));
                    return;
                  }
                  setSelectedMeetingId(row.key);
                  setRescheduleVisible(true);
                },
              },
              {
                label: t("Cancel"),
                key: "3",
                disabled: row.status === "HELD" || row.status === "CANCELED",
                onClick: () => {
                  if (row.status === "HELD") {
                    messageApi.warning(t("Cannot cancel a held meeting."));
                    return;
                  }
                  if (row.status === "CANCELED") {
                    messageApi.warning(t("Meeting is already cancelled."));
                    return;
                  }
                  setSelectedMeetingId(row.key);
                  setDeleteItem(true);
                },
              },
            ],
          }}
          trigger={["click"]}
          open={openDropdownRowId === row.key}
          onOpenChange={async (nextOpen) => {
            if (!nextOpen) {
              setOpenDropdownRowId(null);
              return;
            }
            if (disabledActionBusinessIds.has(row.businessId)) {
              messageApi.warning(t("Deal already opened for this business."));
              setOpenDropdownRowId(row.key);
              return;
            }
            try {
              const { data: dealData } = await checkBusinessInDealProcess({
                variables: { isBusinessInDealProcessId: row.businessId },
              });
              const isInDeal = !!dealData?.isBusinessInDealProcess;
              if (isInDeal) {
                setDisabledActionBusinessIds((prev) => {
                  const next = new Set(prev);
                  next.add(row.businessId);
                  return next;
                });
                messageApi.warning(t("Deal already opened for this business."));
                setOpenDropdownRowId(row.key);
              } else {
                setOpenDropdownRowId(row.key);
              }
            } catch (err) {
              console.error(err);
              messageApi.error(t("Unable to check deal status."));
              setOpenDropdownRowId(null);
            }
          }}
        >
          <Button
            aria-labelledby="action button"
            className="bg-transparent border0 p-0"
            style={
              disabledActionBusinessIds.has(row.businessId)
                ? { opacity: 0.5, cursor: "not-allowed" }
                : {}
            }
          >
            <img
              src="/assets/icons/dots.png"
              alt="dot icon"
              width={16}
              fetchPriority="high"
            />
          </Button>
        </Dropdown>
      ),
    },
  ];
  // Apollo lazy query
  const [fetchScheduledMeetings, { data, loading }] = useLazyQuery(
    GETADMINSCHEDULEMEETINGS,
    {
      fetchPolicy: "network-only",
    }
  );
  const [checkBusinessInDealProcess] = useLazyQuery(
    IS_BUSINESS_IN_DEAL_PROCESS,
    {
      fetchPolicy: "network-only",
    }
  );

  // map UI-selected status to API variable
  const filter = useMemo(() => {
    let statusValue = null;
    if (selectedStatus === "2") {
      // "2" is the ID for "Pending"
      statusValue = "APPROVED";
    } else if (selectedStatus === "3") {
      // "3" is the ID for "Cancel Meeting"
      statusValue = "CANCELED";
    }

    return {
      search: searchValue || null,
      status: statusValue,
    };
  }, [selectedStatus, searchValue]);

  useEffect(() => {
    fetchScheduledMeetings({
      variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        ...filter,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, current, filter]);
  const schedulemeetingData = (
    data?.getAdminScheduledMeetings?.items || []
  ).map((item) => {
    const isSeller = item.business?.seller?.id === item.requestedBy?.id;

    return {
      key: item.id,
      offerId: item?.offer?.id,
      offerPrice: item?.offer?.price,
      businessId: item?.business?.id,
      buyerName: isSeller
        ? item?.requestedTo?.name || "-"
        : item?.requestedBy?.name || "-",
      offerCommission: item?.offer?.commission,
      status: item?.status,
      businessTitle: item.business?.businessTitle || "-",
      email: isSeller
        ? item?.requestedTo?.email
        : item?.requestedBy?.email || "-",
      phoneNumber: isSeller
        ? item?.requestedTo?.phone
        : item?.requestedBy?.phone || "-",
      sellerName: item.business?.seller?.name || "-",
      sellerEmail: item.business?.seller?.email || "-",
      sellerPhoneNumber: item.business?.seller?.phone || "-",
      scheduleDateTime: item.adminAvailabilityDate
        ? new Date(item.adminAvailabilityDate).toLocaleString()
        : "-",
      businessPrice: item.business?.price ? item.business.price : "-",
      meetLink: item.meetingLink || "",
    };
  });

  const total = data?.getAdminScheduledMeetings?.totalCount || 0;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchValue(searchTerm.trim());
      setCurrent(1);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrent(1); // Reset to first page on filter change
  };

  const handleDealSubmit = async () => {
    try {
      const values = await form.validateFields();
      const offerPrice = parseFloat(values.offerPrice);

      // Check if offer exists
      if (selectedOffer.id) {
        // Update existing offer
        await updateOffer({
          variables: {
            input: {
              id: selectedOffer.id,
              price: offerPrice,
              status: "ACCEPTED",
            },
          },
        });
      } else {
        // Create new offer if offerId doesn't exist (only businessId and price)
        if (!selectedOffer.businessId) {
          console.error("Business ID is missing!");
          throw new Error("Business ID is required to create an offer");
        }

        await createOffer({
          variables: {
            input: {
              businessId: selectedOffer.businessId,
              price: offerPrice,
              status: "ACCEPTED",
            },
          },
        });
      }

      // update meeting status to HELD
      await updateMeeting({
        variables: {
          input: {
            id: selectedOffer.meetingId,
            status: "HELD",
          },
        },
      });

      setVisible(false);
      setSelectedOffer(null);
      fetchScheduledMeetings({
        variables: {
          limit: pageSize,
          offset: (current - 1) * pageSize,
          ...filter,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };
  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const commission = calculateCommission(value);
    form.setFieldsValue({
      commission: `SAR ${commission.toLocaleString()}`,
    });
  };

  useEffect(() => {
    if (selectedOffer) {
      const priceValue =
        parseFloat(String(selectedOffer.price).replace("SAR", "").trim()) || 0;

      const commission = calculateCommission(priceValue);
      form.setFieldsValue({
        offerPrice: priceValue,
        commission: `SAR ${commission.toLocaleString()}`,
      });
    } else {
      // Reset form when modal closes
      form.resetFields();
    }
  }, [selectedOffer, form]);

  return (
    <>
      {contextHolder}
      <Flex vertical gap={20}>
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
            <Col lg={24} md={24} sm={24} xs={24}>
              <Flex gap={5} wrap>
                <SearchInput
                  withoutForm
                  name="name"
                  placeholder={t("Search")}
                  prefix={
                    <img
                      src="/assets/icons/search.png"
                      width={14}
                      alt="search icon"
                      fetchPriority="high"
                    />
                  }
                  allowClear
                  className="border-light-gray pad-x ps-0 radius-8 fs-13"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <MySelect
                  name="status"
                  withoutForm
                  value={selectedStatus}
                  placeholder={t("Status")}
                  options={meetingItems}
                  onChange={handleStatusChange}
                  allowClear
                />
              </Flex>
            </Col>
          </Row>
        </Form>
        <Table
          size="large"
          columns={schedulemeetingColumn(setVisible)}
          dataSource={schedulemeetingData}
          className="pagination table-cs table"
          showSorterTooltip={false}
          scroll={{ x: 2300 }}
          rowHoverable={false}
          pagination={false}
          loading={{
            ...TableLoader,
            spinning: loading || updating || onUpdating,
          }}
        />
        <CustomPagination
          total={total}
          current={current}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Flex>
      <Modal
        open={visible}
        title="Offer Details"
        onCancel={() => {
          setVisible(false);
          setSelectedOffer(null);
          form.resetFields();
        }}
        onOk={handleDealSubmit}
        okText="Confirm Deal"
        cancelText="Cancel"
      >
        {selectedOffer && (
          <Form form={form} layout="vertical">
            <Form.Item
              label="Offer Price"
              name="offerPrice"
              rules={[{ required: true, message: "Enter Offer Price" }]}
            >
              <Input
                type="number"
                prefix="SAR"
                placeholder="Enter offer price"
                onChange={handlePriceChange}
              />
            </Form.Item>

            <Form.Item label="Commission" name="commission">
              <Input disabled />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <DeleteModal
        visible={deleteItem}
        onClose={() => setDeleteItem(false)}
        title="Are you sure?"
        subtitle="This action cannot be undone. Are you sure you want to cancel this Meeting?"
        type="danger"
        loading={updating}
        onConfirm={async () => {
          try {
            await updateMeeting({
              variables: {
                input: {
                  id: selectedMeetingId,
                  status: "CANCELED",
                },
              },
            });
            setDeleteItem(false);
            await fetchScheduledMeetings({
              variables: {
                limit: pageSize,
                offset: (current - 1) * pageSize,
                ...filter,
              },
            });
            messageApi.success(t("Meeting cancelled successfully!"));
          } catch (err) {
            console.error(err);
            messageApi.error(t("Failed to cancel meeting"));
          }
        }}
      />

      <RescheduleMeeting
        visible={rescheduleVisible}
        onClose={() => {
          setRescheduleVisible(false);
          setSelectedMeetingId(null);
        }}
        meetingId={selectedMeetingId}
        updateMeeting={async (options) => {
          try {
            await updateMeeting(options);
            setRescheduleVisible(false);
            setSelectedMeetingId(null);
            await fetchScheduledMeetings({
              variables: {
                limit: pageSize,
                offset: (current - 1) * pageSize,
                ...filter,
              },
            });
            messageApi.success(t("Meeting rescheduled successfully!"));
          } catch (err) {
            console.error(err);
            messageApi.error(t("Failed to reschedule meeting"));
          }
        }}
        loading={updating}
      />
    </>
  );
};

export { ScheduleMeetingTable };
