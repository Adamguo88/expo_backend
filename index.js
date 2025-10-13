// server.js (新增 SSE 路由)

// ... (省略 require 和 express 初始化的部分)
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());

const data = [
  { id: 1, name: "HTML" },
  { id: 2, name: "CSS" },
  { id: 3, name: "JavaScript" },
  { id: 4, name: "React" },
  { id: 5, name: "Vue" },
  { id: 6, name: "Angular" },
  { id: 7, name: "PHP" },
  { id: 8, name: "C#" },
  { id: 9, name: "C++" },
  { id: 10, name: "Express" },
  { id: 11, name: "Goland" },
  { id: 12, name: "Redis" },
  { id: 13, name: "asp.net" },
];

app.get("/", (req, res) => {
  res.send("Express 伺服器運行中。1");
});

app.get("/api/expo", (req, res) => {
  const { search } = req.query;

  if (!search) {
    res.status(200).json({ data: data });
    return;
  } else {
    const filterData = data.filter((item) => item.name.includes(search));
    console.log(filterData);
    res.status(200).json({ status: "success", data: filterData });
  }
});

module.exports = app;

// 啟動伺服器
// app.listen(PORT, () => {
//   console.log(`伺服器已啟動，正在監聽埠號 ${PORT}`);
// });
