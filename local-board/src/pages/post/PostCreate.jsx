import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 가져오기
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
//0분전, 1달전, 1년전 이렇게 상대 시간을 표현하는 플러그인
import relativeTime from "dayjs/plugin/relativeTime";
import usePosts from "../../hooks/usePosts";
dayjs.extend(relativeTime); // 플러그인 등록
dayjs.locale("ko"); // 언어 등록

/**
 * 게시글 작성 페이지
 * - 이미지 업로드 + 제목/내용 입력
 * - 이미지 최대 5장 제한
 * - 초과 시 경고 + 업로드 차단
 */
export default function PostCreate() {
  const MAX_IMAGES = 5; // 이미지 최대 개수 제한

  const [images, setImages] = useState([]); // [{ file, preview }]
  const [title, setTitle] = useState(""); // 게시글 제목
  const [content, setContent] = useState(""); // 게시글 내용
  const { addPost } = usePosts();
  // 제목 또는 내용이 하나라도 없다면 버튼 비활성화 해야함 false ,true 로 비교
  const isValid = Boolean(title.trim() && content.trim());

  /*
   * 작성 완료 버튼 클릭 시
   * - 현재 입력된 이미지 / 제목 / 내용을 기반으로 data 객체를 생성한다
   * - 생성된 data 객체를 posts 배열(state)에 추가한다
   * - 작성된 값 전부 초기 상태로 돌린다
   */
  const handleClick = () => {
    const data = {
      id: Date.now(),
      image: images,
      title: title,
      contents: content,
      date: dayjs().format("YYYY MM DD HH:mm:ss")
    };
    addPost(data);
    setTitle("");
    setContent("");
    setImages([]);
  };
  // console.log(posts);

  // 이미지 드롭/선택 시 실행
  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return; // 파일 없으면 종료

    setImages((prev) => {
      const remain = MAX_IMAGES - prev.length; // 남은 이미지 슬롯 계산

      // 최대 개수 초과 → 경고만 띄우고 상태 변경 X
      if (acceptedFiles.length > remain) {
        alert(`이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있어요.`);
        return prev; // return 안 하면 일부 파일이 들어가버림 → 아예 추가 막기
      }

      // 선택한 파일을 미리보기 가능한 형태로 변환
      const mapped = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file) // 이미지 미리보기용 URL
      }));

      // 기존 이미지 + 새 이미지 합치기
      return [...prev, ...mapped];
    });
  };

  // react-dropzone 단계에서 이미 컷된 경우 내용
  const onDropRejected = () => {
    alert(
      `이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있어요. 다시 선택해주세요`
    );
  };

  // dropzone 설정 (입력 처리 + 1차 필터)
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop, // 정상 케이스
    onDropRejected, // 초과 케이스
    maxFiles: MAX_IMAGES, // 1차 개수 제한
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"] // 이미지 파일만 허용
    },
    disabled: images.length >= MAX_IMAGES
  });

  // 이미지 하나 삭제
  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.preview); // 메모리 해제
      return prev.filter((_, i) => i !== index); // 해당 index 제거
    });
  };

  // 컴포넌트 종료 시 미리보기 URL 정리
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-5xl flex flex-col gap-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-12">
        {/* 헤더 */}
        <header className="text-center mb-2">
          <h1 className="text-2xl font-bold">새 게시글 작성</h1>
          <p className="text-sm text-white/30 mt-2">
            커뮤니티와 당신의 일상을 공유해보세요
          </p>
        </header>

        {/* 이미지 업로드 영역 */}
        <div
          {...getRootProps({ disabled: images.length >= MAX_IMAGES })}
          className="cursor-pointer rounded-xl border-2 border-dashed border-emerald-400/30 p-7 text-center transition hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)]"
        >
          <input {...getInputProps()} className="w-full" />
          {/* 실제 file input */}
          {images.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto overflow-y-hidden">
              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    open(); // + 버튼으로만 파일 선택
                  }}
                  className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-emerald-400/40 text-emerald-400 text-2xl transition hover:border-emerald-400 hover:bg-emerald-400/10 shrink-0 w-36 h-[150px]"
                >
                  +
                </button>
              )}
              {images.map((img, idx) => (
                <div
                  key={img.preview}
                  className="relative group shrink-0 w-[163px] h-[150px]"
                >
                  <img
                    src={img.preview}
                    alt={`preview-${idx}`}
                    className="h-full w-full object-cover"
                  />

                  {/* 개별 이미지 삭제 */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="absolute top-1 right-1 hidden h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white text-sm group-hover:flex"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : isDragActive ? (
            // 드래그 중 상태
            <strong className="text-emerald-400">파일을 여기에 놓으세요</strong>
          ) : (
            // 초기 상태
            <div>
              <button
                type="button"
                onClick={() => {
                  if (images.length >= MAX_IMAGES) return; // 이미지 5개 초과시 클릭 막음
                  open();
                }}
                className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400 text-emerald-400 text-xl"
              >
                +
              </button>
              <strong>이미지를 드래그하거나 클릭해 첨부하세요(최대 5장)</strong>
            </div>
          )}
        </div>

        {/* 제목 입력 */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className={`w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-md focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30`}
        />

        {/* 내용 입력 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          className="min-h-[300px] w-full rounded-xl border border-white/10 resize-none bg-transparent px-4 py-3 text-md focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
        />

        {/* 하단 버튼 */}
        <div className="mt-2 flex gap-3">
          <Link
            to="/"
            className="flex-1 rounded-xl border border-white/10 py-3 text-md text-center transition hover:border-emerald-400 hover:text-emerald-400"
          >
            목록으로
          </Link>

          <button
            onClick={handleClick}
            disabled={!isValid}
            className={`flex-1 rounded-xl py-3 text-md font-medium transition
                      ${
                        isValid
                          ? "bg-emerald-600 hover:brightness-110"
                          : "bg-white/10 cursor-not-allowed opacity-50"
                      }`}
          >
            작성 완료
          </button>
        </div>
      </div>
    </div>
  );
}
