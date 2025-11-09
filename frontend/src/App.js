import React, { useState } from "react";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  const [reload, setReload] = useState(false);

  const handleReload = () => {
    setReload(!reload); // đổi giá trị để render lại danh sách user
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Quản lý người dùng</h1>
      <AddUser onAdd={handleReload} />
      <UserList key={reload} />
    </div>
  );
}

export default App;
