import React from 'react';
import './App.css';
import {useRef, useEffect, useState} from "react";
import  { useNavigate, Routes, Route } from "react-router-dom";
import MenuBar from './components/MenuBar';
import GameOne from './games/GameOne';
import MyContext from "./ProviderComp";
import LoginView from "./SSpage/LogRegView";
import ReadyRoom from './games/ReadyRoom';
import Quiz from "./components/ComComp/Quiz"




function App() {
  const navigate = useNavigate()

     //////PRODUCTION

     const [serverPath,setServerPath] = useState({
      restWs: "ws://127.0.0.1:8000",
      restApiHttp: "http://127.0.0.1:8000",
      reactApi: "http://127.0.0.1:3000",
  });
  
      //LIVE

 
      // const [serverPath,setServerPath] = useState({
      //     restWs: "wss://192.168.31.182:8443", 
      //     restApiHttp: "https://192.168.31.182:8443",
      //     reactApi: "https://192.168.31.182:9001",
      // });

  return (
    <MyContext.Provider value={serverPath}>
      <>
          <div>
            {/* <MenuBar /> */}
          </div>
          <div className="flex flex-col min-h-screen min-w-screen bg-pink-500 justify-center">
          <Routes>
            <Route path="/login" element={<LoginView/>}/>
            <Route path="/readyroom" element={<ReadyRoom/>}/>

            <Route path="/gameOne" element={<GameOne/>}/>
            <Route path="/quiz" element={<Quiz/>}/>
          </Routes>
        </div>
      </>

    </MyContext.Provider>
  );
}

export default App;
