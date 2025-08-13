import { ConfigProvider } from 'antd'
import RouteF from './RouteF'
import { client } from './config'; 
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'

function App() {
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
        components:{
          Timeline: {
            dotBg: 'transparent',
          },
        }
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
