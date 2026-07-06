import { UserRole } from "../types/userType";

export interface IRequestUser {
  userId: string;
  role: UserRole;
  email: string;
  emailVerified:boolean;
}
