import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./index.css";
import { Layout, Menu, Image, Space, Divider } from "antd";
import { AuthContext } from "../../context/AuthContext";
import { Notifications, UserDropdown } from "../../components/Header";
import { BusinesslIstingPage } from "../BusinesslIstingPage";
import {
  AddArticle,
  AddNewCategory,
  AddRolePermission,
  BusinessDealsDetails,
  CreateBusinessList,
  SingleviewBusinesslist,
} from "../../components";
import { CategoriesManagement } from "../CategoriesManagement";
import { UserManagement } from "../UserManagement";
import { MeetingRequestPage } from "../MeetingRequestPage";
import { BusinessDealsPage } from "../BusinessDealsPage";
import { RolePermission } from "../RolePermission";
import { StaffMembersPage } from "../StaffMembersPage";
import { ContactRequestPage } from "../ContactRequestPage";
import { PushNotificationManagerPage } from "../PushNotificationManagerPage";
import { ArticlePage } from "../ArticlePage";
import { TermOfUsePage } from "../TermOfUsePage";
import { EndaTermPage } from "../EndaTermPage";
import { PrivacyPolicyPage } from "../PrivacyPolicyPage";
import { WebsiteTraficAnalysisPage } from "../WebsiteTraficAnalysisPage";
import { Alerts } from "../Alerts";
import { SettingsPage } from "../SettingsPage";
import { FinancePage } from "../FinancePage";
import { FaqsPage } from "../FaqsPage";
import { Dashboard } from "../Dashboard";
import { DSATermsPage } from "../DSATermsPage";

const { Header, Sider, Content } = Layout;

// Maps each route to the permission field that must be true on userPermissions.
// If a route has no entry, it is accessible to all authenticated admin/staff users.
const ROUTE_PERMISSIONS = {
  "/businesslist":          "viewListings",
  "/businesslisting":       "viewListings",
  "/createbusinesslist":    "editListings",
  "/categorymanagement":    "viewWebsitePages",
  "/addnewcategory":        "viewWebsitePages",
  "/usermanagement":        "manageRoles",
  "/meetingrequest":        "viewMeetingRequests",
  "/businessdeal":          "viewDeals",
  "/rolepermission":        "manageRoles",
  "/addrolepermission":     "manageRoles",
  "/staffmembers":          "manageRoles",
  "/finance":               "viewFinanceDashboard",
  "/webtrafficanalysis":    "viewWebsitePages",
  "/articles":              "viewWebsitePages",
  "/faqs":                  "viewWebsitePages",
  "/termofuse":             "viewWebsitePages",
  "/endaterm":              "viewWebsitePages",
  "/dsaterms":              "viewWebsitePages",
  "/privacypolicy":         "viewWebsitePages",
  "/contactrequests":       "viewAlerts",
  "/pushnotificationmanager": "viewAlerts",
  "/alertpage":             "viewAlerts",
};

// Maps sidebar menu key → required permission (same mapping, keyed by menu key).
const MENU_KEY_PERMISSIONS = {
  "2":   "viewListings",
  "3":   "viewWebsitePages",
  "4":   "manageRoles",
  "5":   "viewMeetingRequests",
  "6":   "viewDeals",
  "7":   "manageRoles",
  "8":   "manageRoles",
  "9":   "viewFinanceDashboard",
  "10":  "viewWebsitePages",
  "11a": "viewWebsitePages",
  "11":  "viewWebsitePages",
  "12":  "viewWebsitePages",
  "13":  "viewWebsitePages",
  "14":  "viewWebsitePages",
  "19":  "viewWebsitePages",
  "15":  "viewAlerts",
  "16":  "viewAlerts",
  "17":  "viewAlerts",
};

const Sidebar = () => {
  let navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { userPermissions } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState("1");
  const [openKeys, setOpenKeys] = useState([""]);
  const [completedeal, setCompleteDeal] = useState(null);

  // Returns true when the current user may access the given route path.
  // When userPermissions is null (cookie missing / mid-recovery), deny all permission-gated
  // routes. "/" (Dashboard) is unconditionally allowed here; "/settings" is always accessible
  // because its <Route> is not wrapped with PermissionRoute. The auth recovery flow in
  // AuthContext refetches permissions from the API and re-renders once they arrive.
  const ALWAYS_ALLOWED_PATHS = new Set(["/"]);
  const canAccess = (path) => {
    if (ALWAYS_ALLOWED_PATHS.has(path)) return true;
    if (!userPermissions) return false; // deny until permissions are loaded
    const key = ROUTE_PERMISSIONS[path];
    if (!key) return true; // no restriction defined — accessible to all staff
    return !!userPermissions[key];
  };

  // A route wrapper that redirects to "/" when the user lacks the required permission.
  const PermissionRoute = ({ path, element }) => {
    if (!canAccess(path)) return <Navigate to="/" replace />;
    return element;
  };

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(storedLang);
    document.documentElement.setAttribute(
      "dir",
      storedLang === "ar" ? "rtl" : "ltr"
    );
    i18n.on("languageChanged", (lng) => {
      document.documentElement.setAttribute(
        "dir",
        lng === "ar" ? "rtl" : "ltr"
      );
      localStorage.setItem("lang", lng);
    });
    return () => {
      i18n.off("languageChanged");
    };
  }, [i18n]);

  function getItem(label, key, icon, children) {
    return { key, icon, children, label };
  }

  useEffect(() => {
    let tab = location?.pathname?.split("/")[1];
    tab =
      tab === ""
        ? "1"
        : tab === "businesslist" ||
          tab === "businesslisting" ||
          tab === "createbusinesslist"
        ? "2"
        : tab === "categorymanagement" ||
          tab === "addnewcategory" ||
          tab === "addnewcategory/detail"
        ? "3"
        : tab === "usermanagement"
        ? "4"
        : tab === "meetingrequest"
        ? "5"
        : tab === "businessdeal"
        ? "6"
        : tab === "rolepermission" || tab === "addrolepermission"
        ? "7"
        : tab === "staffmembers"
        ? "8"
        : tab === "finance"
        ? "9"
        : tab === "webtrafficanalysis"
        ? "10"
        : tab === "articles" || tab === "articles/add"
        ? "11a"
        : tab === "faqs"
        ? "11"
        : tab === "termofuse"
        ? "12"
        : tab === "endaterm"
        ? "13"
        : tab === "dsaterms"
        ? "19"
        : tab === "privacypolicy"
        ? "14"
        : tab === "contactrequests"
        ? "15"
        : tab === "pushnotificationmanager"
        ? "16"
        : tab === "alertpage"
        ? "17"
        : tab === "settings"
        ? "18"
        : "1";
    setCurrentTab(tab);
  }, [location]);

  // Returns true when the user may see the given menu key.
  const canSeeKey = (key) => {
    if (!userPermissions) return false; // deny until permissions are loaded
    const perm = MENU_KEY_PERMISSIONS[key];
    if (!perm) return true; // no restriction defined — show to all staff
    return !!userPermissions[perm];
  };

  const menuItems = useMemo(
    () => {
      const websiteSubItems = [
        getItem(t("Website Traffic Analysis"), "10"),
        getItem(t("Articles"), "11a"),
        getItem(t("FAQs"), "11"),
        getItem(t("Terms of Use"), "12"),
        getItem(t("E-NDA Term"), "13"),
        getItem(t("DSA Term"), "19"),
        getItem(t("Privacy Policy"), "14"),
      ].filter((item) => canSeeKey(item.key));

      const allItems = [
        getItem(t("Dashboard"), "1"),
        canSeeKey("2")  && getItem(t("Business Listing"), "2"),
        canSeeKey("3")  && getItem(t("Categories Management"), "3"),
        canSeeKey("4")  && getItem(t("User Management"), "4"),
        canSeeKey("5")  && getItem(t("Meeting Requests"), "5"),
        canSeeKey("6")  && getItem(t("Business Deals"), "6"),
        canSeeKey("7")  && getItem(t("Roles & Permissions"), "7"),
        canSeeKey("8")  && getItem(t("Staff Members"), "8"),
        canSeeKey("9")  && getItem(t("Finance"), "9"),
        websiteSubItems.length > 0 && getItem(t("Website Pages"), "sub1", null, websiteSubItems),
        canSeeKey("15") && getItem(t("Contact Requests"), "15"),
        canSeeKey("16") && getItem(t("Push Notification Manager"), "16"),
        canSeeKey("17") && getItem(t("Alert"), "17"),
        getItem(t("Settings"), "18"),
      ].filter(Boolean);

      return allItems;
    },
    [i18n.language, userPermissions]
  );

  const handleMenuClick = (e) => {
    const { key } = e;
    switch (key) {
      case "1":
        navigate("/", { replace: true });
        break;
      case "2":
        navigate("/businesslist", { replace: true });
        break;
      case "3":
        navigate("/categorymanagement", { replace: true });
        break;
      case "4":
        navigate("/usermanagement", { replace: true });
        break;
      case "5":
        navigate("/meetingrequest", { replace: true });
        break;
      case "6":
        navigate("/businessdeal", { replace: true });
        break;
      case "7":
        navigate("/rolepermission", { replace: true });
        break;
      case "8":
        navigate("/staffmembers", { replace: true });
        break;
      case "9":
        navigate("/finance", { replace: true });
        break;
      case "10":
        navigate("/webtrafficanalysis", { replace: true });
        break;
      case "11a":
        navigate("/articles", { replace: true });
        break;
      case "11":
        navigate("/faqs", { replace: true });
        break;
      case "12":
        navigate("/termofuse", { replace: true });
        break;
      case "13":
        navigate("/endaterm", { replace: true });
        break;
      case "14":
        navigate("/privacypolicy", { replace: true });
        break;
      case "15":
        navigate("/contactrequests", { replace: true });
        break;
      case "16":
        navigate("/pushnotificationmanager", { replace: true });
        break;
      case "17":
        navigate("/alertpage", { replace: true });
        break;
      case "18":
        navigate("/settings", { replace: true });
        break;
      case "19":
        navigate("/dsaterms", { replace: true });
        break;
      default:
        break;
    }
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
    // localStorage.setItem('openKeys', JSON.stringify(keys));
  };
  return (
    <Layout className="h-100vh">
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`h-100vh overflow-y border-right-side scroll-bar ${
          collapsed ? "addclass overflowstyle" : "overflowstyle"
        }`}
      >
        <div className="logo justify-center">
          <Image
            width={collapsed ? "100%" : 130}
            height={"auto"}
            src="/assets/images/logo.webp"
            alt="jusoor logo"
            preview={false}
            fetchPriority="high"
            className="m-0"
          />
        </div>
        <Menu
          defaultSelectedKeys={["1"]}
          selectedKeys={[currentTab]}
          mode="inline"
          theme="dark"
          onClick={handleMenuClick}
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          items={menuItems}
          className="listitem"
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background header-mbl-cs justify-center p-0">
          <div className="header-cs-structure">
            <div onClick={() => setCollapsed(!collapsed)}>
              <Image
                src="/assets/icons/collapse.webp"
                width={"35px"}
                preview={false}
                style={{
                  transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                }}
                alt="collapse-icon"
                fetchPriority="high"
              />
            </div>
            <Space size={30} align="center">
              <Notifications />
              <UserDropdown />
            </Space>
          </div>
        </Header>
        <Divider className="border-gray mt-0" />
        <Content className="scroll-bar structure-content-area-cs">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/businesslist" element={<PermissionRoute path="/businesslist" element={<BusinesslIstingPage />} />} />
            <Route
              path="/businesslisting/details/:id"
              element={<PermissionRoute path="/businesslisting" element={<SingleviewBusinesslist />} />}
            />
            <Route
              path="/createbusinesslist"
              element={<PermissionRoute path="/createbusinesslist" element={<CreateBusinessList />} />}
            />
            <Route
              path="/categorymanagement"
              element={<PermissionRoute path="/categorymanagement" element={<CategoriesManagement />} />}
            />
            <Route path="/addnewcategory" element={<PermissionRoute path="/addnewcategory" element={<AddNewCategory />} />} />
            <Route
              path="/addnewcategory/detail/:id"
              element={<PermissionRoute path="/addnewcategory" element={<AddNewCategory />} />}
            />
            <Route path="/usermanagement" element={<PermissionRoute path="/usermanagement" element={<UserManagement />} />} />
            <Route path="/meetingrequest" element={<PermissionRoute path="/meetingrequest" element={<MeetingRequestPage />} />} />
            <Route
              path="/businessdeal"
              element={<PermissionRoute path="/businessdeal" element={<BusinessDealsPage setCompleteDeal={setCompleteDeal} />} />}
            />
            <Route
              path="/businessdeal/details/:id"
              element={<PermissionRoute path="/businessdeal" element={<BusinessDealsDetails completedeal={completedeal} />} />}
            />
            <Route path="/rolepermission" element={<PermissionRoute path="/rolepermission" element={<RolePermission />} />} />
            <Route path="/staffmembers" element={<PermissionRoute path="/staffmembers" element={<StaffMembersPage />} />} />
            <Route
              path="/webtrafficanalysis"
              element={<PermissionRoute path="/webtrafficanalysis" element={<WebsiteTraficAnalysisPage />} />}
            />
            <Route path="/articles" element={<PermissionRoute path="/articles" element={<ArticlePage />} />} />
            <Route path="/articles/add" element={<PermissionRoute path="/articles" element={<AddArticle />} />} />
            <Route path="/articles/add/:id" element={<PermissionRoute path="/articles" element={<AddArticle />} />} />
            <Route path="/termofuse" element={<PermissionRoute path="/termofuse" element={<TermOfUsePage />} />} />
            <Route path="/endaterm" element={<PermissionRoute path="/endaterm" element={<EndaTermPage />} />} />
            <Route path="/dsaterms" element={<PermissionRoute path="/dsaterms" element={<DSATermsPage />} />} />
            <Route path="/privacypolicy" element={<PermissionRoute path="/privacypolicy" element={<PrivacyPolicyPage />} />} />
            <Route path="/contactrequests" element={<PermissionRoute path="/contactrequests" element={<ContactRequestPage />} />} />
            <Route
              path="/pushnotificationmanager"
              element={<PermissionRoute path="/pushnotificationmanager" element={<PushNotificationManagerPage />} />}
            />
            <Route path="/alertpage" element={<PermissionRoute path="/alertpage" element={<Alerts />} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/finance" element={<PermissionRoute path="/finance" element={<FinancePage />} />} />
            <Route path="/faqs" element={<PermissionRoute path="/faqs" element={<FaqsPage />} />} />
            <Route path="/addrolepermission" element={<PermissionRoute path="/addrolepermission" element={<AddRolePermission />} />} />
            <Route
              path="/addrolepermission/:id"
              element={<PermissionRoute path="/addrolepermission" element={<AddRolePermission />} />}
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export { Sidebar };
