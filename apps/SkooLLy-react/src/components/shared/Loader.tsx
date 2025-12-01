// import type { CSSProperties } from "react";
import {  GridLoader } from "react-spinners";

// const override: CSSProperties = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
// };

const Loader = () => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#dcdcdc]">
        <GridLoader />
    </div>
  )
}

export default Loader