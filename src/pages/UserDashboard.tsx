import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { roomsApi, reservationsApi } from '../services/api';
import type { RoomDto, ReservationDto, CreateReservationDto, ReservedHoursResponseDto } from '../types';
import DashboardHeader from '../components/DashboardHeader';
import ErrorAlert from '../components/ErrorAlert';
import TabNavigation from '../components/TabNavigation';
import UserBookTab from '../components/UserBookTab';
import UserReservationsTab from '../components/UserReservationsTab';
import BookingModal from '../components/BookingModal';
import ScheduleModal from '../components/ScheduleModal';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');

  // Rooms state
  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '08:00',
    endTime: '09:00',
  });

  // User reservations state
  const [myReservations, setMyReservations] = useState<ReservationDto[]>([]);
  
  // Reserved Hours state
  const [todayReservedHours, setTodayReservedHours] = useState<Record<number, ReservedHoursResponseDto>>({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalRoom, setScheduleModalRoom] = useState<RoomDto | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleReservedHours, setScheduleReservedHours] = useState<ReservedHoursResponseDto | null>(null);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
    if (user) {
      fetchMyReservations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchRooms = async () => {
    try {
      const response = await roomsApi.getAll();
      setRooms(response.data);
      // Fetch today's reserved hours for all rooms
      await fetchTodayReservedHours(response.data);
    } catch {
      setError('Failed to fetch rooms');
    }
  };

  const fetchTodayReservedHours = async (roomsList: RoomDto[]) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const reservedHoursMap: Record<number, ReservedHoursResponseDto> = {};
    
    try {
      await Promise.all(
        roomsList.map(async (room) => {
          try {
            const response = await reservationsApi.getReservedHours({ roomId: room.id, date: today });
            reservedHoursMap[room.id] = response.data;
          } catch {
            // If error, set empty reserved hours
            reservedHoursMap[room.id] = {
              date: today,
              roomId: room.id,
              reservedHours: [],
            };
          }
        })
      );
      setTodayReservedHours(reservedHoursMap);
    } catch {
      // Silent fail for reserved hours
    }
  };

  const openScheduleModal = async (room: RoomDto) => {
    setScheduleModalRoom(room);
    const today = new Date().toISOString().split('T')[0];
    setScheduleDate(today);
    setIsScheduleModalOpen(true);
    
    // Fetch reserved hours for today
    try {
      const response = await reservationsApi.getReservedHours({ roomId: room.id, date: today });
      setScheduleReservedHours(response.data);
    } catch {
      setScheduleReservedHours({
        date: today,
        roomId: room.id,
        reservedHours: [],
      });
    }
  };

  const handleScheduleDateChange = async (date: string) => {
    setScheduleDate(date);
    if (!scheduleModalRoom) return;
    
    try {
      const response = await reservationsApi.getReservedHours({ roomId: scheduleModalRoom.id, date });
      setScheduleReservedHours(response.data);
    } catch {
      setScheduleReservedHours({
        date,
        roomId: scheduleModalRoom.id,
        reservedHours: [],
      });
    }
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setScheduleModalRoom(null);
    setScheduleReservedHours(null);
  };

  const fetchMyReservations = async () => {
    if (!user) return;
    try {
      const response = await reservationsApi.getHistory(user.username);
      setMyReservations(response.data);
    } catch {
      setError('Failed to fetch reservations');
    }
  };

  const handleBookRoom = (room: RoomDto) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setIsLoading(true);
    setError('');

    try {
      const reservationData: CreateReservationDto = {
        roomId: selectedRoom.id,
        date: bookingForm.date,
        startTime: bookingForm.startTime + ':00',
        endTime: bookingForm.endTime + ':00',
      };

      await reservationsApi.create(reservationData);
      await fetchMyReservations();
      closeBookingModal();
      setActiveTab('history');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create reservation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelReservation = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await reservationsApi.delete(id);
      await fetchMyReservations();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to cancel reservation');
    }
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedRoom(null);
    setBookingForm({
      date: '',
      startTime: '08:00',
      endTime: '09:00',
    });
  };

  const handleBookingFormChange = (field: string, value: string) => {
    setBookingForm({ ...bookingForm, [field]: value });
  };

  const tabs = [
    { id: 'book', label: 'Book Room' },
    { id: 'history', label: 'My Reservations' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Dashboard" username={user?.username || ''} onLogout={logout} />

      {error && <ErrorAlert message={error} />}

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as 'book' | 'history')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'book' && (
          <UserBookTab
            rooms={rooms}
            todayReservedHours={todayReservedHours}
            onBookRoom={handleBookRoom}
            onViewSchedule={openScheduleModal}
          />
        )}

        {activeTab === 'history' && (
          <UserReservationsTab reservations={myReservations} onCancelReservation={handleCancelReservation} />
        )}
      </div>

      {isBookingModalOpen && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          bookingForm={bookingForm}
          error={error}
          isLoading={isLoading}
          onClose={closeBookingModal}
          onSubmit={handleCreateReservation}
          onFormChange={handleBookingFormChange}
        />
      )}

      {isScheduleModalOpen && scheduleModalRoom && (
        <ScheduleModal
          room={scheduleModalRoom}
          scheduleDate={scheduleDate}
          reservedHours={scheduleReservedHours}
          onClose={closeScheduleModal}
          onDateChange={handleScheduleDateChange}
        />
      )}
    </div>
  );
}
