import { Button, Dropdown, Flex, Space, Tooltip, Typography } from "antd";
import { NavLink } from "react-router-dom";
import { MyInput, MySelect } from "../components";
import { priorityItems } from "../shared";
import { t } from "i18next";

const { Text } = Typography;

const postsaleColumn = [
  {
    title: "Support Period",
    dataIndex: "supportperiod",
  },
  {
    title: "Number of Session",
    dataIndex: "nosession",
  },
];

const offertableColumn = [
  {
    title: "Buyer Name",
    dataIndex: "buyername",
    render: (buyername) => {
      return (
        <Text>
          {buyername.substring(0, 5)}
          {"*".repeat(buyername.length - 5)}
        </Text>
      );
    },
  },
  {
    title: "Business Price",
    dataIndex: "businessprice",
  },
  {
    title: "Offer Price",
    dataIndex: "offerprice",
    render: (_, row) => {
      return (
        <>
          <Flex gap={10} align="center">
            {row?.offerprice}
            {row?.priceType === 1 ? (
              <Tooltip title="CO - Counteroffer">
                <Text className="brand-bg radius-4 p-1 fs-11 text-white">
                  CO
                </Text>
              </Tooltip>
            ) : (
              <Tooltip title="PP - Proceed to Purchase">
                <Text className="bg-orange bg radius-4 p-1 fs-11 text-white">
                  PP
                </Text>
              </Tooltip>
            )}
          </Flex>
        </>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status) => {
      return status === 0 ? (
        <Space align="center">
          <Text className="btnpill fs-12 pending">Send</Text>
        </Space>
      ) : status === 1 ? (
        <Text className="btnpill fs-12 inactive">Reject</Text>
      ) : status === 2 ? (
        <Text className="btnpill fs-12 success">Received</Text>
      ) : null;
    },
  },
  {
    title: "Offer Date",
    dataIndex: "offerdate",
  },
];

const categoryStatsProfColumn = (handleInputChange) => [
  {
    title: t("Region Name"),
    dataIndex: "regionname",
  },
  {
    title: "2024",
    dataIndex: "value2024",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) => handleInputChange(e.target.value, index, "value2024")}
        addonBefore={
          <img
            src="/assets/icons/reyal-g.png"
            alt="currency symbol"
            width={14}
            fetchPriority="high"
          />
        }
        className="w-100"
      />
    ),
  },
  {
    title: "2023",
    dataIndex: "value2023",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) => handleInputChange(e.target.value, index, "value2023")}
        addonBefore={
          <img
            src="/assets/icons/reyal-g.png"
            alt="currency symbol"
            width={14}
            fetchPriority="high"
          />
        }
        className="w-100"
      />
    ),
  },
  {
    title: "2022",
    dataIndex: "value2022",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) => handleInputChange(e.target.value, index, "value2022")}
        addonBefore={
          <img
            src="/assets/icons/reyal-g.png"
            alt="currency symbol"
            width={14}
            fetchPriority="high"
          />
        }
        className="w-100"
      />
    ),
  },
  {
    title: "2021",
    dataIndex: "value2021",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) => handleInputChange(e.target.value, index, "value2021")}
        addonBefore={
          <img
            src="/assets/icons/reyal-g.png"
            alt="currency symbol"
            width={14}
            fetchPriority="high"
          />
        }
        className="w-100"
      />
    ),
  },
  {
    title: t("Local Business Growth"),
    dataIndex: "localbusinessgrowth",
    render: (value, record, index) => (
      <MyInput
        withoutForm
        placeholder="Enter avg profit"
        value={value}
        onChange={(e) =>
          handleInputChange(e.target.value, index, "localbusinessgrowth")
        }
        addonBefore={
          <img
            src="/assets/icons/reyal-g.png"
            alt="currency symbol"
            width={14}
            fetchPriority="high"
          />
        }
        className="w-100"
      />
    ),
  },
  {
    title: t("Population Density"),
    dataIndex: "populationdensity",
    render: (value, record, index) => (
      <MySelect
        withoutForm
        placeholder="Select Density"
        value={value}
        onChange={(value) =>
          handleInputChange(value, index, "populationdensity")
        }
        options={priorityItems}
      />
    ),
  },
  {
    title: t("Industry Demand"),
    dataIndex: "industrydemand",
    render: (value, record, index) => (
      <MySelect
        withoutForm
        placeholder="Select Demand"
        value={value}
        onChange={(value) => handleInputChange(value, index, "industrydemand")}
        options={priorityItems}
      />
    ),
  },
];

const completedealColumn = [
  {
    title: "Business Title",
    dataIndex: "businessTitle",
  },
  {
    title: "Buyer Name",
    dataIndex: "buyerName",
  },
  {
    title: "Seller Name",
    dataIndex: "sellerName",
  },
  {
    title: "Finalized Offer",
    dataIndex: "finalizedOffer",
  },
  {
    title: "Date",
    dataIndex: "date",
  },
];

const pushnotifyColumn = ({
  setVisible,
  setViewNotify,
  setEditItem,
  setDeleteItem,
}) => [
  {
    title: t("Title"),
    dataIndex: "title",
  },
  {
    title: t("Description"),
    dataIndex: "description",
    render: (description) => {
      const words = description?.split(" ") || [];
      const previewText = words.slice(0, 5).join(" ");
      const showEllipsis = words.length > 5;

      return (
        <Tooltip title={description}>
          <Text>
            {previewText}
            {showEllipsis ? "..." : ""}
          </Text>
        </Tooltip>
      );
    },
  },
  {
    title: t("Group"),
    dataIndex: "group",
    render: (group) => {
      return group === "New" ? (
        <Text className="btnpill fs-12 branded">{group}</Text>
      ) : group === "Old" ? (
        <Text className="btnpill fs-12 inactive">{group}</Text>
      ) : (
        <Text className="btnpill fs-12 success">{group}</Text>
      );
    },
  },
  {
    title: t("District"),
    dataIndex: "district",
    render: (district) => {
      return Array.isArray(district) ? (
        <Flex gap={5} align="center" wrap>
          {district?.map((list, i) => (
            <Text key={i} className="sm-pill border-gray fs-12 ">
              {list?.item}
            </Text>
          ))}
        </Flex>
      ) : null;
    },
  },
  {
    title: t("Date"),
    dataIndex: "date",
  },
  {
    title: t("Reply Status"),
    dataIndex: "status",
    render: (status) => {
      return status === 1 ? (
        <Text className="btnpill fs-12 success">Sent</Text>
      ) : (
        <Text className="btnpill fs-12 inactive">Schedule</Text>
      );
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
            row?.status === 1 && {
              label: (
                <NavLink
                  onClick={(e) => {
                    e.preventDefault();
                    setVisible(true);
                    setViewNotify(row);
                  }}
                >
                  {t("View")}
                </NavLink>
              ),
              key: "1",
            },
            row?.status !== 1 && {
              label: (
                <NavLink
                  onClick={(e) => {
                    e.preventDefault();
                    setVisible(true);
                    setEditItem(row);
                  }}
                >
                  {t("Edit")}
                </NavLink>
              ),
              key: "2",
            },
            row?.status !== 1 && {
              label: (
                <NavLink
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteItem(true);
                  }}
                >
                  {t("Delete")}
                </NavLink>
              ),
              key: "3",
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
            alt="dot icon"
            width={16}
            fetchPriority="high"
          />
        </Button>
      </Dropdown>
    ),
  },
];


export {
  postsaleColumn,
  offertableColumn,
  categoryStatsProfColumn,
  completedealColumn,
  pushnotifyColumn,
};
