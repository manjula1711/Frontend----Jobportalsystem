const JobCard = ({ job, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <h2 className="text-lg font-semibold">
        {job.title}
      </h2>

      <p className="text-blue-600 text-sm mt-1">
        {job.companyName}
      </p>

      <p className="text-gray-500 text-sm mt-1">
        {job.location}
      </p>

      <div className="flex justify-between mt-3">
        <span className="text-green-600 font-semibold text-sm">
          {job.salary}
        </span>

        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
          {job.type}
        </span>
      </div>
    </div>
  );
};

export default JobCard;