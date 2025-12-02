import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { useClasses, useSchools, useStudents } from "../hooks/useStudents";
import { useAuthStore, useClassesStore, useSchoolStore } from "../store/authStore";
import Loader from "../components/shared/Loader";
import toast from "react-hot-toast";
import type { ProfileProps } from "../types/student";

const Profile = () => {
  const { data: user, isLoading, error }  = useStudents();
  const student  = useAuthStore(state => state.user = user?.user)
  const [profileData, setProfileData] = useState<ProfileProps>({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    bio: "",
    tenantId: "",
  });

  const { data: classes, isLoading: classLoading } = useClasses();
  const allClass = useClassesStore((state) => state.classes = classes);

   const { data: schoolInfo, isLoading:schoolInfoLoading } = useSchools();
    const school = useSchoolStore((state) => (state.school = schoolInfo));
  
  console.log(school);


  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (student) {
      setProfileData(student);
    }
  }, [student]);

  if (error) toast.error(error.message);

  if(!student || schoolInfoLoading || classLoading || isLoading) return  <div className="flex items-center justify-center">
          <Loader />
        </div>

  return (
    <div className="w-full flex lg:gap-x-24 lg:p-8 md:flex-col md:space-y-4 md:items-center lg:flex-row lg:justify-center">
      <div className="md:w-8/12 lg:w-4/12 bg-[url('/card-background.svg')] h-[250px] rounded-md relative">
        {/* Id Card */}
        <div className="absolute h-full w-full bg-black/70 rounded-md flex px-2 space-x-2 py-2 shadow-lg">
          <div className="w-2/6 flex flex-col space-y-2 items-center justify-between">
          <img src="/school-logo.png" className="w-15 h-15 rounded-full border-2 border-gray-500" alt="School image" />
          <img className="w-50 h-30 rounded-xl shadow-md shadow-white " src="/user-image.jpg" alt="student image" />
          <p className="text-white font-bold uppercase text-sm">Identity Card</p>
          </div>
          <div className="w-4/6 flex flex-col space-y-4">
          {/* school name */}
            <div className="text-right mr-4">
              <h2 className="text-white font-semibold uppercase text-xl ">{school.name}</h2>
              <p className="text-white text-[9px] font-semibold">(Affiliated with <b>NEC</b>: Nigeria. School Code: {profileData.tenantId})</p>
            </div>
            {/* school info and student info */}
            <div className="w-full bg-white rounded-md h-full flex flex-col shadow-md shadow-white">
              <div className="bg-black/50 w-full px-2 font-bold" >
                <p className="text-[10px]">{`${school.address}, ${school.state} State, Nigeria`}</p>
              </div>
              <div className="flex flex-col w-full items-start px-2 text-[11px] mt-1">
                <p className="flex space-x-1">
                  <span>Student ID: </span>
                  <span className="font-bold">_</span>
                </p>
                <p className="flex space-x-1">
                  <span>Student Name: </span>
                  <span className="font-bold">{profileData.fullName}</span>
                </p>
                <p className="flex space-x-1">
                  <span className="">Class: </span>
                  <span className="font-bold">{allClass?.name}</span>
                </p>
                <p className="flex space-x-1">
                  <span className="">Email: </span>
                  <span className="font-bold">{profileData.email}</span>
                </p>
                <p className="flex space-x-1">
                  <span className="">Phone: </span>
                  <span className="font-bold">{profileData.phone}</span>
                </p>
                <p className="flex space-x-1">
                  <span className="">Gender: </span>
                  <span className="font-bold">{profileData.gender.toUpperCase()}</span>
                </p>
              </div>
            </div>
            {/* signed by principal */}
            <p className="text-white font-bold text-right mr-4">Principal</p>
          </div>
        </div>
      </div>
      {/* Form */}
      <div className="md:w-full lg:w-[700px] bg-white md:h-[480px] rounded-md relative shadow-md">
        <div className="absolute h-full w-full bg-black/10 rounded-md flex justify-center">
          <div className="md:w-[80%] lg:w-[60%] h-full flex flex-col px-2 py-4 space-y-4">
            <h1 className="text-sm font-bold underline uppercase text-center">
              Edit Profile
            </h1>
            <form className="px-4 flex flex-col gap-4">
              <div className="flex justify-between gap-4 items-center">
                <label
                  htmlFor="fullname"
                  className="font-semibold text-xl w-3/6"
                >
                  Full Name:
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={handleValueChange}
                  name="fullName"
                  id="fullname"
                  className="border bg-white rounded-full flex-1 px-3 py-2 font-bold focus:ring-blue-400 active:ring-blue-500"
                />
              </div>
              <div className="flex justify-between gap-4 items-center">
                <label htmlFor="email" className="font-semibold text-xl w-3/6">
                  Email:
                </label>
                <input
                  value={profileData.email}
                  onChange={handleValueChange}
                  type="email"
                  name="email"
                  id="email"
                  className="border bg-white rounded-full flex-1 px-3 py-2 font-bold focus:ring-blue-400 active:ring-blue-500"
                />
              </div>
              <div className="flex justify-between gap-4 items-center">
                <label htmlFor="phone" className="font-semibold text-xl w-3/6">
                  Phone Number:
                </label>
                <input
                  value={profileData.phone}
                  onChange={handleValueChange}
                  type="text"
                  name="phone"
                  id="phone"
                  maxLength={11}
                  className="border bg-white rounded-full flex-1 px-3 py-2 font-bold ring-blue-500 focus:ring-blue-400 active:ring-blue-500"
                />
              </div>
              <div className="flex justify-between gap-4 items-center">
                <label htmlFor="class" className="font-semibold text-xl w-3/6">
                  Class:
                </label>
                <input
                  type="text"
                  name="class"
                  id="class"
                  disabled
                  value="shja"
                  className="border bg-white text-gray-500 rounded-full flex-1 px-3 py-2 font-bold focus:ring-blue-400 active:ring-blue-500"
                />
              </div>
              <div className="flex justify-between gap-4 items-center">
                <label htmlFor="bio" className="font-semibold text-xl w-3/6">
                  Bio:
                </label>
                <input
                  type="text"
                  value={profileData.bio}
                  onChange={handleValueChange}
                  name="bio"
                  id="bio"
                  className="border bg-white text-black rounded-full flex-1 px-3 py-2 font-bold focus:ring-blue-400 active:ring-blue-500"
                />
                {/* <textarea name="phone" id="phone" className="border bg-white rounded-full flex-1 px-3 py-2 font-bold ring-blue-500 focus:ring-blue-400 active:ring-blue-500" rows={2} cols={2}/> */}
              </div>
              <button className=" bg-black text-xl text-white flex mt-8 py-3 px-4 justify-center gap-4 rounded-full hover:cursor-pointer shadow-lg hover:bg-black/80 items-center">
                <p>Update Profile</p>
                <span><FaSave /></span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
