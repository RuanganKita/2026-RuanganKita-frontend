import axios from 'axios';
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  RoomDto,
  CreateRoomDto,
  UpdateRoomDto,
  ReservationDto,
  CreateReservationDto,
  UpdateReservationDto,
  StatusUpdateDto,
  UserDto,
  ReservedHoursResponseDto,
  GetReservedHoursDto,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: RegisterDto) => 
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: LoginDto) => 
    api.post<AuthResponse>('/auth/login', data),
  
  verifyAdmin: (id: number) => 
    api.post(`/auth/verify/${id}`),
};

// Rooms API
export const roomsApi = {
  getAll: () => 
    api.get<RoomDto[]>('/rooms'),
  
  getById: (id: number) => 
    api.get<RoomDto>(`/rooms/${id}`),
  
  create: (data: CreateRoomDto) => 
    api.post<RoomDto>('/rooms', data),
  
  update: (id: number, data: UpdateRoomDto) => 
    api.put<RoomDto>(`/rooms/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/rooms/${id}`),
};

// Reservations API
export const reservationsApi = {
  getAll: () => 
    api.get<ReservationDto[]>('/reservations'),
  
  getById: (id: number) => 
    api.get<ReservationDto>(`/reservations/${id}`),
  
  create: (data: CreateReservationDto) => 
    api.post<ReservationDto>('/reservations', data),
  
  update: (id: number, data: UpdateReservationDto) => 
    api.put<ReservationDto>(`/reservations/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/reservations/${id}`),
  
  updateStatus: (id: number, data: StatusUpdateDto) => 
    api.put<ReservationDto>(`/reservations/status/${id}`, data),
  
  getHistory: (username: string) => 
    api.get<ReservationDto[]>(`/reservations/history?username=${username}`),
  
  getReservedHours: (data: GetReservedHoursDto) =>
    api.post<ReservedHoursResponseDto>('/reservations/reserved-hours', data),
};

// Users API
export const usersApi = {
  getAll: () => 
    api.get<UserDto[]>('/users'),
  
  getUnverified: () => 
    api.get<UserDto[]>('/users/unverified'),
  
  deleteUser: (userId: number) => 
    api.delete(`/users/${userId}`),
};

export default api;
