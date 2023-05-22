import React, {useRef, useEffect, useState, useContext} from "react";
import  { useSearchParams} from "react-router-dom";
import {w3cwebsocket as W3CWebsocket} from "websocket";
import MyContext from "../../ProviderComp";

interface Props{
    room:W3CWebsocket
}


 const VidCom: React.FC<Props>=(props)=>{

        const context =  useContext(MyContext)
        const localVideoRef: any= useRef <undefined> ()
        const remoteVideoRef: any= useRef <undefined> ()
        const candidates = useRef<RTCIceCandidate[]>([])
        const pc= useRef<RTCPeerConnection>()
        
        const [group_id, setGroupId] = useState(1) // voir ce que je fais avec cela !!!!!!!!!!!!!!
        const [incomingCall, setIncominCall] = useState(false)
        const [callFrom, setCallFrom] = useState("No one")
        const [ssNames, setSsNames] = useState<string[]>(["one","two", "three"])
    
        const my_username = localStorage.getItem("username")
        const my_class_number = 1 //localStorage.getItem("class_number")
        const partner = localStorage.getItem("partner")
        const my_class_id = localStorage.getItem("class_number")
        // setSsNames(["one","two"])/
        const [searchParams, setSearchParams] = useSearchParams();
        let params = searchParams.get("mode")


        // const my_username = params==="ctlmode"?"one":"two";
        // const my_class_number = 1
        // const my_class_id = 1
    
      
    
        
        // const privateRoomClient =  props.room
        const privateRoomClient =  new W3CWebsocket(`${context.restWs}/ws/quickstart/${2}/`)
 
        
        useEffect(()=>{

       
            
            const _pc= new RTCPeerConnection() // null ? undefined ?
    
            _pc.onicecandidate =(e: RTCPeerConnectionIceEvent)=>{
                console.log("on ice candidate1", e.candidate)
                if(e.candidate && e.candidate != null){
                    console.log("on ice candidate2 passed for", e.candidate)
                    candidates.current.push(e.candidate)
                    }
                }
                //"oniceconnectstatechange <= before 
            _pc.oniceconnectionstatechange=(e: Event)=>{
                console.log("state chage")
                // connected, disconnected, failed, closed
                console.log("oniceconnectstatechange", e)
                }
            _pc.ontrack =(e:RTCTrackEvent)=>{
                console.log('on track')
                // we got remote stream...
                remoteVideoRef.current.srcObject = e.streams[0]
                }
            
            pc.current = _pc


            console.log("calling useffect ws")
            if(params ==="ctlmode"){
                makeOffer()
            }
          
    
        }, [])
    

                privateRoomClient.onopen=()=>{
            
                }

            privateRoomClient.onmessage=(data:any)=>{
                data = JSON.parse(data.data)
                
                let action_type = data["action_type"]
                let sdp = data["sdp_offer"]
               
                
                if(data["action_type"]==="offer_out"){
                    let callFrom = data["offer_from"]
                    let offer_for = data["offer_out_for"] 
                    let from_class = data.class_number
                    if(from_class ===my_class_number && offer_for === my_username){
                        
                        // offer for me
                        console.log("offer for me")
                        setIncominCall(true) // ne pas oublier de tourner off quand call ends !!!
                        setCallFrom(callFrom)
                        // offer receiver sets the remote description
                        if(pc.current!==undefined){
    
                            pc.current.setRemoteDescription(new RTCSessionDescription(sdp))
                        }
                        if(params==="viewmode"){

                            answerCall()
                        }
                    }
    
    
                }else if(data["action_type"]==="handle_answer_out"){
                    console.log("answer out", data)
                    let anseringTo = data["answeringTo"]
                    let class_number = data["class_number"]
                    let sdp = data["sdp"]
                    if(anseringTo === my_username && class_number === my_class_number){
                        console.log("answer to me", sdp)
                        // answer to me  // need to test all this below
                        if(pc.current){
                        pc.current.setRemoteDescription(new RTCSessionDescription(sdp))
                        }
                        console.log("passed pc.current", candidates.current)
                        privateRoomClient.send(JSON.stringify({
                            command:"sendIce",
                            candidates: candidates,
                            IceFor: partner,
                        }))
                        }else{
                            // answer not for me
                            console.log("answer not for me")
                        }
                        
                }else if(action_type==="ice_out" && (my_username === "two"||"one")){
                    console.log("ice out", data)
                    var candidatesList = data["candidates"]
                    console.log("two ?", data["ice_for"])
                    console.log('candidatesList',candidatesList.current[0])
                    // the answerer receives ICE and sets it
                    if(pc.current!==undefined){
                    pc.current.addIceCandidate(new RTCIceCandidate(candidatesList.current[0]))
                    }
                
    
                }
            
            }

            

        const makeOffer=()=>{
            // on vient de retirer le e du click 
            console.log("making foffer")
            const constraints= {
                // audio: true,
                video: true,
              }
             
            navigator.mediaDevices.getUserMedia(constraints)
            .then(stream=>{
    
                localVideoRef.current.srcObject = stream
                stream.getTracks().forEach(track=>{
                if(pc.current!==undefined){
                  pc.current.addTrack(track, stream)
                }
                })
                    if(pc.current !==undefined){
                        pc.current.createOffer({
                            // offerToReceiveAudio:true,//optional
                            offerToReceiveVideo:true, //optional
                        }).then(sdp=>{
                            if(pc.current!==undefined){
                                pc.current.setLocalDescription(sdp) 
                            }
                            console.log("sending offer")
                            privateRoomClient.send(JSON.stringify({
                                command:"offer",
                                offerFor: partner, // !! mocking coz ss_pair.guider has issues = undefined 
                                offerFrom: my_username, //localStorage.getItem("username"),
                                class_number: 1, //localStorage.getItem("class_number"),
                                sdp:sdp,}))
                        }).catch(errSDP=>{ console.log("errSDP", errSDP)}) 
                    }


                }).catch(e=>{console.log('media err', e)})
        }
    
    



         
        const answerCall=()=>{
            console.log("))))))))))))")
            const constraints= {
                // audio: true,
                video: true,
            }
            navigator.mediaDevices.getUserMedia(constraints)
            .then(stream=>{
                // assign the stream to the video object
                localVideoRef.current.srcObject = stream
                stream.getTracks().forEach(track=>{
                    if(pc.current!==undefined){
                        pc.current.addTrack(track, stream)
                    }
                })
                if(pc.current!==undefined){
                    
                    pc.current.createAnswer({
                        // offerToReceiveAudio:true,//optional
                        offerToReceiveVideo:true, //optional
                    }).then(sdp=>{
                        
                        if(pc.current!==undefined){
                            
                            pc.current.setLocalDescription(sdp) 
                        }
                        privateRoomClient.send(JSON.stringify({
                            command: "answerOffer",
                            userAnswering: my_username,//localStorage.getItem("username"),
                            answeringTo: partner, // ss_pair.player,
                            class_number: 1,//localStorage.getItem("class_number"),
                            sdp: sdp,
                        }))
                    }).catch(errSDP=>{ console.log("errSDP", errSDP)})
                }
              }).catch(e=>{ console.log('media err', e)})
        }

        
    
        return(
            <div className=" w-full text-center ">
    
           
                    <div className="flex place-content-between">


                        <div className="flex flex-col">
                        <video ref={localVideoRef} className=" w-20 h-16 mr-5 bg-orange-400" autoPlay/>       
                         </div>

                        

                        <div className="flex flex-col">
                        <video ref={remoteVideoRef} className=" w-20 h-16 mr-5 bg-slate-400" autoPlay/>
                        </div>
    
                    
                    </div>
                

                <div>
               
    
                </div>
               
            
            </div>
        )
    }
    
    export default VidCom;