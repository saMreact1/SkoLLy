import { useState } from "react";

const Announcement = ({ text, link }: { text: string; link: string }) => {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="animate-pulse flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-2 text-gray-900 shadow-lg">
      <span></span>

      <p className="text-center font-medium">
        {text}
        <a href="#" className="inline-block underline">
          {" "}
          {link}{" "}
        </a>
      </p>

      <button
        onClick={() => setShow(false)}
        type="button"
        aria-label="Dismiss"
        className="rounded border border-gray-300 bg-white p-1.5 shadow-sm transition-colors hover:bg-gray-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeWidth="round"
            d="M6 18 18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Announcement;
