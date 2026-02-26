import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
          Find Your <span className="text-blue-600">Dream Job</span> Today
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with top companies and talented professionals.
          Your career journey starts here.
        </p>

        <div className="mt-8 flex justify-center gap-6">
          <Link
            to="/jobs"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Browse Jobs
          </Link>

          <Link
            to="/register"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">

          <div>
            <h3 className="text-xl font-semibold mb-4">For Job Seekers</h3>
            <p className="text-gray-600">
              Search jobs, upload resumes, and track application status easily.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">For Recruiters</h3>
            <p className="text-gray-600">
              Post jobs, manage applicants, and hire the best talent.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Admin Control</h3>
            <p className="text-gray-600">
              Secure and manage the entire platform efficiently.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;