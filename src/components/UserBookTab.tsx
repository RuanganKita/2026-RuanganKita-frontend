import RoomCard from './RoomCard';
import type { RoomDto, ReservedHoursResponseDto } from '../types';

interface UserBookTabProps {
  rooms: RoomDto[];
  todayReservedHours: Record<number, ReservedHoursResponseDto>;
  onBookRoom: (room: RoomDto) => void;
  onViewSchedule: (room: RoomDto) => void;
}

export default function UserBookTab({ rooms, todayReservedHours, onBookRoom, onViewSchedule }: UserBookTabProps) {
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Rooms</h2>
      {Object.keys(roomsByBuilding).length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No rooms available at the moment.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(roomsByBuilding).map(([building, buildingRooms]) => (
            <div key={building}>
              <div className="flex items-center mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{building}</h3>
                  <p className="text-sm text-gray-600">{buildingRooms.length} rooms available</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buildingRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    todayReservedHours={todayReservedHours[room.id]}
                    onBook={onBookRoom}
                    onViewSchedule={onViewSchedule}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
