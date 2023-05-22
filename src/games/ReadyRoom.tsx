

import { useEffect, useRef, useState, useContext } from "react";
import  { useNavigate} from "react-router-dom";
import {w3cwebsocket as W3CWebsocket} from "websocket"; // npm install websocket THEN npm i @types/websocket
import MyContext from "../ProviderComp"
import axios from "axios";


export default function ReadyRoom(){
    const context =  useContext(MyContext)
    const navigate = useNavigate()
    const room_name = 1
    const username = localStorage.getItem("username")
    const readyRoomClient =  new W3CWebsocket(`${context.restWs}/ws/quickstart/readyRoom/`)

    
    useEffect(()=>{
        readyRoomClient.onopen=()=>{
            console.log("ready checks")
            readyRoomClient.send(JSON.stringify({
                                command: "readyCheck",
                                meReady: username
                                }))
        }

        readyRoomClient.onmessage=(data:any)=>{
            data = JSON.parse(data.data)
            console.log("ready checks data", data)
            if(data["action_type"]==="readyCheck"){
                if(data["playerA"]===username){
                    localStorage.setItem("partner",data["playerB"])
                    navigate("/gameone/?mode=ctlmode")
                }
                else if(data["playerB"]===username){
                    localStorage.setItem("partner",data["playerA"])
                    navigate("/gameone/?mode=viewmode")
                }
            }
        }
        


    },[])


  

    return(<>
    <div className=" border-2 border-x-amber-200 w-full">
        <div className=" m-auto">
        En attente d'un autre joueur....
        </div>

        

    </div>
    
    </>)

}