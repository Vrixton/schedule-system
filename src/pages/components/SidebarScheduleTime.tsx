import React from "react";

interface TimeBlock {
  startTime: string;
  endTime: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  color: string;
}

interface SidebarScheduleTimeProps {
  timeBlocks?: TimeBlock[];
  users: User[];
}

const generateHourSlots = () => {
  const hours = [];
  for (let i = 0; i < 24; i++) {
    const hour = `${i.toString().padStart(2, "0")}:00`;
    hours.push(hour);
  }
  return hours;
};

const SidebarScheduleTime: React.FC<SidebarScheduleTimeProps> = ({ timeBlocks = [], users }) => {
  const hours = generateHourSlots();

  const getBlockColor = (hour: string) => {
    const block = timeBlocks.find(
      (block) => block.startTime <= hour && block.endTime > hour
    );

    if (block) {
      const user = users.find((u) => u.id === block.userId);
      return user ? user.color : "bg-gray-600";
    }
    return "bg-gray-600";
  };

  return (
    <aside className="w-40 bg-gray-800 text-white flex flex-col px-6 space-y-4 shadow-lg h-screen">
      <div className="overflow-y-auto mt-4 rounded-md">
        {hours.map((hour) => (
          <div key={hour} className={`text-center ${getBlockColor(hour)} mb-0`}>
            {hour}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarScheduleTime;