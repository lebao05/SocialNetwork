const FriendRequests = ({ sampleFriendRequests }) => {
  return (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
      <ul className="space-y-3">
        {sampleFriendRequests.length > 0 ? (
          sampleFriendRequests.map((req) => (
            <li
              key={req.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={req.avatar}
                alt={req.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium">{req.name}</p>
                <p className="text-sm text-gray-500">
                  {req.mutual} mutual friends · {req.date}
                </p>
              </div>
              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
                Confirm
              </button>
              <button className="px-3 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400">
                Delete
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No new requests</p>
        )}
      </ul>
    </div>
  );
};

export default FriendRequests;
