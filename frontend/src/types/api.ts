export interface UserDto {
  id: number;
  username: string;
  email: string;
  currentPoints: number;
  role: 'Guest' | 'User' | 'Admin' | 'Owner';
}

export interface UserRegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface ActionResponse {
  isSuccess: boolean;
  message: string;
}

export interface AdminUser extends UserDto {
  isBanned: boolean;
  lastLogin: string;
  sessionActive: boolean;
}
