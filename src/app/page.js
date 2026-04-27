import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">

      {/* Hero Section */}
      <div className="max-w-3xl mx-auto">
        <span className="text-6xl mb-6 block">📋</span>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Meeting Notes &{' '}
          <span className="text-indigo-600">Task Manager</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8 max-w-xl mx-auto">
          Capture meeting notes, assign tasks to your team,
          set deadlines, and track progress — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-md"
          >
            Go to Dashboard →
          </Link>
          <Link
            href="/auth"
            className="bg-white text-indigo-600 border border-indigo-200 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-colors duration-200"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      {/* Feature Pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-12">
        {[
          '✅ Create Meeting Notes',
          '👥 Assign Tasks',
          '📅 Set Deadlines',
          '📊 Track Progress',
        ].map((feature) => (
          <span
            key={feature}
            className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
          >
            {feature}
          </span>
        ))}
      </div>

    </div>
  );
}