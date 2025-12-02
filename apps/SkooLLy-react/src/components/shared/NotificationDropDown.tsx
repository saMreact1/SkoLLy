import type { Notification } from "../../types/student";

type Props = {
  notifications: Notification[];
};

const NotificationDropDown = ({ notifications }: Props) => {
  return (
    <div className="space-y-3">
      {notifications.map((notification, idx) => (
        <details
          key={idx}
          className="group border-2 border-black shadow-[4px_4px_0_0] [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-4 bg-black px-4 py-3 font-medium text-white hover:bg-transparent focus:bg-black focus:outline-0">
            <span className="font-semibold">{notification.title}</span>

            <svg
              className="size-5 shrink-0 group-open:-rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div className="border-t-2 border-black p-4">
            <p className="text-slate-400">{notification.content}</p>
          </div>

          <div className="w-full flex items-end justify-end space-x-2">
            <a
              className="border-2 border-black bg-black px-2 py-2 font-semibold text-white shadow-sm shadow-white hover:bg-gray-300 hover:shadow-none hover:text-black focus:ring-2 focus:ring-blue-300 focus:outline-0 rounded-full mb-2"
              href="#"
            >
              Mark as seen
            </a>
          </div>
        </details>
      ))}
    </div>
  );
};

export default NotificationDropDown;
