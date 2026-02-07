import express from "express";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

let posts = []; //게시글 임시 저장하는 배열

router.get("/", (req, res) => {
  res.json(posts);
}); // 프론트에서 게시글 목록 요청시 저장된 posts 그대로 보내줌

router.post("/", upload.array("images"), (req, res) => {
  const post = {
    id: Date.now(),
    title: req.body.title,
    contents: req.body.contents,
    //저장된 이미지 파일의 접근 가능한 URL 생성
    images: req.files.map(
      (file) => `http://localhost:3000/uploads/${file.filename}`
    ),
    date: new Date().toISOString() // 작성 시간
  };
  posts.push(post); // 게시글을 서버 메모리에 저장
  res.json(post); // 저장된 게시글을 프론트로 다시 돌려줌
});

export default router;
