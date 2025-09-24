const FriendSuggestions = ({ sampleSuggestions }) => {
  return (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-semibold mb-2">People You May Know</h3>
      <ul className="space-y-3">
        {sampleSuggestions.map((sug) => (
          <li
            key={sug.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <img
              src={sug.avatar}
              alt={sug.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium">{sug.name}</p>
              <p className="text-sm text-gray-500">
                {sug.mutual} mutual friends
              </p>
            </div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
              Add Friend
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendSuggestions;
