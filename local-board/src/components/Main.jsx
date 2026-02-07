// sort 는 원본 배열을 변경하기 때문에
// 스프레드(...)로 복사한 새 배열을 만든 뒤 정렬한다
// 날짜는 문자열이므로 dayjs로 날짜 객체로 바꾸고
// valueOf()로 숫자(타임스탬프)로 변환해서 비교한다
// toSorted 불변성을 지켜줌 ... 스프레드 안써도됨
// const sortedData = data.toSorted(
//   (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
// );

export default function Main() {
  return (
    <>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4">
        <div
          className=" ring ring-white/10 rounded-2xl bg-white/4 backdrop-blur-xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.3)]
                    transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:scale-[0.98] cursor-pointer"
        >
          {/* 작성된 게시글 */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl"></h2>
            <span></span>
          </div>
          <p className="my-4 text-lg text-white/70"></p>
          <div className="w-full flex items-center justify-end">
            <button className="bg-red-700 px-3 py-1.5 rounded-lg">삭제</button>
          </div>
        </div>
      </div>
    </>
  );
}
