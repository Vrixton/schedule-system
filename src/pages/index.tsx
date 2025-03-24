import React, { useState } from "react";
import Navbar from "./components/Navbar";
import SidebarScheduleTime from "./components/SidebarScheduleTime";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import TimeBlockForm from "./components/TimeBlockForm";
import { User } from "./types/user";
import { TimeBlock } from "./types/timeBlocks";
import { LANG } from "../locales/en";

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Alice Johnson",
      address: "123 Maple St, Springfield",
      phone: "555-1234",
      email: "alice@example.com",
      color: "bg-red-500",
    },
    {
      id: 2,
      name: "Bob Smith",
      address: "456 Oak Ave, Metropolis",
      phone: "555-5678",
      email: "bob@example.com",
      color: "bg-green-500",
    },
    {
      id: 3,
      name: "Charlie Brown",
      address: "789 Pine Rd, Gotham",
      phone: "555-9012",
      email: "charlie@example.com",
      color: "bg-blue-500",
    },
  ]);

  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTimeBlockForm, setShowTimeBlockForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const saveUser = (user: Omit<User, "id">) => {
    const emailExists = users.some((u) => u.email === user.email && (!editingUser || u.id !== editingUser.id));
    
    if (emailExists) {
      alert(LANG.timeblockForm.errors.existingEmail);
      return;
    }
  
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...user } : u)));
    } else {
      const newUser: User = { id: Date.now(), ...user };
      setUsers([...users, newUser]);
    }
  
    setEditingUser(null);
    setShowUserForm(false);
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const deleteUser = (id: number) => {
    console.log('id', id)
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    setTimeBlocks(timeBlocks.filter((block) => block.userId !== id));
  };

  const addTimeBlock = (block: Omit<TimeBlock, "id">) => {
    if (timeBlocks.some(
      (tb) => tb.userId === block.userId && 
             ((block.startTime >= tb.startTime && block.startTime < tb.endTime) || 
              (block.endTime > tb.startTime && block.endTime <= tb.endTime))
    )) {
      alert(LANG.timeblockForm.errors.existingTimeblock);
      return;
    }
    setTimeBlocks([...timeBlocks, { id: Date.now(), ...block }]);
    setShowTimeBlockForm(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <div className="hidden md:block h-screen">
          <SidebarScheduleTime timeBlocks={timeBlocks} users={users} />
        </div>
        <div className="flex-1 p-6 w-screen">
          { showUserForm ? (
            <UserForm 
              onSave={saveUser} 
              onCancel={() => { setShowUserForm(false); setEditingUser(null); }} 
              usedColors={users.map(u => u.color)} 
              editingUser={editingUser} 
            />
          ) : showTimeBlockForm ? (
            <TimeBlockForm 
              users={users} 
              timeBlocks={timeBlocks} 
              onSave={addTimeBlock} 
              onCancel={() => setShowTimeBlockForm(false)} 
            />
          ) : (
            <>
            <div className="flex justify-between items-baseline">
              <button 
                onClick={() => { setShowUserForm(true); setEditingUser(null); }} 
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer">
                { LANG.userList.addUser }
              </button>
              { users.length > 0 &&
                <button 
                  onClick={() => setShowTimeBlockForm(true)} 
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md cursor-pointer">
                { LANG.userList.addTimeblock }
                </button>
              }
            </div>
              <UserList users={users} onDelete={deleteUser} onEdit={editUser} />
            </>
          ) }
        </div>
      </div>
    </div>
  );
};

export default App;
