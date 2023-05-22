import { useEffect } from "react"


interface Props{
    ans:any
}



const AnswerBox: React.FC<Props>=(props)=>{
    const dialing = props.ans
    console.log("diall true", dialing)
    const triggerMe:()=>void =()=>{
        console.log("trigger me")
    }

    useEffect(()=>{

            console.log("diall true")



    },[])


    return(
        <div className=" w-56 h-72 bg-green-300 ">
            anser
        </div>
    )
}
export default AnswerBox;