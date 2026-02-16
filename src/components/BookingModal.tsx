import type { RoomDto } from '../types';

interface BookingModalProps {
  room: RoomDto;
  bookingForm: {
    date: string;
    startTime: string;
    endTime: string;
  };
  error: string;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (field: string, value: string) => void;
}

export default function BookingModal({
  room,
  bookingForm,
  error,
  isLoading,
  onClose,
  onSubmit,
  onFormChange,
}: BookingModalProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={onClose}></div>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              Book {room.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {room.building} - Capacity: {room.capacity}
            </p>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => onFormChange('date', e.target.value)}
                  min={today}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={bookingForm.startTime}
                  onChange={(e) => onFormChange('startTime', e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                />
                <small className="text-gray-500">
                  Available: {room.availableFrom} - {room.availableTo}
                </small>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={bookingForm.endTime}
                  onChange={(e) => onFormChange('endTime', e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
