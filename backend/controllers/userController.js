// Mảng tạm lưu danh sách user
let users = [
  { id: 1, name: "Nghiêm", email: "nghiem@example.com" },
  { id: 2, name: "An", email: "an@example.com" },
];

// Lấy toàn bộ danh sách user
const getUsers = (req, res) => {
  res.json(users);
};

// Thêm user mới
const createUser = (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Thiếu thông tin name hoặc email" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, createUser };
