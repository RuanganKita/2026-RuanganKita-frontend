import type { RoomDto, ReservedHoursResponseDto } from '../types';

interface RoomCardProps {
  room: RoomDto;
  todayReservedHours?: ReservedHoursResponseDto;
  onBook: (room: RoomDto) => void;
  onViewSchedule: (room: RoomDto) => void;
}

export default function RoomCard({ room, todayReservedHours, onBook, onViewSchedule }: RoomCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">{room.name}</h4>
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span><strong>Capacity:</strong> {room.capacity} people</span>
        </div>
        <div className="flex items-center">
          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><strong>Available:</strong> {room.availableFrom.substring(0, 5)} - {room.availableTo.substring(0, 5)}</span>
        </div>
      </div>
      
      {/* Today's Schedule */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h5 className="text-xs font-semibold text-gray-700 mb-2">Today's Schedule</h5>
        {todayReservedHours && todayReservedHours.reservedHours.length > 0 ? (
          <div className="space-y-1">
            {todayReservedHours.reservedHours.slice(0, 2).map((slot, idx) => (
              <div key={idx} className="flex items-center text-xs text-gray-600">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                <span>{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</span>
              </div>
            ))}
            {todayReservedHours.reservedHours.length > 2 && (
              <p className="text-xs text-gray-500 italic">+{todayReservedHours.reservedHours.length - 2} more...</p>
            )}
          </div>
        ) : (
          <span className="text-green-600 text-xs flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Available All Day
          </span>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={() => onBook(room)}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
        >
          Book Now
        </button>
        <button
          onClick={() => onViewSchedule(room)}
          className="w-full px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition duration-200 font-medium text-sm"
        >
          View Full Schedule
        </button>
      </div>
    </div>
  );
}
