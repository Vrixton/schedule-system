import { User } from "./user";

export interface UserFilterProps {
  onFilter: (filteredUsers: User[]) => void;
  users: User[];
}