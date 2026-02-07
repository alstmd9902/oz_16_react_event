import cors from "cors";
import express from "express";
import postsRouter from "./routes/posts.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);
app.use("/uploads", express.static("uploads")); // 파일 업로드용
app.use(express.json());

//posts 라우터 연결
app.use("/posts", postsRouter);

app.listen(3000, () => {
  console.log("✅ 서버 실행중 http://localhost:3000");
});
