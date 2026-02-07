import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";

const router = express.Router();
const DATA_PATH = "./posts.json";

// 🔹 파일 저장용
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// 🔹 posts 불러오기
const loadPosts = () => {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
};

// 🔹 posts 저장하기
const savePosts = (posts) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(posts, null, 2));
};

// 목록
router.get("/", (req, res) => {
  const posts = loadPosts();
  res.json(posts);
});

// 생성
router.post("/", upload.array("images"), (req, res) => {
  const posts = loadPosts();

  const post = {
    id: Date.now(),
    title: req.body.title,
    contents: req.body.contents,
    images: req.files.map(
      (file) => `http://localhost:3000/uploads/${file.filename}`
    ),
    date: new Date().toISOString()
  };

  posts.unshift(post);
  savePosts(posts);

  res.json(post);
});

// 수정
router.put("/:id", upload.array("images"), (req, res) => {
  const posts = loadPosts();
  const id = Number(req.params.id);

  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "게시글 없음" });
  }

  const existingImages = req.body.existingImages
    ? JSON.parse(req.body.existingImages)
    : [];

  const newImages =
    req.files?.map(
      (file) => `http://localhost:3000/uploads/${file.filename}`
    ) || [];

  posts[index] = {
    ...posts[index],
    title: req.body.title,
    contents: req.body.contents,
    images: [...existingImages, ...newImages],
    date: new Date().toISOString()
  };

  savePosts(posts);
  res.json(posts[index]);
});

// 삭제
router.delete("/:id", (req, res) => {
  const posts = loadPosts();
  const id = Number(req.params.id);

  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "게시글 없음" });
  }

  const post = posts[index];

  // ✅ 이미지 파일 실제 삭제
  if (post.images && post.images.length > 0) {
    post.images.forEach((imgUrl) => {
      const filename = imgUrl.split("/uploads/")[1];
      if (!filename) return;

      const filePath = path.join(process.cwd(), "uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  posts.splice(index, 1);
  savePosts(posts);

  res.json({ success: true });
});

export default router;
