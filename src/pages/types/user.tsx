export interface User {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    color: string;
}

export interface UserListProps {
    users: User[];
    onDelete: (id: number) => void;
    onEdit: (user: User) => void;
}

export interface UserFormProps {
    onSave: (user: { name: string; address: string; phone: string; email: string; color: string }) => void;
    onCancel: () => void;
    usedColors: string[];
    editingUser: User | null;
  }
  