import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { roomsApi, reservationsApi, usersApi, authApi } from '../services/api';
import type { RoomDto, ReservationDto, CreateRoomDto, UpdateRoomDto, CreateReservationDto, UserDto, ReservedHoursResponseDto } from '../types';
import DashboardHeader from '../components/DashboardHeader';
import ErrorAlert from '../components/ErrorAlert';
import TabNavigation from '../components/TabNavigation';
import AdminRoomsTab from '../components/AdminRoomsTab';
import AdminReservationsTab from '../components/AdminReservationsTab';
import AdminUsersTab from '../components/AdminUsersTab';
import AdminBookTab from '../components/AdminBookTab';
import RoomModal from '../components/RoomModal';
import BookingModal from '../components/BookingModal';
import ScheduleModal from '../components/ScheduleModal';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'rooms' | 'reservations' | 'users' | 'book'>('rooms');

  const [rooms, setRooms] = useState<RoomDto[]>([]);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomDto | null>(null);
  const [roomForm, setRoomForm] = useState<CreateRoomDto>({
    name: '',
    building: '',
    capacity: 1,
    availableFrom: '08:00:00',
    availableTo: '17:00:00',
  });

  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  
  const [users, setUsers] = useState<UserDto[]>([]);
  
  const [selectedRoom, setSelectedRoom] = useState<RoomDto | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: '',
    startTime: '08:00',
    endTime: '09:00',
  });
  
  const [todayReservedHours, setTodayReservedHours] = useState<Record<number, ReservedHoursResponseDto>>({});
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleModalRoom, setScheduleModalRoom] = useState<RoomDto | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleReservedHours, setScheduleReservedHours] = useState<ReservedHoursResponseDto | null>(null);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchRooms();
    fetchReservations();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomsApi.getAll();
      setRooms(response.data);
      await fetchTodayReservedHours(response.data);
    } catch {
      setError('Failed to fetch rooms');
    }
  };

  const fetchTodayReservedHours = async (roomsList: RoomDto[]) => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); // YYYY-MM-DD in UTC+7
    const reservedHoursMap: Record<number, ReservedHoursResponseDto> = {};
    
    try {
      await Promise.all(
        roomsList.map(async (room) => {
          try {
            const response = await reservationsApi.getReservedHours({ roomId: room.id, date: today });
            reservedHoursMap[room.id] = response.data;
          } catch {
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
      // fail
    }
  };

  const openScheduleModal = async (room: RoomDto) => {
    setScheduleModalRoom(room);
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
    setScheduleDate(today);
    setIsScheduleModalOpen(true);
    
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

  const fetchReservations = async () => {
    try {
      const response = await reservationsApi.getAll();
      setReservations(response.data);
    } catch {
      setError('Failed to fetch reservations');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
    } catch {
      setError('Failed to fetch users');
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await roomsApi.create(roomForm);
      await fetchRooms();
      setIsRoomModalOpen(false);
      resetRoomForm();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    setIsLoading(true);
    try {
      await roomsApi.update(editingRoom.id, roomForm as UpdateRoomDto);
      await fetchRooms();
      setIsRoomModalOpen(false);
      setEditingRoom(null);
      resetRoomForm();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update room');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      await roomsApi.delete(id);
      await fetchRooms();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete room');
    }
  };

  const handleUpdateReservationStatus = async (id: number, status: string) => {
    try {
      await reservationsApi.updateStatus(id, { status });
      await fetchReservations();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update status');
    }
  };

  const handleVerifyUser = async (userId: number) => {
    try {
      await authApi.verifyAdmin(userId);
      await fetchUsers();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to verify user');
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) return;

    try {
      await usersApi.deleteUser(userId);
      await fetchUsers();
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete user');
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
      await fetchReservations();
      closeBookingModal();
      setActiveTab('reservations');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create reservation');
    } finally {
      setIsLoading(false);
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

  const openRoomModal = (room?: RoomDto) => {
    if (room) {
      setEditingRoom(room);
      setRoomForm({
        name: room.name,
        building: room.building,
        capacity: room.capacity,
        availableFrom: room.availableFrom,
        availableTo: room.availableTo,
      });
    }
    setIsRoomModalOpen(true);
  };

  const resetRoomForm = () => {
    setRoomForm({
      name: '',
      building: '',
      capacity: 1,
      availableFrom: '08:00:00',
      availableTo: '17:00:00',
    });
    setEditingRoom(null);
  };

  const closeRoomModal = () => {
    setIsRoomModalOpen(false);
    setEditingRoom(null);
    resetRoomForm();
  };

  const handleRoomFormChange = (field: keyof CreateRoomDto, value: string | number) => {
    setRoomForm({ ...roomForm, [field]: value });
  };

  const handleRoomModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRoom) {
      handleUpdateRoom(e);
    } else {
      handleCreateRoom(e);
    }
  };

  const handleBookingFormChange = (field: string, value: string) => {
    setBookingForm({ ...bookingForm, [field]: value });
  };

  const tabs = [
    { id: 'rooms', label: 'Manage Rooms' },
    { id: 'reservations', label: 'Manage Reservations' },
    { id: 'book', label: 'Book Room' },
    { id: 'users', label: 'Manage Users' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader title="Admin Dashboard" username={user?.username || ''} onLogout={handleLogout} />

      {error && <ErrorAlert message={error} />}

      <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={(id) => setActiveTab(id as 'rooms' | 'reservations' | 'users' | 'book')} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'rooms' && (
          <AdminRoomsTab
            rooms={rooms}
            todayReservedHours={todayReservedHours}
            onAddRoom={() => openRoomModal()}
            onEditRoom={openRoomModal}
            onDeleteRoom={handleDeleteRoom}
            onViewSchedule={openScheduleModal}
          />
        )}

        {activeTab === 'reservations' && (
          <AdminReservationsTab reservations={reservations} onUpdateStatus={handleUpdateReservationStatus} />
        )}

        {activeTab === 'users' && (
          <AdminUsersTab users={users} onVerifyUser={handleVerifyUser} onDeleteUser={handleDeleteUser} />
        )}

        {activeTab === 'book' && (
          <AdminBookTab
            rooms={rooms}
            todayReservedHours={todayReservedHours}
            onBookRoom={handleBookRoom}
            onViewSchedule={openScheduleModal}
          />
        )}
      </div>

      <RoomModal
        isOpen={isRoomModalOpen}
        editingRoom={editingRoom}
        roomForm={roomForm}
        isLoading={isLoading}
        onClose={closeRoomModal}
        onSubmit={handleRoomModalSubmit}
        onFormChange={handleRoomFormChange}
      />

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
