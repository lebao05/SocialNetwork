export default function FollowingTab({ followingData }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Followings ({followingData.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {followingData.map((u, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <img
                src={u.img}
                alt={u.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{u.name}</p>
                <p className="text-sm text-gray-500">100 mutual friends</p>
              </div>
            </div>

            {/* Right side - Add Friend button */}
            <button className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition">
              Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
