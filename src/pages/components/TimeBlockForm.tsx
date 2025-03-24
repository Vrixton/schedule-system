import React, { useState } from "react";
import { LANG } from "@/locales/en";

interface TimeBlockFormProps {
  users: { id: number; name: string; color: string }[];
  timeBlocks: { startTime: string; endTime: string; userId: number }[];
  onSave: (block: { startTime: string; endTime: string; userId: number }) => void;
  onCancel: () => void;
}

const generateHourSlots = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    hours.push(`${i.toString().padStart(2, "0")}:00`);
  }
  return hours;
};

const TimeBlockForm: React.FC<TimeBlockFormProps> = ({ users, timeBlocks, onSave, onCancel }) => {
  const hours = generateHourSlots();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    startTime: hours[0],
    endTime: hours[1],
    userId: users.length > 0 ? users[0].id : 0,
  });

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStartTime = e.target.value;
    const nextAvailableHourIndex = hours.indexOf(newStartTime) + 1;
    const newEndTime = nextAvailableHourIndex < hours.length ? hours[nextAvailableHourIndex] : "";

    setFormData({ ...formData, startTime: newStartTime, endTime: newEndTime });
    setError(null);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, endTime: e.target.value });
    setError(null);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, userId: Number(e.target.value) });
    setError(null);
  };

  const isOverlapping = timeBlocks.some(
    (block) =>
      (formData.startTime >= block.startTime && formData.startTime < block.endTime) ||
      (formData.endTime > block.startTime && formData.endTime <= block.endTime) ||
      (formData.startTime <= block.startTime && formData.endTime >= block.endTime)
  );

  const isFormValid =
    formData.startTime &&
    formData.endTime &&
    formData.userId !== 0 &&
    hours.indexOf(formData.endTime) > hours.indexOf(formData.startTime) &&
    !isOverlapping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    onSave({ startTime: formData.startTime, endTime: formData.endTime, userId: formData.userId });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">{ LANG.userList.addTimeblock }</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="startTime"
          value={formData.startTime}
          onChange={handleStartTimeChange}
          className="w-full p-2 border rounded-md"
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        <select
          name="endTime"
          value={formData.endTime}
          onChange={handleEndTimeChange}
          className="w-full p-2 border rounded-md"
        >
          {hours
            .filter((hour) => hours.indexOf(hour) > hours.indexOf(formData.startTime))
            .map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
        </select>

        <select
          name="userId"
          value={formData.userId}
          onChange={handleUserChange}
          className="w-full p-2 border rounded-md"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 cursor-pointer">
          { LANG.userForm.cancel }
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-md ${
              isFormValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid}>
            { LANG.userForm.save }
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimeBlockForm;
