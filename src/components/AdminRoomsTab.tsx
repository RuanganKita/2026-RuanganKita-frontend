import type { RoomDto, ReservedHoursResponseDto } from '../types';

interface AdminRoomsTabProps {
  rooms: RoomDto[];
  todayReservedHours: Record<number, ReservedHoursResponseDto>;
  onAddRoom: () => void;
  onEditRoom: (room: RoomDto) => void;
  onDeleteRoom: (id: number) => void;
  onViewSchedule: (room: RoomDto) => void;
}

export default function AdminRoomsTab({
  rooms,
  todayReservedHours,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onViewSchedule,
}: AdminRoomsTabProps) {
  // Group rooms by building
  const roomsByBuilding = rooms.reduce((acc, room) => {
    if (!acc[room.building]) {
      acc[room.building] = [];
    }
    acc[room.building].push(room);
    return acc;
  }, {} as Record<string, RoomDto[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Rooms by Building</h2>
        <button
          onClick={onAddRoom}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Add Room
        </button>
      </div>

      {Object.keys(roomsByBuilding).length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No rooms available. Add your first room!
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(roomsByBuilding).map(([building, buildingRooms]) => (
            <div key={building} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                <h3 className="text-xl font-semibold text-indigo-900">{building}</h3>
                <p className="text-sm text-indigo-600">{buildingRooms.length} rooms</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available Hours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Today's Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {buildingRooms.map((room) => {
                      const todayReserved = todayReservedHours[room.id];
                      return (
                        <tr key={room.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {room.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {room.capacity} people
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {room.availableFrom.substring(0, 5)} - {room.availableTo.substring(0, 5)}
                          </td>
                          <td className="px-6 py-4">
                            {todayReserved && todayReserved.reservedHours.length > 0 ? (
                              <div className="space-y-1">
                                {todayReserved.reservedHours.map((slot, idx) => (
                                  <div key={idx} className="flex items-center text-xs">
                                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    <span className="text-gray-700">
                                      {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-green-600 text-xs flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Available
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => onViewSchedule(room)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Schedule
                            </button>
                            <button
                              onClick={() => onEditRoom(room)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteRoom(room.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
