export default function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'in progress': 'bg-blue-100 text-blue-700 border-blue-200',
    done: 'bg-green-100 text-green-700 border-green-200',
  };

  const labels = {
    pending: '⏳ Pending',
    'in progress': '🔄 In Progress',
    done: '✅ Done',
  };

  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}