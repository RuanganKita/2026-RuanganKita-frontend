interface DashboardHeaderProps {
  title: string;
  username: string;
  onLogout: () => void;
}

export default function DashboardHeader({ title, username, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">Welcome, {username}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
