import { useNavigate } from "react-router-dom";

const JobModal = ({ job, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold">
          {job.title}
        </h2>

        <p className="text-blue-600 mt-1">
          {job.companyName}
        </p>

        <p className="text-gray-500 mt-1">
          {job.location} • {job.type}
        </p>

        <p className="text-green-600 font-semibold mt-3">
          {job.salary}
        </p>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">
            Job Description
          </h3>
          <p className="text-gray-700">
            {job.description || "No description provided."}
          </p>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => navigate(`/apply/${job.id}`)}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobModal;