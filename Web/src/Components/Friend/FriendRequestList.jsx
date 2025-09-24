const FriendRequestList = ({ friendRequests }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lời mời kết bạn</h2>
        <button className="text-blue-600 hover:underline">Xem tất cả</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {friendRequests.map((f) => (
          <div
            key={f.id}
            className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm"
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {f.img ? (
                <img
                  src={f.img}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-6xl">👤</div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-sm">{f.name}</h3>
              <p className="text-xs text-gray-500">{f.mutual} bạn chung</p>
              <div className="mt-2 space-y-2">
                <button className="w-full bg-blue-600 text-white text-sm py-1.5 rounded hover:bg-blue-700">
                  Xác nhận
                </button>
                <button className="w-full bg-gray-200 text-sm py-1.5 rounded hover:bg-gray-300">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequestList;
