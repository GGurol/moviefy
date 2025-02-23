import { FaSpinner } from "react-icons/fa";

function Submit({ value, busy, type, onClick }) {
  return (
    <button
      type={type || "submit"}
      onClick={onClick}
      className="w-full rounded  hover:bg-opacity-90 transition dark:text-secondary text-white font-semibold text-lg h-10 flex items-center justify-center cursor-pointer"
    >
      {busy ? <FaSpinner className="animate-spin" /> : value}
    </button>
  );
}

export default Submit;
