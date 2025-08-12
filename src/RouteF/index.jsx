// import React, {lazy, Suspense, useEffect } from 'react'
// import { Route, Routes as Switch} from 'react-router-dom'
// import {actionsApi, isUnAuthorize} from "../shared";
// import { useDispatch, useSelector } from 'react-redux'
// import { Login } from '../pages/Login'
// // const Entry = lazy(() => import('../pages/index.jsx'))
// import Entry from "../pages/Sidebar"
// import { SyncOutlined } from '@ant-design/icons';
// import { Image, Space } from 'antd';

import { Sidebar } from "../pages"


// import { ForgotPassword } from '../pages';
const  RouteF = () => {  

  // const dispatch=useDispatch()
  // const {isLogin, loading}= useSelector(state => state?.loginCheck)
  // useEffect(()=>{ 
  //   if(isUnAuthorize())
  //     dispatch(actionsApi?.loginCheckResponse(false))
  //   else 
  //     dispatch(actionsApi?.authCheck()) 
  // },[])     
  // const Fallback = () => (
  //   <div className='center' style={{height: '100vh',width: '100%'}}>
  //     <Space direction='vertical' align='center' style={{justifyContent:"center",height:'100%',width: '100%'}}>
  //         <Image
  //           style={{ width: '200px'}}
  //           src= {"/assets/images/logo.png"}
  //           alt='jusoor Admin Panel'
  //           preview={false}
  //         /> 
  //       <SyncOutlined  spin style={{color:'var(--second-color)',fontSize: '35px'}}/>
  //     </Space>
  //   </div>
  // )
  return (
    <>
      {/* <Suspense fallback={<Fallback />}>
        <Switch>
          <Route
            path="/forgotpassword"
            element={<ForgotPassword />}
          />
          {loading ? (
            <Route
              path="/*"
              element={<Fallback />}
            />
          ) : (
            !isLogin ? (
              <Route
                path="/*"
                element={<Login />}
              />
            ) : (
              <Route
                path="/*"
                element={<Entry />}
              />
            )
          )}
        </Switch>
      </Suspense>
        
       */}
       <Sidebar />
    </>
  )
}
export default RouteF