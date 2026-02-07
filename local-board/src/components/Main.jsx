// sort 는 원본 배열을 변경하기 때문에
// 스프레드(...)로 복사한 새 배열을 만든 뒤 정렬한다
// 날짜는 문자열이므로 dayjs로 날짜 객체로 바꾸고
// valueOf()로 숫자(타임스탬프)로 변환해서 비교한다
// toSorted 불변성을 지켜줌 ... 스프레드 안써도됨

import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Main({ posts }) {
  const [page, setPage] = useState(1); //페이지 상태
  const PAGE_SIZE = 4;
  const navigate = useNavigate();

  // 1) 최신순 정렬
  const sortedData = (posts ?? []).toSorted(
    (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
  );
  const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
  // 2) 페이지
  const pagedPosts = sortedData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <section className="w-full max-w-[1400px] mx-auto grid md:grid-cols-2 grid-cols-1 gap-4 flex-1">
        {pagedPosts.map((post) => {
          return (
            <div
              key={post.id}
              onClick={() => navigate(`/post/${post.id}`)}
              className=" ring ring-white/10 rounded-2xl bg-white/4 backdrop-blur-xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.3)]
                 h-[310px] flex flex-col gap-4 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:scale-[0.98] cursor-pointer"
            >
              {/* 작성된 게시글 */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl">{post.title}</h2>
                <span>{dayjs(post.date).format("YYYY-MM-DD HH:mm")}</span>
              </div>

              <div className="flex flex-1 gap-6">
                {post.images && post.images.length > 0 && (
                  <div className="relative w-32 h-full">
                    <img
                      src={post.images[0]}
                      alt=""
                      className="w-full h-full shrink-0 object-cover rounded-lg"
                    />
                    {post.images.length > 1 && (
                      <div
                        className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg 
                      text-white text-lg font-semibold"
                      >
                        +{post.images.length - 1}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-lg text-white/70 line-clamp-6 flex-1">
                  {post.contents}
                </p>
              </div>
              <div className="w-full flex items-center justify-end">
                <button className="bg-red-700 px-3 py-1.5 rounded-lg">
                  삭제
                </button>
              </div>
            </div>
          );
        })}
      </section>
      <div className="flex justify-center items-center gap-4 mt-10">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNumber = idx + 1;

          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`flex items-center justify-center text-sm font-semibold transition-all
                ${
                  page === pageNumber
                    ? ""
                    : "text-white/40 hover:bg-emerald-400/20 hover:shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>
    </>
  );
}
