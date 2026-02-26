import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;