import { FaSearch } from "react-icons/fa"
// import { IoIosArrowDown } from "react-icons/io";
import { useLocation } from "react-router-dom";


import type { UserProps } from "../../types/student";
import { useNotifications } from "../../hooks/useStudents";
import { useNotificationStore } from "../../store/authStore";
import { useState } from "react";
import NotificationDropDown from "./NotificationDropDown";
import DropdownMenu from "./DropdownMenu";


const HeaderBar = ({...user}: UserProps) => {
  const pathname = useLocation().pathname; 
  const [showNotification, setShowNotification] = useState(false);
   const {
      data: notifications,
    } = useNotifications();
  
    const allNotifications = useNotificationStore(
      (state) => (state.notification = notifications)
    );
    const handleOnClick = () => {
      setShowNotification(!showNotification);
    }

  return (
    <div 
    className="bg-black py-2 px-8 fixed w-[92%] bottom-0 top-0 left-45 h-15 rounded-b-l-sm z-9999">
      <div className="flex justify-around items-center">
        <div className="flex relative items-center">
          <input 
          autoFocus
          className="text-xl text-slate-700 bg-slate-100 rounded-full lg:px-3 lg:py-2 md:py-1 focus:outline-none focus:ring-2 focus:ring-slate-400 md:px-2 md:text-sm"
          placeholder="Search"
          type="text" name="" id="" 
          maxLength={18}
          />
          <div className="bg-slate-100 px-2 py-1 rounded-full absolute right-1 hover:bg-slate-300 text-center ml-1 md:px-1 md:py-0.5">
            <FaSearch className="ml-2 mt-1 text-slate-700 hover:cursor-pointer md:mt-0 md:ml-1"/>
          </div>
        </div>
        {/* breadcrumbs */}
        <div className="text-slate-200 font-medium text-lg md:text-sm">
         <span className="text-slate-400">Dashboard /</span> 
         {" "} 
          {pathname === "/" ? " Home" : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)}
        </div>

        {/* notifications */}
        <div
        className="bg-slate-950/70 lg:px-2 lg:py-2 rounded-full hover:bg-slate-700 md:px-2 md:py-1 cursor-pointer flex items-center space-x-4">
          <div  onClick={handleOnClick}  className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="md:h-4 md:w-4 h-6 w-6 text-slate-100 hover:cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center md:w-3 md:h-3 md:top-0 md:-right-3">
              <span className="text-white text-xs font-bold">{allNotifications?.length}</span>
            </div>
          </div>
           {/* dropdown */}
          { showNotification && (<></>
            // <div className="absolute z-9999 top-25 right-60 w-[350px] bg-black px-4 py-4 rounded-md transition-all duration-2000 -mt-10 shadow-lg ease-in-out">
            //   <NotificationDropDown notifications={allNotifications}/>
            // </div>
          ) }
         
        </div>
        {/* profile */}
        <div className="bg-black px-2 text-slate-100 py-2 md:py-1 rounded-full hover:bg-black hover:text-black cursor-pointer">
          <div className="flex items-center">
            <img src="/school-logo.png" 
            className="rounded-full w-10 h-10 inline-block mr-2 md:size-8"
            alt="profile image" />
            {/* <span className="font-medium text-lg md:text-sm">{user.user?.fullName}</span>
            <IoIosArrowDown className="md:text-sm"/>  */}
            
            <DropdownMenu name={user.user?.fullName} />
          </div>

         
        </div>
        
      </div>
      <hr className="my-2 border-slate-400/30"/>
    </div>
  )
}

export default HeaderBar