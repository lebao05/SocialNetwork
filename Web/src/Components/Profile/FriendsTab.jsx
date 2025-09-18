export default function FriendsTab({ friendsData }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Friends ({friendsData.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {friendsData.map((friend, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <img
                src={friend.img}
                alt={friend.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{friend.name}</p>
                <p className="text-sm text-gray-500">100 mutual friends</p>
              </div>
            </div>
            <button className="flex cursor-pointer items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-600 text-xl font-bold">
              <div className="pb-3">...</div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
