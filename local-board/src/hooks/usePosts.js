import { useEffect, useState } from "react";

const LOCAL_KEY = "postData"; // key : value
export default function usePosts() {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : []; // 로컬은 문자열만 저장 가능하다  JSON.parse -> 역할은 객체 또는 배열로 변환 해주는것이다
  }); //로컬에 넣을 배열이 필요하다

  /*
    1. posts가 바뀐다 -> posts 변경이 되면 로컬스토리지에 저장을 한다 useEffect 사용
    2. posts 배열을 JSON 문자열로 바꾼다
    3. LOCAL_KEY를 사용해서 localStorage에 저장한다
   */
  const addPost = (post) => {
    setPosts((prev) => [...prev, post]);
  };

  //로컬스토리지 기본 문법 : localStorage.setItem(key, value);
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(posts)); //JSON.stringify -> 문자열로 변환해줌
  }, [posts]);

  return { posts, addPost }; // 필요한 값 리턴
}
