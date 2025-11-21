import {
  Button,
  Col,
  Dropdown,
  Flex,
  Form,
  Row,
  Table,
  Typography,
  message,
} from "antd";
import { NavLink } from "react-router-dom";
import { MySelect, SearchInput } from "../../Forms";
import { useEffect, useState } from "react";
import { meetingItems } from "../../../shared";
import { CustomPagination, DeleteModal } from "../../Ui";
import { ScheduleMeeting } from "../modal";
import { UPDATE_BUSINESS_MEETING } from "../../../graphql/mutation";
import { GETADMINPENDINGMEETINGS } from "../../../graphql/query/meeting";
import { useLazyQuery, useMutation } from "@apollo/client";
import { t } from "i18next";
import dayjs from "dayjs";

const { Text } = Typography;

const MeetingRequestTable = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [visible, setVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const [fetchPendingMeetings, { data, loading }] = useLazyQuery(
    GETADMINPENDINGMEETINGS,
    { fetchPolicy: "network-only" }
  );

  const computeStatusVar = () => {
    if (selectedStatus === "Pending") return "REQUESTED";
    if (selectedStatus === "Cancel Meeting") return "REJECTED";
    if (selectedStatus === "All" || selectedStatus === "Status") return null;
    return null;
  };

  useEffect(() => {
    fetchPendingMeetings({
      variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        search: searchValue,
        status: computeStatusVar(),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, current, searchValue, selectedStatus]);

  // 🧩 Mapping data for Ant Design Table
  const mainmeetingreqData =
    data?.getAdminPendingMeetings?.items?.map((item) => {
      const isSeller = item.business?.seller?.id === item.requestedBy?.id;
      const requestedDate = item.requestedDate
        ? dayjs(item.requestedDate)
        : null;
      const requestedEndDate = item.requestedEndDate
        ? dayjs(item.requestedEndDate)
        : null;
      const receiverAvailabilityDate = item.receiverAvailabilityDate
        ? dayjs(item.receiverAvailabilityDate)
        : null;
      return {
        key: item.id,
        businessTitle: item.business?.businessTitle || "-",
        buyerName: isSeller
          ? item?.requestedTo?.name || "-"
          : item?.requestedBy?.name || "-",
        email: isSeller
          ? item?.requestedTo?.email || "-"
          : item?.requestedBy?.email || "-",
        phoneNumber: isSeller
          ? item?.requestedTo?.phone || "-"
          : item?.requestedBy?.phone || "-",
        sellerName: item.business?.seller?.name || "-",
        sellerEmail: item.business?.seller?.email || "-",
        sellerPhoneNumber: item.business?.seller?.phone || "-",
        buyerTime: !isSeller
          ? `${requestedDate?.format(
              "DD MMM YYYY, hh:mm A"
            )} - ${requestedEndDate?.format("hh:mm A")}`
          : requestedDate
          ? receiverAvailabilityDate?.format("DD MMM YYYY, hh:mm A")
          : "-",
        sellerTime: isSeller
          ? `${requestedDate?.format(
              "DD MMM YYYY, hh:mm A"
            )} - ${requestedEndDate?.format("hh:mm A")}`
          : requestedDate
          ? receiverAvailabilityDate?.format("DD MMM YYYY, hh:mm A")
          : "-",
        businessPrice: item.business?.price
          ? `SAR ${item.business.price.toLocaleString()}`
          : "-",
        offerPrice: item.offer?.price
          ? `SAR ${item.offer.price.toLocaleString()}`
          : "-",
        meetLink: item.meetingLink || "",
        status: item.status || "-",
      };
    }) || [];

  const total = data?.getAdminPendingMeetings?.totalCount || 0;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  const [updateMeeting, { loading: updating }] = useMutation(
    UPDATE_BUSINESS_MEETING,
    {
      refetchQueries: [
        {
          query: GETADMINPENDINGMEETINGS,
          variables: {
            limit: pageSize,
            offset: (current - 1) * pageSize,
            search: searchValue,
            status: computeStatusVar(),
          },
        },
      ],
      onCompleted: () => messageApi.success("Status changed successfully!"),
      onError: (err) =>
        messageApi.error(err.message || "Something went wrong!"),
    }
  );

  const meetingreqColumn = (setVisible, setDeleteItem) => [
    {
      title: t("Business Title"),
      dataIndex: "businessTitle",
    },
    {
      title: t("Buyer Name"),
      dataIndex: "buyerName",
    },
    {
      title: t("Buyer Email"),
      dataIndex: "email",
    },
    {
      title: t("Buyer Phone"),
      dataIndex: "phoneNumber",
    },
    {
      title: t("Preferred Date & Time (Buyer)"),
      dataIndex: "buyerTime",
    },
    {
      title: t("Seller Name"),
      dataIndex: "sellerName",
    },
    {
      title: t("Seller Email"),
      dataIndex: "sellerEmail",
    },
    {
      title: t("Seller Phone"),
      dataIndex: "sellerPhoneNumber",
    },
    {
      title: t("Preferred Date & Time (Seller)"),
      dataIndex: "sellerTime",
    },
    {
      title: t("Business Price"),
      dataIndex: "businessPrice",
    },
    {
      title: t("Offer Price"),
      dataIndex: "offerPrice",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        return status === "ACCEPTED" ? (
          <Text className="btnpill fs-12 pending">{t("Pending")}</Text>
        ) : (
          <Text className="btnpill fs-12 inactive">{t("Cancel Meeting")}</Text>
        );
      },
    },
    {
      title: t("Action"),
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, row) => {
        if (row.status !== "ACCEPTED") return null;

        return (
          <Dropdown
            menu={{
              items: [
                {
                  label: (
                    <NavLink
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMeetingId(row.key);
                        setVisible(true);
                      }}
                    >
                      {t("Schedule Meeting")}
                    </NavLink>
                  ),
                  key: "1",
                },
                {
                  label: (
                    <NavLink
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedMeetingId(row.key);
                        setDeleteItem(true);
                      }}
                    >
                      {t("Cancel")}
                    </NavLink>
                  ),
                  key: "2",
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button className="bg-transparent border0 p-0">
              <img src="/assets/icons/dots.png" alt="dots icon" width={16} />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Flex vertical gap={20}>
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col lg={24} md={24} sm={24} xs={24}>
              <Flex gap={5}>
                <SearchInput
                  withoutForm
                  name="name"
                  placeholder={t("Search")}
                  prefix={
                    <img
                      src="/assets/icons/search.png"
                      width={14}
                      alt="search"
                    />
                  }
                  className="border-light-gray pad-x ps-0 radius-8 fs-13"
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
                <MySelect
                  withoutForm
                  name="status"
                  placeholder={t("Status")}
                  options={meetingItems}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e)}
                  allowClear
                />
              </Flex>
            </Col>
          </Row>
        </Form>

        <Table
          size="large"
          columns={meetingreqColumn(setVisible, setDeleteItem)}
          dataSource={mainmeetingreqData}
          className="pagination table-cs table"
          showSorterTooltip={false}
          scroll={{ x: 3100 }}
          rowHoverable={false}
          pagination={false}
          loading={loading}
        />

        <CustomPagination
          total={total}
          current={current}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Flex>

      <DeleteModal
        visible={deleteItem}
        onClose={() => setDeleteItem(false)}
        title="Are you sure?"
        subtitle="This action cannot be undone. Are you sure you want to cancel this Meeting?"
        type="danger"
        onConfirm={async () => {
          try {
            await updateMeeting({
              variables: {
                input: {
                  id: selectedMeetingId,
                  status: "REJECTED",
                },
              },
            });
            setDeleteItem(false);
          } catch (err) {
            console.error(err);
          }
        }}
      />

      <ScheduleMeeting
        visible={visible}
        onClose={() => setVisible(false)}
        meetingId={selectedMeetingId}
        updateMeeting={updateMeeting}
        loading={updating}
      />
    </>
  );
};

export { MeetingRequestTable };
