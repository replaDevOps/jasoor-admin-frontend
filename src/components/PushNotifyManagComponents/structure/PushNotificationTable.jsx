import { Button, Card, Col, Dropdown, Flex, Form, Row, Table } from "antd";
import { SearchInput } from "../../Forms";
import { pushnotifyColumn } from "../../../data";
import { useState, useEffect } from "react";
import { DownOutlined } from "@ant-design/icons";
import {  groupItems, pushstatusItem } from "../../../shared";
import { CustomPagination } from "../../Ui";
import { GET_CAMPAIGNS } from "../../../graphql/query";
import { TableLoader } from "../../Ui/TableLoader";
import { useLazyQuery } from "@apollo/client";
import { t } from "i18next";

const PushNotificationTable = ({
  setVisible,
  setViewNotify,
  setEditItem,
  setDeleteItem,
}) => {
  const [form] = Form.useForm();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const [fetchCampaigns, { data, loading }] = useLazyQuery(GET_CAMPAIGNS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      let status = null;
      if (selectedStatus === "Schedule") status = true;
      else if (selectedStatus === "Send") status = false;
      else if (selectedStatus === "All") status = null;

      fetchCampaigns({
        variables: {
          filter: {
            search: searchValue || null,
            district: selectedDistrict || null,
            group: selectedCategory ? selectedCategory.toUpperCase() : null,
            status,
            limit: pageSize,
            offset: (current - 1) * pageSize,
          },
        },
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [
    searchValue,
    selectedDistrict,
    selectedCategory,
    selectedStatus,
    pageSize,
    current,
    fetchCampaigns,
  ]);

  const pushnotifyData =
    data?.getCampaigns?.campaigns?.map((campaign, index) => ({
      key: index + 1,
      title: campaign.title,
      description: campaign.description,
      group:
        campaign.group === "NEW"
          ? t("New")
          : campaign.group === "OLD"
          ? t("Old")
          : t("Both"),
      district: campaign.district?.map((d) => ({ item: d })) || [],
      date: new Date(campaign.schedule || Date.now()).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      status: campaign.status ? 1 : 0,
    })) || [];

  const total = data?.getCampaigns?.totalCount;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleStatusClick = ({ key }) => {
    const selectedItem = pushstatusItem.find((item) => item.key === key);
    if (selectedItem) {
      setSelectedStatus(selectedItem.label);
    }
  };

  const handleCategoryClick = ({ key }) => {
    const selectedItem = groupItems.find((item) => item.key === key);
    if (selectedItem) {
      setSelectedCategory(selectedItem.label);
    }
  };

  const handleDistrictClick = ({ key }) => {
    const selectedItem = districtItems.find((item) => item.key === key);
    if (selectedItem) {
      setSelectedDistrict(selectedItem.label);
    }
  };
  const districtItems = [
    { key: '1', label: t('Makkah') },
    { key: '2', label: t('Eastern') },
    { key: '3', label: t('Al-Madinah') },
    { key: '4', label: t('Asir') },
    { key: '5', label: t('Tabuk') },
    { key: '6', label: t('Najran') },
    { key: '7', label: t('Al-Qassim') },
    { key: '8', label: t('Hail') },
    { key: '9', label: t('Al-Jouf') },
    { key: '10', label: t('Al-Bahah') },
    { key: '11', label: t('Riyadh') },
    { key: '12', label: t('Northern Borders') },
    { key: '13', label: t('Jazan') },
]

  return (
    <Card className="radius-12 border-gray">
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
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <Dropdown
                  menu={{
                    items: groupItems.map((item) => ({
                      key: String(item.key),
                      label: t(item.label),
                    })),
                    onClick: handleCategoryClick,
                  }}
                  trigger={["click"]}
                >
                  <Button
                    aria-labelledby="filter category"
                    className="btncancel px-3 filter-bg fs-13 text-black"
                  >
                    <Flex justify="space-between" align="center" gap={30}>
                      {selectedCategory || t("Category")}
                      <DownOutlined />
                    </Flex>
                  </Button>
                </Dropdown>
                <Dropdown
                  menu={{
                    // items: districtItems,
                     items: districtItems.map((item) => ({
                      key: String(item.key),
                      label: t(item.label),
                    })),
                    onClick: handleDistrictClick,
                  }}
                  trigger={["click"]}
                >
                  <Button
                    aria-labelledby="filter district"
                    className="btncancel px-3 filter-bg fs-13 text-black"
                  >
                    <Flex justify="space-between" align="center" gap={30}>
                      {selectedDistrict || t("District")}
                      <DownOutlined />
                    </Flex>
                  </Button>
                </Dropdown>
                <Dropdown
                  menu={{
                    // items: pushstatusItem,
                     items: pushstatusItem.map((item) => ({
                      key: String(item.key),
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
                      {selectedStatus || t("Status")}
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
          columns={pushnotifyColumn({
            setVisible,
            setViewNotify,
            setEditItem,
            setDeleteItem,
          })}
          dataSource={pushnotifyData}
          className="pagination table-cs table"
          showSorterTooltip={false}
          scroll={{ x: 1000 }}
          rowHoverable={false}
          pagination={false}
          loading={{
            ...TableLoader,
            spinning: loading,
          }}
        />
        <CustomPagination
          total={total}
          current={current}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Flex>
    </Card>
  );
};

export { PushNotificationTable };
