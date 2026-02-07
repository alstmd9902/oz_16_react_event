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
      <section className="w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {pagedPosts.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-[300px] text-white/50 text-lg">
            게시글이 없습니다. 새로운 글을 작성해주세요.
          </div>
        ) : (
          pagedPosts.map((post) => {
            return (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl ring ring-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col h-[420px]"
              >
                {post.images && post.images.length > 0 && (
                  <div className="relative w-full h-[220px] overflow-hidden shrink-0">
                    <img
                      src={post.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  </div>
                )}

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold leading-snug line-clamp-2">
                      {post.title}
                    </h2>

                    <span className="text-xs text-white/30 ml-auto">
                      {dayjs(post.date).format("YYYY-MM-DD HH:mm")}
                    </span>
                  </div>

                  <p className="text-sm text-white/70 line-clamp-6 flex-1">
                    {post.contents}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* 페이지네이션 */}
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
