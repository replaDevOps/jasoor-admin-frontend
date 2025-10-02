import { ConfigProvider } from 'antd'
import RouteF from './RouteF'
import { client } from './config'; 
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import enUS from "antd/lib/locale/en_US";
import arEG from "antd/lib/locale/ar_EG";

function App() {
  const { i18n } = useTranslation();

  return (
    <BrowserRouter>
      <AuthProvider>
        <ApolloProvider client={client}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1D4ED8',
                colorError: '#BC302F',
              },
              components: {
                Timeline: {
                  dotBg: 'transparent',
                },
              },
            }}
            locale={{
              ...(i18n.language === "ar" ? arEG : enUS),
              Table: {
                ...((i18n.language === "ar" ? arEG.Table : enUS.Table) || {}),
                emptyText: i18n.language === "ar" ? "لا توجد بيانات" : "No Data",
              },
            }}
          >
            <RouteF />
          </ConfigProvider>
        </ApolloProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
