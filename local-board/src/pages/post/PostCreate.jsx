import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Link } from "react-router-dom";
import { useImageUploader } from "../../hooks/useImageUploader";
/**
 * 게시글 작성 페이지
 * - 이미지 업로드 + 제목/내용 입력
 * - 이미지 최대 5장 제한
 * - 초과 시 경고 + 업로드 차단
 */
export default function PostCreate({ addPost }) {
  const { images, addImages, removeImage, resetImages, MAX_IMAGES } =
    useImageUploader();

  const [title, setTitle] = useState(""); // 게시글 제목
  const [content, setContent] = useState(""); // 게시글 내용

  // 제목 또는 내용이 하나라도 없다면 버튼 비활성화 해야함 false ,true 로 비교
  const isValid = Boolean(title.trim() && content.trim());

  const handleClick = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("contents", content);
    images.forEach(({ file }) => formData.append("images", file));

    await addPost(formData); // 저장 완료 대기

    resetImages(); // 이미지 초기화
    setTitle(""); // 제목 초기화
    setContent(""); // 내용 초기화
  };

  // react-dropzone 단계에서 이미 컷된 경우 내용
  const onDropRejected = () => {
    alert(
      `이미지는 최대 ${MAX_IMAGES}장까지 첨부할 수 있어요. 다시 선택해주세요`
    );
  };

  // dropzone 설정 (입력 처리 + 1차 필터)
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: addImages, // 정상 케이스
    onDropRejected, // 초과 케이스
    maxFiles: MAX_IMAGES, // 1차 개수 제한
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"] // 이미지 파일만 허용
    },
    disabled: images.length >= MAX_IMAGES
  });

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
                      removeImage(idx);
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
