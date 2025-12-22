import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { LoginPageUrl } from "../../utils/helper";
import toast from "react-hot-toast";
import { FaUser } from 'react-icons/fa6'
import { IoMdLogOut } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom';

export default function DropdownMenu({name}: {name: string}) {
  const navigate = useNavigate();
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("authToken");
    localStorage.removeItem("authenticated");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      window.location.replace(LoginPageUrl);
    }, 1000);
  }
  
  return (
    <div className="top-24 w-full text-right">
      <Menu>
        <MenuButton className="inline-flex items-center gap-2 rounded-md bg-transparent px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black data-open:bg-black z-9999">
          {name}
          <ChevronDownIcon className="size-4 fill-white/60" />
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="w-52 origin-top-right rounded-xl border border-black bg-black p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 z-9999"
        >
          {/* <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
              <PencilIcon className="size-4 fill-white/30" />
              Edit
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘E</kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
              <Square2StackIcon className="size-4 fill-white/30" />
              Duplicate
              <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">⌘D</kbd>
            </button>
          </MenuItem> */}
          <div className="my-1 h-px bg-white/5" />
          <MenuItem>
            <button onClick={() => navigate("/profile")} className='rounded-lg px-3 py-1.5 data-focus:bg-white/10 w-full group flex items-center gap-2'>
              <FaUser className="size-4 fill-white/60" />
              Profile
              <kbd className="ml-auto hidden font-sans text-xs text-white/60 group-data-focus:inline">⌘A</kbd>
            </button>
          </MenuItem>
          <MenuItem>
            <button onClick={handleLogout} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
              <IoMdLogOut className="size-4 fill-white/60" />
              Logout
              <kbd className="ml-auto hidden font-sans text-xs text-white/60 group-data-focus:inline">⌘D</kbd>
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}
