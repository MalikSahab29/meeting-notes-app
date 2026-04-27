export default function StatCard({ title, value, icon, color }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <span className={`text-2xl p-2 rounded-xl ${colorMap[color]}`}>
          {icon}
        </span>
      </div>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );
}