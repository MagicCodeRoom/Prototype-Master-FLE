import { useEffect, useState } from "react"
import quiztxt from "../ComComp/quiztxt"
import { json } from "stream/consumers"
import { useNavigate } from "react-router-dom"
import { randomInt } from "crypto"






function Quiz(){
    const naviate = useNavigate()
    const [looper, setLooper] = useState(36)

    const handleNext=()=>{
        
        if(looper === Object.keys(quiztxt).length){
            console.log("done")
            naviate("/login")
        }
        setLooper(looper+1)
    }

    return (
        <div className="  border-1 border-x-amber-200 w-full pr-5 pl-5 ">
            <div className="mb-10 font-bold">question:{looper}</div>
        <div className="mb-10 ">
            <div className=" flex-col align-content: center mb-10">
            .
            <div className=" mb-10">
                {quiztxt[JSON.stringify(looper)].ch}

            </div>
            <div className=" mb-10">
            {quiztxt[JSON.stringify(looper)].fr}
            </div>

            <div className="">
            {looper <=35? 
                <>
                <div className="align-content: center m-auto" >

                <input style={{accentColor:"#81f427", marginLeft:"40px", marginRight:"30px",height:"30px", width:"30px"}} type="radio" key={Math.random()} name="drone" value="1" />
                <input style={{accentColor:"#f9eb74", marginRight:"30px",height:"30px", width:"30px"}} type="radio" key={Math.random()} name="drone" value="2" />
                <input style={{accentColor:"#f4c20a", marginRight:"30px",height:"30px", width:"30px"}} type="radio" key={Math.random()} name="drone" value="3" />
                <input style={{accentColor:"#f06d06", marginRight:"30px",height:"30px", width:"30px"}} type="radio" key={Math.random()} name="drone" value="4" />
                <input style={{accentColor:"#fc1700", marginRight:"30px",height:"30px", width:"30px"}} type="radio" key={Math.random()} name="drone" value="5" />

                </div>
                <div className="w-full flow-root ">
                <div className=" float-left">{quiztxt[JSON.stringify(looper)].left}</div>
                <div className=" float-right">{quiztxt[JSON.stringify(looper)].right}</div>

                </div>
                </>
            
            :
            <input type="texte" style={{width:"400px",height:"80px"}}    ></input>
            }

            </div>
            </div>
            
            
        <button className=" w-80 ml-5 mr-5" onClick={handleNext} style={{backgroundColor:"#06b4f0"}}>{looper <=35? "question suivante":"valider"}</button>
       
       
        </div>

        

    </div>
    )
}
export default Quiz;