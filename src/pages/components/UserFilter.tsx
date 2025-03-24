import React, { useState } from "react";
import { User } from "../types/user";
import { UserFilterProps } from "../types/filter";
import { LANG } from "@/locales/en";

const UserFilter: React.FC<UserFilterProps> = ({ onFilter, users }) => {
  const [filterKey, setFilterKey] = useState<keyof User | "">("");
  const [filterValue, setFilterValue] = useState("");

  const handleFilter = () => {
    if (!filterValue.trim()) {
      onFilter(users);
      return;
    }

    const filteredUsers = users.filter((user) => {
      if (filterKey) {
        const field = user[filterKey];
        return field?.toString().toLowerCase().includes(filterValue.toLowerCase());
      }

      return ["name", "phone", "email"].some((key) =>
        user[key as keyof User]?.toString().toLowerCase().includes(filterValue.toLowerCase())
      );
    });

    onFilter(filteredUsers);
  };

  return (
    <div className="mb-4 flex gap-2 w-100">
      <select
        className="border p-2 rounded-md"
        value={filterKey}
        onChange={(e) => setFilterKey(e.target.value as keyof User | "")}
      >
        <option value="">{ LANG.userForm.placeholders.allFields }</option>
        <option value="name">{ LANG.userForm.placeholders.name }</option>
        <option value="phone">{ LANG.userForm.placeholders.phone }</option>
        <option value="email">{ LANG.userForm.placeholders.email }</option>
      </select>
      <input
        className="border p-2 rounded-md flex-1"
        type="text"
        placeholder="Search..."
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600" onClick={handleFilter}>
      { LANG.userForm.placeholders.filter }
      </button>
    </div>
  );
};

export default UserFilter;
