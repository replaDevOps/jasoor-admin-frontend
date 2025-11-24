import { Flex, Form, Table } from "antd";
import { SearchInput } from "../../Forms";
import { CustomPagination, TableLoader } from "../../Ui";
import { useState, useEffect } from "react";
import { GETDEALS } from "../../../graphql/query/meeting";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

const CompleteDealsTable = ({ setCompleteDeal }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const [getDeals, { data, loading }] = useLazyQuery(GETDEALS, {
    fetchPolicy: "network-only",
  });

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchValue(searchTerm.trim());
      setCurrent(1);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    getDeals({
      variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        search: searchValue || null,
        status: null,
        isCompleted: true,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, current, pageSize]);

  const completedealData = (data?.getDeals?.deals || []).map((item) => ({
    key: item?.id,
    businessTitle: item?.business?.businessTitle || "-",
    buyerName: item?.buyer?.name || "-",
    sellerName: item?.business?.seller?.name || "-",
    finalizedOffer: item?.offer?.price
      ? `SAR ${item?.offer?.price?.toLocaleString()}`
      : "-",
    status: item?.status || 0,
    date: item?.createdAt
      ? new Date(item?.createdAt).toLocaleDateString()
      : "-",
  }));

  const total = data?.getDeals?.totalCount || 0;

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const completedealColumn = [
    {
      title: t("Business Title"),
      dataIndex: "businessTitle",
    },
    {
      title: t("Buyer Name"),
      dataIndex: "buyerName",
    },
    {
      title: t("Seller Name"),
      dataIndex: "sellerName",
    },
    {
      title: t("Finalized Offer"),
      dataIndex: "finalizedOffer",
    },
    {
      title: t("Date"),
      dataIndex: "date",
    },
  ];

  return (
    <>
      <Flex vertical gap={20}>
        <Form form={form} layout="vertical">
          <Flex gap={5}>
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
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Flex>
        </Form>
        <Table
          size="large"
          columns={completedealColumn}
          dataSource={completedealData}
          className="pagination table-cs table"
          showSorterTooltip={false}
          scroll={{ x: 1200 }}
          rowHoverable={false}
          onRow={(record) => ({
            onClick: () => {
              navigate("/businessdeal/details/" + record?.key);
              setCompleteDeal(record);
            },
          })}
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
    </>
  );
};

export { CompleteDealsTable };
