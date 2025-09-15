import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Route, Routes, useLocation } from 'react-router-dom';
import './index.css';
import { Layout, Menu, Image, Space, Divider } from 'antd';
import { Notifications, UserDropdown } from '../../components/Header';
import { BusinesslIstingPage } from '../BusinesslIstingPage';
import { AddArticle, AddNewCategory, AddRolePermission, BusinessDealsDetails, CreateBusinessList, SingleviewBusinesslist } from '../../components';
import { CategoriesManagement } from '../CategoriesManagement';
import { UserManagement } from '../UserManagement';
import { MeetingRequestPage } from '../MeetingRequestPage';
import { BusinessDealsPage } from '../BusinessDealsPage';
import { RolePermission } from '../RolePermission';
import { StaffMembersPage } from '../StaffMembersPage';
import { ContactRequestPage } from '../ContactRequestPage';
import { PushNotificationManagerPage } from '../PushNotificationManagerPage';
import { ArticlePage } from '../ArticlePage';
import { TermOfUsePage } from '../TermOfUsePage';
import { EndaTermPage } from '../EndaTermPage';
import { PrivacyPolicyPage } from '../PrivacyPolicyPage';
import { WebsiteTraficAnalysisPage } from '../WebsiteTraficAnalysisPage';
import { Alerts } from '../Alerts';
import { SettingsPage } from '../SettingsPage';
import { FinancePage } from '../FinancePage';
import { FaqsPage } from '../FaqsPage';
import { Dashboard } from '../Dashboard';


const { Header, Sider, Content } = Layout;
const Sidebar = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState('1');
  const [openKeys, setOpenKeys] = useState(['']);
  const [ completedeal, setCompleteDeal ] = useState(null)
  

  function getItem(label, key, icon, children) {
    return { key, icon, children, label };
  }

  useEffect(() => {
    let tab = location?.pathname?.split("/")[1];
    tab = tab === '' ? '1' :
      tab === 'businesslist' || tab === 'businesslisting' || tab === 'createbusinesslist' ? '2' :
      tab === 'categorymanagement' || tab === 'addnewcategory' || tab === 'addnewcategory/detail' ? '3' : 
      tab === 'usermanagement' ? '4' :
      tab === 'meetingrequest' ? '5' :
      tab === 'businessdeal' ? '6' :
      tab === 'rolepermission' || tab === 'addrolepermission' ? '7' :
      tab === 'staffmembers' ? '8' :
      tab === 'finance' ? '9' :
      tab === 'webtrafficanalysis' ? '10' :
      tab === 'articles' || tab === 'articles/add' ? '11a' :
      tab === 'faqs' ? '11' :
      tab === 'termofuse' ? '12' :
      tab === 'endaterm' ? '13' :
      tab === 'privacypolicy' ? '14' :
      tab === 'contactrequests' ? '15' :
      tab === 'pushnotificationmanager' ? '16' :
      tab === 'alertpage' ? '17' :
      tab === 'settings' ? '18' :
    '1';
    setCurrentTab(tab);
    
  }, [location]);

  const menuItems = useMemo(() => [
    getItem('Dashboard', '1'),
    getItem('Business listing', '2'),
    getItem('Categories Management', '3'),
    getItem('User Management', '4'),
    getItem('Meeting Requests', '5'),
    getItem('Business Deals', '6'),
    getItem('Roles & Permissions', '7'),
    getItem('Staff Members', '8'),
    getItem('Finance', '9'),
    getItem('Website Pages', 'sub1', null, [
      getItem('Website Traffic Analysis', '10'),
      getItem('Articles', '11a'),
      getItem('FAQs', '11'),
      getItem('Terms of Use', '12'),
      getItem('E-NDA Term', '13'),
      getItem('Privacy Policy', '14'),
    ]),
    getItem('Contact Requests', '15'),
    getItem('Push Notification Manager', '16'),
    getItem('Alert', '17'),
    getItem('Settings', '18'),
], []);


  const handleMenuClick = (e) => {
    const { key } = e;
    switch (key) {
      case '1':
        navigate("/", { replace: true });
        break;
      case '2':
        navigate("/businesslist", { replace: true });
        break;
      case '3':
        navigate("/categorymanagement", { replace: true });
        break;
      case '4':
        navigate("/usermanagement", { replace: true });
        break;
      case '5':
        navigate("/meetingrequest", { replace: true });
        break;
      case '6':
        navigate("/businessdeal", { replace: true });
        break;
      case '7':
        navigate("/rolepermission", { replace: true });
        break;
      case '8':
        navigate("/staffmembers", { replace: true });
        break;
      case '9':
        navigate("/finance", { replace: true });
        break;
      case '10':
        navigate("/webtrafficanalysis", { replace: true });
        break;
      case '11a':
        navigate("/articles", { replace: true });
        break;
      case '11':
        navigate("/faqs", { replace: true });
        break;
      case '12':
        navigate("/termofuse", { replace: true });
        break;
      case '13':
        navigate("/endaterm", { replace: true });
        break;
      case '14':
        navigate("/privacypolicy", { replace: true });
        break;
      case '15':
        navigate("/contactrequests", { replace: true });
        break;
      case '16':
        navigate("/pushnotificationmanager", { replace: true });
        break;
      case '17':
        navigate("/alertpage", { replace: true });
        break;
      case '18':
        navigate("/settings", { replace: true });
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
    <Layout style={{ height: '100vh' }}>
      <Sider breakpoint="md"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken)
        }} trigger={null} collapsible collapsed={collapsed} className={collapsed ? 'addclass overflowstyle' :'overflowstyle'} style={{ height: '100vh', overflowY: 'auto',borderRight:'1px solid #E3E3E3'}}>
        <div className="logo" style={{ display: 'flex', justifyContent: 'center' }}>
          <Image
            style={{ width: collapsed ? "100%" : '130px' }}
            height={'auto'}
            src="/assets/images/logo.png"
            alt='jusoor logo'
            preview={false}
            fetchPriority="high"
          />
        </div>
        <Menu
          defaultSelectedKeys={['1']}
          selectedKeys={[currentTab]}
          mode="inline"
          theme="dark"
          onClick={handleMenuClick}
          onOpenChange={onOpenChange}
          openKeys={openKeys}
          items={menuItems}
          className='listitem'
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background header-mbl-cs"
          style={{
            padding: 0,
            display: 'flex',
            paddingLeft:0,
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '98%', display: 'flex', justifyContent: 'space-between',alignItems:'center',position:'relative',gap:5}}>
            <div onClick={() => setCollapsed(!collapsed)}>
              <Image src='/assets/icons/collapse.png' 
                width={'35px'} preview={false} 
                style={{transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)'}}  
                alt='collapse-icon'
                fetchPriority="high"
              />
            </div>
            <Space size={30} align='center'>
              <Notifications />
              <UserDropdown />
            </Space>
          </div>
        </Header>
        <Divider className='border-gray mt-0' />
        <Content
          className="scroll-bar"
          style={{
            margin: '24px 10px',
            marginTop: '0',
            padding: '0 15px',
            minHeight: 280,
            overflowY: 'auto',
            paddingTop: 24,
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/businesslist" element={<BusinesslIstingPage />} />
            <Route path="/businesslisting/details/:id" element={<SingleviewBusinesslist />} />
            <Route path="/createbusinesslist" element={<CreateBusinessList />} />
            <Route path="/categorymanagement" element={<CategoriesManagement />} />
            <Route path="/addnewcategory" element={<AddNewCategory />} />
            <Route path="/addnewcategory/detail/:id" element={<AddNewCategory />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/meetingrequest" element={<MeetingRequestPage />} />
            <Route path="/businessdeal" element={<BusinessDealsPage setCompleteDeal={setCompleteDeal} />} />
            <Route path="/businessdeal/details/:id" element={<BusinessDealsDetails completedeal={completedeal} />} />
            <Route path="/rolepermission" element={<RolePermission />} />
            <Route path="/staffmembers" element={<StaffMembersPage />} />
            <Route path="/webtrafficanalysis" element={<WebsiteTraficAnalysisPage />} />
            <Route path="/articles" element={<ArticlePage/>} />
            <Route path="/articles/add" element={<AddArticle/>} />
            <Route path="/articles/add/:id" element={<AddArticle />} />
            <Route path="/termofuse" element={<TermOfUsePage/>} />
            <Route path="/endaterm" element={<EndaTermPage/>} />
            <Route path="/privacypolicy" element={<PrivacyPolicyPage />} />
            <Route path="/contactrequests" element={<ContactRequestPage />} />
            <Route path="/pushnotificationmanager" element={<PushNotificationManagerPage />} />
            <Route path="/alertpage" element={<Alerts />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/rolepermission" element={<RolePermission />} />
            <Route path="/addrolepermission" element={<AddRolePermission />} />
            <Route path="/addrolepermission/:id" element={<AddRolePermission />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export {Sidebar};
