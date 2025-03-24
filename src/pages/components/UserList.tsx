import React, { useState, useMemo, useEffect } from "react";
import { User, UserListProps } from "../types/user";
import UserFilter from "./UserFilter";
import { LANG } from "../../locales/en";

const UserList: React.FC<UserListProps> = ({ users, onDelete, onEdit }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof User | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });

  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSort = (key: keyof User) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      const valueA = a[sortConfig.key as keyof User];
      const valueB = b[sortConfig.key as keyof User];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortConfig.direction === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }, [filteredUsers, sortConfig]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 overflow-auto">
      <h2 className="text-lg font-semibold mb-2 text-gray-900">{ LANG.userList.title }</h2>

      <UserFilter onFilter={setFilteredUsers} users={users} />

      <table className="w-full border-collapse border border-gray-300  overflow-auto">
        <thead>
          <tr className="bg-gray-700 text-gray-200">
            <th className="border border-gray-300 px-4 py-2 w-6"></th>
            {(["name", "address", "phone", "email"] as Array<keyof User>).map((key) => (
              <th
                key={key}
                className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-600"
                onClick={() => handleSort(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                {sortConfig.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
            ))}
            <th className="border border-gray-300 px-4 py-2" colSpan={2}></th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <tr key={user.id} className="border border-gray-300">
                <td className={`border border-gray-300 px-4 py-2 ${user.color}`}></td>
                <td className="border border-gray-300 px-4 py-2 text-left">{user.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-left">{user.address}</td>
                <td className="border border-gray-300 px-4 py-2 text-left">{user.phone}</td>
                <td className="border border-gray-300 px-4 py-2 text-left">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600">
                    { LANG.userForm.edit }
                  </button>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => onDelete(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">
                    { LANG.userForm.delete }
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                { LANG.userList.noUsers }
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
