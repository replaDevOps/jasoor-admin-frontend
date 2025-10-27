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
import { SearchInput } from "../../Forms";
import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { meetingItems } from "../../../shared";
import { CustomPagination, DeleteModal } from "../../Ui";
import { ScheduleMeeting } from "../modal";
import { UPDATE_BUSINESS_MEETING } from "../../../graphql/mutation";
import { GETADMINPENDINGMEETINGS } from "../../../graphql/query/meeting";
import { useLazyQuery, useMutation } from "@apollo/client";
import { t } from "i18next";

const { Text } = Typography;

const MeetingRequestTable = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
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
      title: t("Preferred Date & Time"),
      dataIndex: "scheduleDateTime",
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
        if (row.status !== "ACCEPTED") return null; // only show dropdown for REQUESTED

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
            <Button
              aria-labelledby="action button"
              className="bg-transparent border0 p-0"
            >
              <img
                src="/assets/icons/dots.png"
                alt="dots icon"
                width={16}
                fetchPriority="high"
              />
            </Button>
          </Dropdown>
        );
      },
    },
  ];
  const [selectedStatus, setSelectedStatus] = useState("Status");
  const [visible, setVisible] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchValue, setSearchValue] = useState("");
    // Apollo lazy query for better control over pagination/search/status
    const [fetchPendingMeetings, { data, loading }] = useLazyQuery(
      GETADMINPENDINGMEETINGS,
      { fetchPolicy: "network-only" }
    );

    // map UI-selected status to API variable for pending meetings
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
  const mainmeetingreqData = (data?.getAdminPendingMeetings?.items || []).map(
    (item) => ({
      key: item.id,
      businessTitle: item.business?.businessTitle || "-",
      buyerName: item.requestedTo?.name || "-",
      email: item.requestedTo?.email || "-",
      phoneNumber: item.requestedTo?.phone || "-",
      sellerName: item.business?.seller?.name || "-",
      sellerEmail: item.business?.seller?.email || "-",
      sellerPhoneNumber: item.business?.seller?.phone || "-",
      scheduleDateTime: item.requestedDate
        ? new Date(item.requestedDate).toLocaleString()
        : "-",
      businessPrice: item.business?.price
        ? `SAR ${item.business.price.toLocaleString()}`
        : "-",
      offerPrice: item.offer?.price
        ? `SAR ${item.offer.price.toLocaleString()}`
        : "-",
      meetLink: item.meetingLink || "",
      status: item.status || "-",
    })
  );

  const total = data?.getAdminPendingMeetings?.totalCount || 0;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleStatusClick = ({ key }) => {
    const selectedItem = meetingItems.find((item) => item.key === key);
    if (selectedItem) {
      setSelectedStatus(selectedItem.label);
    }
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };
  const [updateMeeting, { loading: updating }] = useMutation(
    UPDATE_BUSINESS_MEETING,
    {
      refetchQueries: [{ query: GETADMINPENDINGMEETINGS }],
      awaitRefetchQueries: true,
      onCompleted: () => {
        messageApi.success("Stats changed successfully!");
      },
      onError: (err) => {
        messageApi.error(err.message || "Something went wrong!");
      },
    }
  );

  return (
    <>
      {contextHolder}
      <Flex vertical gap={20}>
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
            <Col lg={24} md={24} sm={24} xs={24}>
              <Flex gap={5} wrap>
                <SearchInput
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
                  className="border-light-gray pad-x ps-0 radius-8 fs-13"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Dropdown
                  menu={{
                    items: meetingItems.map((item) => ({
                      ...item,
                      label: t(item.label), 
                    })),
                    onClick: handleStatusClick,
                  }}
                  trigger={["click"]}
                >
                  <Button
                    aria-labelledby="filter status"
                    className="btncancel px-3 filter-bg fs-13 text-black"
                  >
                    <Flex justify="space-between" align="center" gap={30}>
                      {t(selectedStatus)}
                      <DownOutlined />
                    </Flex>
                  </Button>
                </Dropdown>
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
          scroll={{ x: 2300 }}
          rowHoverable={false}
            pagination={false}
          loading={loading || updating}
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
            setDeleteItem(false); // close modal after success
          } catch (err) {
            console.error(err);
          }
        }}
      />
      <ScheduleMeeting
        visible={visible}
        onClose={() => setVisible(false)}
        meetingId={selectedMeetingId} // store this in state when clicking "Schedule Meeting"
        updateMeeting={updateMeeting}
      />
    </>
  );
};

export { MeetingRequestTable };
