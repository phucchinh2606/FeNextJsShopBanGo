export enum UserRole {
  Customer = 0,
  Admin = 1,
}

export interface UserDto {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
  createdAt: string;
}

export interface CreateUserCommand {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
}

export interface UpdateUserCommand {
  fullName: string;
  phoneNumber: string;
  address: string;
  role: UserRole;
}
