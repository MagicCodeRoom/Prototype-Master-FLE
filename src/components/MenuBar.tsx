import { useNavigate } from "react-router-dom"
import {FaDiceSix,FaDiceFive,FaDiceFour} from "react-icons/fa";
    // FaDiceFive,FaDiceFour, FaBitcoin, FaFireAlt , FaGoogleDrive, FaHornbill, FaSignOutAlt, FaPlayCircle} from "react-icons/fa";





type Props={
    icon:any,
    text: string,
}



const MenuBar=()=>{
    const navigate = useNavigate();

    const handleGameOne=()=>{
        navigate("/gameOne")
    }


    return (
        <div className=" fixed top-0 
        left-0 w-screen h-16 m-0 flex 
        bg-gray-900 text-white shadow-lg text-cyan-600">
                <NavBarIcon text="x" icon={<FaDiceSix onClick={handleGameOne} size="28" />} />
                <NavBarIcon text="x" icon={<FaDiceFive onClick={handleGameOne} size="28" />} />
                <NavBarIcon text="x" icon={<FaDiceFour onClick={handleGameOne} size="28" />} />


            
        </div>
    )
}


const NavBarIcon: React.FC<Props> =({icon, text="tooltip"})=>(
    // sidebar-icon is a customed class , built up using tailwind utilities (option if needed)
    <div className="sidebar-icon group" > 
        {icon}
        <span className="sidebar-tooltip group-hover:scale-100">
            {text}
        </span>
    </div>

)

export default MenuBar;