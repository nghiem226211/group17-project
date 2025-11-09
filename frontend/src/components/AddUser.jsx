import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email };
    try {
      await axios.post("http://localhost:3000/users", newUser);
      onAdd(); // gọi lại danh sách user
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Lỗi khi thêm user:", error);
    }
  };

  return (
    <div>
      <h2>Thêm người dùng</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
};

export default AddUser;
