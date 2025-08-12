import { BrowserRouter } from "react-router-dom"
import RouteF from "./RouteF"
import { ConfigProvider, theme } from "antd"

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1D4ED8',
            colorError: '#C30010',
          }
        }}
      >
        <RouteF theme={theme.components} />
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App
