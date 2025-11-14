// server.js (新增 SSE 路由)

// ... (省略 require 和 express 初始化的部分)
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const server = http.createServer(app);
const io = new Server(server, {
  path: "/socket",
  cors: {
    origin: "*", // 允許所有來源連線 (開發時使用)
    methods: ["GET", "POST"],
  },
});
//
const clientList = new Map();
// 憑證緩存
const authorizationList = new Map();
authorizationList.set("admin", true); // 行政A
authorizationList.set("superAdmin", true); // 管理員

io.on("connection", (socket) => {
  const getToken = socket.handshake.auth.token;
  if (getToken) {
    clientList.set(socket.id, getToken);
    socket.emit("status", "已成功透過 /socket 路徑連線！");
  }

  socket.on("disconnect", () => {
    clientList.delete(socket.id);
    console.log("用戶斷線:", socket.id);
    console.log(clientList);
  });
});

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
  res.send("Express + Expo 伺服器運行中。");
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

// 新增主約測試
app.post("/api/policy1", async (req, res) => {
  const { requireData } = req.body;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("主約:", requireData.mockID);
  res.status(200).json({ status: "success", InsIdx: requireData.mockID });
});
// 新增附約測試
app.post("/api/policy2", async (req, res) => {
  const { requireData } = req.body;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("附約:", requireData.mockID, requireData.InsIdx);
  res.status(200).json({ status: "success", InsIdx: requireData.mockID });
});

// 頒發每個人的憑證
app.post("/api/authorization", async (req, res) => {
  const { code = "" } = req.body;
  const isActivity = authorizationList.get(code);
  if (!code || !isActivity) {
    const uuid = crypto.randomUUID();
    authorizationList.set(uuid, true);
    res.status(200).json({ status: "new", uuid });
    return;
  }
  res.status(200).json({ status: "oldUser", uuid: code });
});

// module.exports = app;

// 啟動伺服器
server.listen(PORT, () => {
  console.log(`伺服器已啟動，正在監聽埠號 ${PORT}`);
});
