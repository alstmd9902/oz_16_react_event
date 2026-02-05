import cors from "cors";
import express from "express";
import authRouter from "./routes/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);
app.use(express.json());

// 👇 로그인 관련은 전부 auth.js로
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log("✅ 서버 실행중 http://localhost:3000");
});
