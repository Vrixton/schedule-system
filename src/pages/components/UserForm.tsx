import React, { useState, useEffect } from "react";
import { User, UserFormProps } from "../types/user";
import { LANG } from "@/locales/en";

const COLORS = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"
];

const getUniqueColor = (usedColors: string[]) => {
  const availableColors = COLORS.filter(color => !usedColors.includes(color));
  return availableColors.length > 0 
    ? availableColors[Math.floor(Math.random() * availableColors.length)]
    : COLORS[Math.floor(Math.random() * COLORS.length)];
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const UserForm: React.FC<UserFormProps> = ({ onSave, onCancel, usedColors, editingUser }) => {
  const [formData, setFormData] = useState<Omit<User, "id">>({
    name: "",
    address: "",
    phone: "",
    email: "",
    color: getUniqueColor(usedColors),
  });

  const [emailError, setEmailError] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    if (editingUser) {
      setFormData(prev => ({
        ...prev,
        ...editingUser,
        color: editingUser.color || getUniqueColor(usedColors),
      }));
    }
  }, [editingUser, usedColors]);

  useEffect(() => {
    const isValid = Object.values(formData).every(value =>
      typeof value === "string" ? value.trim() !== "" : value !== undefined && value !== null
    ) && isValidEmail(formData.email);

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "email") {
      setEmailError(isValidEmail(value) ? "" : "Invalid email format");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        {editingUser ? "Edit User" : "Add User"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(["name", "address", "phone", "email"] as const).map((field) => (
          <div key={field}>
            <input
              type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field] || ""}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${field === "email" && emailError ? "border-red-500" : ""}`}
              required
            />
            {field === "email" && emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
        ))}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
            { LANG.userForm.cancel }
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-md ${isFormValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!isFormValid}>
            {editingUser ? LANG.userForm.update : LANG.userForm.save }
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
