import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getAllUsers"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Registered Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user, index) => (
          <div
            key={index}
            className="bg-white rounded-lg overflow-hidden shadow-lg p-4"
          >
            <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
