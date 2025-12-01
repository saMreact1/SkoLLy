import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type ProgressProps = {
  color: string;
  label: string;
  percentage: number;
  remark: string;
};

const AnalyticsProgressCard = ({
  color,
  label = "",
  percentage,
  remark,
}: ProgressProps) => {
  return (
    <div className="flex flex-col px-4 space-y-4 items-center justify-center h-full">
      <div>
        <h3 className="text-md font-bold">{label}</h3>
      </div>
      <div className="flex items-center">
        {/* <p className="text-sm sm:hidden md:hidden lg:block">
                      Your attendance rate is looking good keep it up!
                    </p> */}
        <div className="w-25 h-25 rounded-full">
          <CircularProgressbar
            value={percentage}
            text={`${percentage}%`}
            strokeWidth={12}
            styles={buildStyles({
              textColor: "#000000",
              pathColor: color,
              trailColor: "#e2e8f0",
              strokeLinecap: "round",
              textSize: "10px",
            })}
          />
        </div>
      </div>
      <div
        className="flex text-sm items-center font-semibold space-x-2">
        <div 
        style={{ background: color }}
        className="w-5 h-5 rounded-full"></div>
      <span className="font-light">{remark}</span>
    </div>
      </div>
  );
};

export default AnalyticsProgressCard;
