import React, { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { SyncOutlined } from '@ant-design/icons'
import { Image, Space } from 'antd'

import {Sidebar} from '../pages/Sidebar';
import { ForgotPassword, LoginPage } from '../pages'

const Fallback = () => (
  <div className='center' style={{ height: '100vh', width: '100%' }}>
    <Space direction='vertical' align='center' style={{ justifyContent: 'center', height: '100%', width: '100%' }}>
      <Image style={{ width: '200px' }} src='/assets/images/logo.png' alt='jusoor-logo' fetchPriority="high" preview={false} />
      <SyncOutlined spin style={{ color: 'var(--second-color)', fontSize: '35px' }} />
    </Space>
  </div>
)

const isLoggedIn = () => !!localStorage.getItem('accessToken')

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  if (!isLoggedIn()) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }
  return children
}


const RouteF = () => {
  const [auth, setAuth] = useState(isLoggedIn())
  const [ws, setWs] = useState(null)

  // useEffect(() => {
  //   const onAuth = () => setAuth(isLoggedIn())
  //   window.addEventListener('authChanged', onAuth)
  //   return () => window.removeEventListener('authChanged', onAuth)
  // }, [])

  const url = import.meta.env.VITE_WS_URL
  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(url)
    setWs(socket)

    // Optional: listen to messages
    socket.onmessage = (event) => {
      console.log('Message received:', event.data)
    }

    // Clean up on unmount or page unload
    const handleUnload = () => {
      socket.close()
    }

    window.addEventListener('beforeunload', handleUnload)

    return () => {
      socket.close()
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [url])

  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Public */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />

        {/* Protected */}
        <Route
          path='/*'
          element={
            <ProtectedRoute>
              <Sidebar />  {/* Sidebar renders entire protected app with its own routes inside */}
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path='*' element={isLoggedIn() ? <Navigate to='/' replace /> : <Navigate to='/login' replace />} />
        </Routes>
    </Suspense>

    
  )
}

export default RouteF
