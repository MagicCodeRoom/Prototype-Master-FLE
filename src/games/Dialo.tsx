
import { useEffect, useRef, useState } from "react"
import ntrinsicAttributes from "react";
import { DialA } from "../data/DialA"
import Character  from "./Character"

interface Props {
    dial_stater: boolean

  }



const Dialo: React.FC<Props> = (props) => {



    const starter= props.dial_stater;
    const prevStarter = usePrevious(starter)

    // custom hook usePrevious
    function usePrevious(value:any){
        const ref = useRef();
        useEffect(()=>{
            ref.current = value;
        }, [value]);
        return ref.current
    }

    useEffect(()=>{
        if(starter === true){ 
            console.log("interaction!!!22222222222")
        }

    },[starter, prevStarter] )

    const handleTester=()=>{
        console.log(`working!!!!!! ${starter} and ${starter}`)
    }


    useEffect(()=>{
        console.log("print in dial")
    },[])

    return(
        <div>

            <div style={{position: "absolute", display:"flex", flexDirection:"column", alignItems:"center",top:50, left:50, borderRadius:5, zIndex: 4, width:400, height:100, background:"white", color:"black"}}>
                <div>
                {DialA["npcExplorer"][1].text}
                </div>
                <div>
                {DialA["npcExplorer"][1].trans}
                </div>
                <button 
                onClick={handleTester}
                style={{background:"white", width:50, height:50}}>
                    tester
            </button >

            </div>
        
        </div>
    )
}

export default Dialo;
