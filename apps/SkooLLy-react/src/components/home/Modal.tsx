import { useState } from "react";

type ModalProps = {
  title: string;
  content: string;
  closeButtonText?: string;
  confirmButtonText?: string;
};

export const Modal = ({title, content, closeButtonText="Close", confirmButtonText="OK"}: ModalProps) => {
  const [showModal, setShowModal] = useState(true);

  if(!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={() => setShowModal(false)}
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2
          id="modalTitle"
          className="text-xl font-bold text-gray-900 sm:text-2xl"
        >
          {title}
        </h2>

        <div className="mt-4">
          <p className="text-pretty text-gray-700">
            {content}
          </p>
        </div>

        <footer className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setShowModal(false)}
            type="button"
            className="rounded cursor-pointer bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            {closeButtonText}
          </button>

          <button
           onClick={() => setShowModal(false)}
            type="button"
            className="rounded cursor-pointer bg-blue-950/80 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {confirmButtonText}
          </button>
        </footer>
      </div>
    </div>
  );
};
