
import React, { useRef, useContext, useState} from "react";
import  { useNavigate} from "react-router-dom";
// import LoginMeca from "../Meca/LoginMeca";
import axios from "axios";
import MyContext from "../ProviderComp";
import auth from "../auth";
//





function LoginView(){
    const context = useContext(MyContext)
    const usernameRef = useRef()
    const passwordRef = useRef()
    const selectClassRef = useRef()
    const [registered, setregistered] = useState(true)
    const navigate = useNavigate()
    // on va changer regsiter ma après quand on aura le localstorage en place
    
    const registerUser =(e)=>{
        e.preventDefault();
        let class_number = selectClassRef.current.value
        console.log("test number", class_number)
        axios.post(`${context.restApiHttp}/createuser/`,{
            "username": usernameRef.current.value,
            "password": passwordRef.current.value,
            "user_type":1,
            "class_number": class_number
        })
        .then(answer=>{
            console.log("credentials found", answer)
            setregistered(!registered)
        }).catch(err=>{
            console.log("credentials not found", err)
        })
    }
    
    const loginUser =(e)=>{
        e.preventDefault()
        console.log("trying to log in")
        axios.post(`${context.restApiHttp}/login/`,{
            "username": usernameRef.current.value,
            "password": passwordRef.current.value,
        })
        .then(answer=>{
            var data = answer.data
            // console.log("class_number",data)
            // class number is needed to contact the right groupd with sockets
            localStorage.setItem("class_number",data.user["class_number"] )
            localStorage.setItem("username", data.user["username"])
            localStorage.setItem("token", data.token)
            console.log("credentials found", data)

            
            auth.login(()=>{
                if(data.user["user_type"]===1){
                    navigate("/readyroom")
                }else if(data.user["user_type"]===0){
                    console.log("usertype")
                    navigate("/ftpage")
                }
                
            })
            
        }).catch(err=>{
            console.log("credentials not found", err)
        })

    }

    const classSelector = (registeredState)=>{
        switch(registeredState){
            case false:
                return (      
                <div className="flex flex-col text-gray-400 py-2">
                    <label>class number</label>
                    <select ref={selectClassRef} required="true"  id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option disabled selected value="">-- Select Class Number--</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </div>)
            case true:
                return <br/>
            default:
                break;
        }
    }

    return(
        <div >
                <form onSubmit={registered===true?loginUser:registerUser} className=" border border-sky-500 max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 rounded-lg ">
                    <h2 className="text-4l text-white font-bold text-center">{registered===true?"Log In":"Register"}</h2>
                    <div className="flex flex-col text-gray-400 py-2">
                        <label>username</label>
                        <input className=" text-black rounded pl-2" ref={usernameRef} type="text" required defaultValue={"one"}></input>
                    </div>
                    {classSelector(registered)}
                    <div className="flex flex-col text-gray-400 py-2">
                        <label>password</label>
                        <input className=" text-black rounded pl-2"  ref={passwordRef} type="password" required defaultValue={"one"}></input>
                        
                    </div>
                    <button className="text-white text-2xl">{registered===true?"Log In":"Register"}</button>
                    <br/>
                    <button className=" text-gray-500" onClick={ ()=>setregistered(!registered)}><i>{registered===true?"Register first":"go to login"}</i></button>
                </form>
            </div>
            
    )
}

export default LoginView;