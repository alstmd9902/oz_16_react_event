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

  const updatePost = async (id, formData) => {
    const res = await axios.put(`http://localhost:3000/posts/${id}`, formData);

    setPosts((prev) => prev.map((post) => (post.id === id ? res.data : post)));
    return res.data; // 업데이트 후 최신 데이터를 반환하여 호출 측에서 활용 가능하도록 함
  };

  const deletePost = async (id) => {
    await axios.delete(`http://localhost:3000/posts/${id}`);

    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return {
    posts, // 서버 기준 진짜 데이터
    addPost, // 생성
    updatePost, // 수정
    deletePost // 삭제
  };
}
