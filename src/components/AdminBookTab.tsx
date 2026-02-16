import RoomCard from './RoomCard';
import type { RoomDto, ReservedHoursResponseDto } from '../types';

interface AdminBookTabProps {
  rooms: RoomDto[];
  todayReservedHours: Record<number, ReservedHoursResponseDto>;
  onBookRoom: (room: RoomDto) => void;
  onViewSchedule: (room: RoomDto) => void;
}

export default function AdminBookTab({ rooms, todayReservedHours, onBookRoom, onViewSchedule }: AdminBookTabProps) {
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Room (Admin)</h2>
      {Object.keys(roomsByBuilding).length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No rooms available to book.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(roomsByBuilding).map(([building, buildingRooms]) => (
            <div key={building}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{building}</h3>
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
