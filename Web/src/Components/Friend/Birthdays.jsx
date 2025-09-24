const Birthdays = ({ sampleBirthdays }) => {
  return (
    <div className="mt-6 w-full">
      <h3 className="text-lg font-semibold mb-2">Birthdays</h3>
      <ul className="space-y-3">
        {sampleBirthdays.map((b) => (
          <li
            key={b.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <img
              src={b.avatar}
              alt={b.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-gray-500">{b.birthday}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Birthdays;
