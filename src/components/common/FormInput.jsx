import { FaEye, FaEyeSlash } from "react-icons/fa";

const FormInput = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  showToggle,
  isVisible,
  onToggle,
}) => {
  return (
    <div>
      <div className="relative">
        <input
          type={isVisible ? "text" : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full border rounded-lg px-4 py-2 pr-10 focus:ring-2 outline-none ${
            error
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-500"
          }`}
        />

        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {isVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;