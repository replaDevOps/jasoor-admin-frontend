import {
  Button,
  Card,
  Col,
  Dropdown,
  Flex,
  Form,
  Row,
  Table,
  Typography,
  message,
} from "antd";
import { MySelect, SearchInput } from "../../Forms";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { CustomPagination, DeleteModal } from "../../Ui";
import { UPDATE_USER, DELETE_USER } from "../../../graphql/mutation";
import { GETSTAFFMEMBERS, GETROLES } from "../../../graphql/query";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { TableLoader } from "../../Ui/TableLoader";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const StaffMemberTable = ({ setVisible, setEditItem }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [deleteitem, setDeleteItem] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [current, setCurrent] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Roles query (normal useQuery, no debounce needed)
  const { data: rolesData } = useQuery(GETROLES);

  // ✅ UseLazyQuery for staff members
  const [getStaffMembers, { loading, data }] = useLazyQuery(GETSTAFFMEMBERS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    getStaffMembers({
      variables: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        search: searchText || null,
        status: selectedStatus,
        roleId: selectedRole,
      },
    });
  }, [
    pageSize,
    current,
    searchText,
    selectedStatus,
    selectedRole,
    getStaffMembers,
  ]);

  // Debounce search term
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchText(searchTerm.trim());
      setCurrent(1);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const roles =
    rolesData?.getRoles?.roles?.filter((role) => role.name !== "Customer") ||
    [];

  const total = data?.getStaffMembers?.totalCount || 0;
  const staffData = data?.getStaffMembers?.users?.map((user) => ({
    ...user,
    key: user.id,
    role: user.role?.name ? t(user.role.name) : t("N/A"),
  }));

  const handlePageChange = (page, size) => {
    setCurrent(page);
    setPageSize(size);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setCurrent(1);
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    setCurrent(1);
  };

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{ query: GETSTAFFMEMBERS }],
    awaitRefetchQueries: true,
  });
  const [deleteUser, { loading: onDeleting }] = useMutation(DELETE_USER, {
    refetchQueries: [GETSTAFFMEMBERS],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success(t("Staff member deleted successfully!"));
      setDeleteItem(false);
    },
  });

  const staffmemberColumn = (setVisible, setDeleteItem, setEditItem) => [
    {
      title: t("Name"),
      dataIndex: "name",
    },
    {
      title: t("Email"),
      dataIndex: "email",
    },
    {
      title: t("Phone"),
      dataIndex: "phone",
    },
    {
      title: t("Role"),
      dataIndex: "role",
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        if (status === "verified") {
          return <Text className="btnpill fs-12 success">{t("Active")}</Text>;
        } else if (status === "inactive") {
          return (
            <Text className="btnpill fs-12 inactive">{t("Inactive")}</Text>
          );
        } else if (status === "pending") {
          return <Text className="btnpill fs-12 pending">{t("Pending")}</Text>;
        }
        return null;
      },
    },
    {
      title: t("Action"),
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, row) => {
        const handleUpdateStatus = async (newStatus) => {
          try {
            await updateUser({
              variables: {
                input: {
                  id: row.key,
                  status: newStatus,
                },
              },
            });
            messageApi.success(t("Staff member updated successfully!"));
          } catch (err) {
            messageApi.error(err.message || t("Something went wrong!"));
          }
        };

        let actionLabel = "";
        let nextStatus = "";

        if (row.status === "pending") {
          actionLabel = t("Verify");
          nextStatus = "verified";
        } else if (row.status === "verified") {
          actionLabel = t("Inactive");
          nextStatus = "inactive";
        } else if (row.status === "inactive") {
          actionLabel = t("Active");
          nextStatus = "verified";
        }

        return (
          <Dropdown
            menu={{
              items: [
                {
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
                  key: "1",
                },
                {
                  label: (
                    <NavLink
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpdateStatus(nextStatus);
                      }}
                    >
                      {actionLabel}
                    </NavLink>
                  ),
                  key: "2",
                },
                {
                  label: (
                    <NavLink
                      onClick={(e) => {
                        e.preventDefault();
                        setDeleteItem(true);
                        setSelectedUserId(row.key);
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
        );
      },
    },
  ];

  const statusItems = [
    { id: "verified", name: t("Active") },
    { id: "inactive", name: t("Inactive") },
    { id: "pending", name: t("Pending") },
  ];

  const roleItems =
    roles?.map((role) => ({
      id: role?.id,
      name: t(role?.name),
    })) || [];

  return (
    <>
      {contextHolder}
      <Card className="radius-12 border-gray">
        <Flex vertical gap={20}>
          <Form form={form} layout="vertical">
            <Row gutter={[16, 16]} align={"middle"} justify={"space-between"}>
              <Col xl={18} lg={16} md={24} sm={24} xs={24}>
                <Flex gap={5} wrap>
                  <SearchInput
                    withoutForm
                    allowClear
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
                  <MySelect
                    withoutForm
                    name="role"
                    placeholder={t("Role")}
                    options={roleItems}
                    value={selectedRole}
                    onChange={handleRoleChange}
                    allowClear
                    showKey
                  />
                  <MySelect
                    withoutForm
                    name="status"
                    placeholder={t("Status")}
                    options={statusItems}
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    allowClear
                    showKey
                  />
                </Flex>
              </Col>
            </Row>
          </Form>
          <Table
            size="large"
            columns={staffmemberColumn(setVisible, setDeleteItem, setEditItem)}
            dataSource={staffData}
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
      <DeleteModal
        visible={deleteitem}
        onClose={() => setDeleteItem(false)}
        title={t("Are you sure?")}
        subtitle={t(
          "This action cannot be undone. Are you sure you want to delete this staff member?"
        )}
        type="danger"
        loading={onDeleting}
        onConfirm={() => {
          if (selectedUserId) {
            deleteUser({
              variables: { deleteUserId: selectedUserId },
            });
          }
        }}
      />
    </>
  );
};

export { StaffMemberTable };
