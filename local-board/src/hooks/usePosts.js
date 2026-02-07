import axios from "axios";
import { useEffect, useState } from "react";

//서버에 저장된 게시글을 가져오고, 새 게시글 저장을 서버에 요청하는 프론트 관리 훅

export default function usePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/posts").then((res) => setPosts(res.data));
  }, []);

  //서버 에서 가져오기
  const addPost = async (formData) => {
    const res = await axios.post("http://localhost:3000/posts", formData);
    setPosts((prev) => [...prev, res.data]);
  };

  return { posts, addPost }; // 필요한 값 리턴
}
