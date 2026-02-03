import React from 'react'

export default function RoomList({ rooms, onDeleteRoom }) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rooms Added Yet</h3>
        <p className="text-gray-600">Go to the "Add Room" tab to create your first room.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Rooms ({rooms.length})</h2>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Room No</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Capacity</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">AC</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Attached Washroom</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-800">#{room.roomNo}</td>
                <td className="px-6 py-4 text-gray-700">
                  {room.remainingCapacity !== undefined
                    ? `${room.remainingCapacity} / ${room.capacity} seats left`
                    : `${room.capacity} students`}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    room.hasAC
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {room.hasAC ? '✓ Yes' : '✗ No'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    room.hasAttachedWashroom
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {room.hasAttachedWashroom ? '✓ Yes' : '✗ No'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDeleteRoom(room.roomNo)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {rooms.map((room, index) => (
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="mb-3">
              <h3 className="text-lg font-bold text-gray-800">Room #{room.roomNo}</h3>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Capacity:</span>{' '}
                {room.remainingCapacity !== undefined
                  ? `${room.remainingCapacity} / ${room.capacity} seats left`
                  : `${room.capacity} students`}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">AC:</span>{' '}
                <span className={room.hasAC ? 'text-blue-600' : 'text-gray-600'}>
                  {room.hasAC ? '✓ Yes' : '✗ No'}
                </span>
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Attached Washroom:</span>{' '}
                <span className={room.hasAttachedWashroom ? 'text-green-600' : 'text-gray-600'}>
                  {room.hasAttachedWashroom ? '✓ Yes' : '✗ No'}
                </span>
              </p>
            </div>
            <button
              onClick={() => onDeleteRoom(room.roomNo)}
              className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-semibold text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
