import { FaRegNoteSticky } from "react-icons/fa6";

const Card = ({ subject, description }: any) => {
  return (
    <button className="group relative h-[220px] w-full text-left focus:outline-none">
      <span className="absolute inset-0 border-2 border-dashed border-black rounded-md"></span>

      <div className="relative flex h-full flex-col justify-between border-2 border-black bg-white p-4 transition-all group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:shadow-lg rounded-md">
        <div>
          <FaRegNoteSticky className="text-2xl" />

          <h2 className="mt-4 text-xl font-semibold">
            {subject}
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            {description}
          </p>
        </div>

        <div className="mt-4">
          <span className="inline-block font-bold underline">
            Start Test →
          </span>
        </div>
      </div>
    </button>
  );
};

export default Card;
