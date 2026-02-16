// DTOs converted from C# records to TypeScript interfaces

export interface CreateReservationDto {
  roomId: number;
  date: string; // DateOnly as ISO date string (YYYY-MM-DD)
  startTime: string; // TimeOnly as string (HH:mm:ss)
  endTime: string; // TimeOnly as string (HH:mm:ss)
}

export interface CreateRoomDto {
  name: string;
  building: string;
  capacity: number;
  availableFrom: string; // TimeOnly as string (HH:mm:ss)
  availableTo: string; // TimeOnly as string (HH:mm:ss)
}

export interface ReservationDto {
  id: number;
  roomId: number;
  roomName: string;
  buildingName: string;
  userId: number;
  username: string;
  startTime: string; // DateTime as ISO string
  endTime: string; // DateTime as ISO string
  status: string;
  createdAt: string; // DateTime as ISO string
  updatedAt?: string; // DateTime as ISO string
}

export interface RoomDto {
  id: number;
  name: string;
  building: string;
  capacity: number;
  availableFrom: string; // TimeOnly as string (HH:mm:ss)
  availableTo: string; // TimeOnly as string (HH:mm:ss)
}

export interface UpdateReservationDto {
  date: string; // DateOnly as ISO date string (YYYY-MM-DD)
  startTime: string; // TimeOnly as string (HH:mm:ss)
  endTime: string; // TimeOnly as string (HH:mm:ss)
}

export interface UpdateRoomDto {
  name: string;
  building: string;
  capacity: number;
  availableFrom: string; // TimeOnly as string (HH:mm:ss)
  availableTo: string; // TimeOnly as string (HH:mm:ss)
}

export interface StatusUpdateDto {
  status: string;
}

// Auth DTOs
export interface RegisterDto {
  username: string;
  password: string;
  role?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: 'Admin' | 'User';
  userId: number;
}

export interface User {
  id: number;
  username: string;
  role: 'Admin' | 'User';
  isVerified?: boolean;
}

export interface UserDto {
  id: number;
  username: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

// Reserved Hours DTOs
export interface ReservedHourRangeDto {
  startTime: string;
  endTime: string;
}

export interface GetReservedHoursDto {
  date: string; 
  roomId: number;
}

export interface ReservedHoursResponseDto {
  date: string; 
  roomId: number;
  reservedHours: ReservedHourRangeDto[];
}
