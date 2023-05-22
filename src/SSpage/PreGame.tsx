

import { useEffect, useRef, useState, useContext } from "react";
import  { useNavigate} from "react-router-dom";
import {w3cwebsocket as W3CWebsocket} from "websocket"; // npm install websocket THEN npm i @types/websocket
import MyContext from "../ProviderComp";
import axios from "axios";


export default function PreGame(){
    const context =  useContext(MyContext)
    const navigate = useNavigate()
    const room_name = 1
    const classRoomClient =  new W3CWebsocket(`${context.restWs}/ws/quickstart/${room_name}/`)
    const handleStartGame=()=>{
        navigate("/gameone")
    }

    const handleWs =()=>{


        console.log('handle ws ft', room_name)
        classRoomClient.onopen=()=>{
            console.log('connecting')
            classRoomClient.send(JSON.stringify({
                    command: "matchSS",
                    class_group : room_name,      
            }))
        }

        classRoomClient.onmessage=(data)=>{
            console.log('connecting2')
            // data = JSON.parse(data.data)
            console.log('ft connections', data)
           
        }
    }

    const handleTester=()=>{
        console.log("whhyyy????")
        classRoomClient.send(JSON.stringify({
            command: "tester",
            data: "hallo",
            msg_for: "two",
            }))
    }



  

    return(<>
    <div>
        this is pre game page
        <button className=" w-20 h-10 text-sm rounded border-4 border-stone-700 bg-red-600" onClick={handleStartGame}>start game</button>
        <button className=" w-20 h-10 text-sm rounded border-4 border-stone-700 bg-red-600" onClick={handleWs}>start ws</button>
        <button className=" w-20 h-10 text-sm rounded border-4 border-stone-700 bg-red-600" onClick={handleTester}>tester</button>

    </div>
    
    </>)

}