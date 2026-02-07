import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PostDetail({ posts, updatePost, deletePost }) {
  const navigate = useNavigate();
  const { id } = useParams();

  // 게시글 찾기
  const post = posts.find((p) => String(p.id) === id);

  const [currentPost, setCurrentPost] = useState(post);

  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  // 편집 상태 및 입력값 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const MAX_IMAGES = 5;
  const [editImages, setEditImages] = useState([]); // { file?: File|null, preview: string }[]

  // 편집 모드 진입 시 기존 게시글 데이터 복사
  useEffect(() => {
    if (!isEditing || !currentPost) return;

    setEditTitle(currentPost.title);
    setEditContent(currentPost.contents);

    setEditImages(
      (currentPost.images || []).map((url) => ({
        file: null,
        preview: url
      }))
    );
  }, [isEditing, currentPost]);

  // 이미지 확대 모달 상태
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  // 이미지 추가/삭제 핸들러
  const addImages = (files) => {
    const remain = MAX_IMAGES - editImages.length;
    if (remain <= 0) return;

    const next = files.slice(0, remain).map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setEditImages((prev) => [...prev, ...next]);
  };

  const removeImage = (idx) => {
    setEditImages((prev) => prev.filter((_, i) => i !== idx));
  };

  // 이미지 확대 모달 열기/닫기
  const openImage = (url) => {
    setActiveImage(url);
    setIsImageOpen(true);
  };
  const closeImage = () => {
    setIsImageOpen(false);
    setActiveImage(null);
  };

  // 편집 취소: 원본 상태로 복구
  const handleCancel = () => {
    setIsEditing(false);
    if (!currentPost) return;

    setEditTitle(currentPost.title);
    setEditContent(currentPost.contents);
    setEditImages(
      (currentPost.images || []).map((url) => ({
        file: null,
        preview: url
      }))
    );
  };

  // 편집 저장: FormData로 서버에 전송
  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("contents", editContent);

    // 기존 이미지 URL만 추출해서 JSON 문자열로 전송
    const existingImages = editImages
      .filter((img) => img.file === null)
      .map((img) => img.preview);

    // 추가
    const isImagesCleared = existingImages.length === 0;

    formData.append("existingImages", JSON.stringify(existingImages));
    formData.append("imagesCleared", String(isImagesCleared));

    // 새 이미지 파일 추가
    editImages.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
      }
    });

    // 서버 업데이트 및 UI 반영
    await updatePost(currentPost.id, formData);
    setIsEditing(false);
  };

  // 게시글 삭제 및 메인으로 이동
  const handleDelete = async () => {
    const isConfirmed = window.confirm("정말로 이 게시글을 삭제하시겠습니까?");
    if (!isConfirmed) return;

    await deletePost(currentPost.id);
    navigate("/");
  };

  const fileInputRef = useRef(null);

  // 이미지 업로드 영역 렌더링 (편집 모드)
  const renderImageUploader = () => {
    if (editImages.length > 0) {
      return (
        <div className="rounded-xl border-2 border-dashed border-emerald-400/30 p-7 text-center transition pointer-events-auto">
          <div className="flex gap-3 overflow-x-auto overflow-y-hidden pointer-events-auto">
            {editImages.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-emerald-400/40 text-emerald-400 text-2xl transition hover:border-emerald-400 hover:bg-emerald-400/10 shrink-0 w-36 h-[150px] pointer-events-auto"
              >
                +
              </button>
            )}

            {editImages.map((img, idx) => (
              <div
                key={img.preview}
                className="relative group shrink-0 w-[164px] h-[150px]"
              >
                <img
                  src={img.preview}
                  alt={`preview-${idx}`}
                  className="h-full w-full object-cover"
                />
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
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => addImages(Array.from(e.target.files))}
          />
          <div className="pointer-events-none">
            {/* 빈 영역 pointer-events-none 처리 */}
          </div>
        </div>
      );
    }

    // 이미지가 없을 때 업로드 안내
    return (
      <div
        onClick={() => fileInputRef.current?.click()}
        className="block cursor-pointer rounded-xl border-2 border-dashed border-emerald-400/30 p-7 text-center transition hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.35)] pointer-events-auto"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400 text-emerald-400 text-2xl">
            +
          </div>
          <strong>이미지를 드래그하거나 클릭해 첨부하세요(최대 5장)</strong>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => addImages(Array.from(e.target.files))}
        />
      </div>
    );
  };

  // 게시글 이미지 뷰어 렌더링 (읽기 모드)
  const renderImagesView = () => {
    if (!currentPost.images?.length) {
      return <span className="text-white/30"></span>;
    }

    if (currentPost.images.length === 1) {
      return (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => openImage(currentPost.images[0])}
            className="relative w-full max-w-xl rounded-xl overflow-hidden border border-white/10 bg-black/30 group"
          >
            <img
              src={currentPost.images[0]}
              alt="대표 이미지"
              className="w-full h-auto object-contain"
            />
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/30 flex items-center justify-center">
              <span className="text-white/90 text-sm px-3 py-1 rounded-full bg-black/60">
                확대해서 보기
              </span>
            </div>
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => openImage(currentPost.images[0])}
          className="relative md:col-span-2 rounded-xl overflow-hidden border border-white/10 bg-black/30 group"
        >
          <img
            src={currentPost.images[0]}
            alt="대표 이미지"
            className="w-full h-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/30 flex items-center justify-center">
            <span className="text-white/90 text-sm px-3 py-1 rounded-full bg-black/60">
              확대해서 보기
            </span>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3">
          {currentPost.images.slice(1, 5).map((url, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => openImage(url)}
              className="relative rounded-xl overflow-hidden border border-white/10 bg-black/30 group"
            >
              <img
                src={url}
                alt={`보조 이미지 ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/30 flex items-center justify-center">
                <span className="text-white/90 text-xs px-2 py-1 rounded-full bg-black/60">
                  확대
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!currentPost) {
    return (
      <div className="p-8 text-center text-white/60">
        게시글을 불러오는 중입니다.
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center px-4">
        <div className="w-full max-w-5xl flex flex-col gap-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8">
          {/* 헤더 */}
          <div className="relative flex items-center justify-center mb-2">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 p-2 text-white/60 hover:text-gray-200"
            >
              ← 뒤로가기
            </button>
            <h1 className="text-2xl font-extrabold">게시물 상세</h1>
          </div>

          {/* 이미지 영역 */}
          {isEditing ? renderImageUploader() : renderImagesView()}

          {/* 제목 */}
          {isEditing ? (
            <input
              className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-md font-semibold"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          ) : (
            <div className="w-full rounded-xl border border-white/10 px-4 py-3 font-semibold">
              {currentPost.title}
            </div>
          )}

          {/* 내용 */}
          {isEditing ? (
            <textarea
              className="w-full min-h-[300px] rounded-xl border border-white/10 bg-transparent px-4 py-3 resize-none"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          ) : (
            <div className="w-full min-h-[300px] rounded-xl border border-white/10 px-4 py-3 whitespace-pre-wrap">
              {currentPost.contents}
            </div>
          )}

          {/* 작성일 */}
          <span className="text-xs">
            작성일: {dayjs(currentPost.date).format("YYYY-MM-DD HH:mm")}
          </span>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3 pointer-events-auto">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 rounded-lg bg-white/10 pointer-events-auto"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-2 rounded-lg bg-emerald-600 pointer-events-auto"
                >
                  저장
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-2 rounded-lg bg-emerald-600 pointer-events-auto"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 rounded-lg bg-red-700 pointer-events-auto"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 이미지 확대 모달 */}
      {isImageOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={closeImage}
        >
          <div
            className="bg-[#1a1a1a] rounded-xl p-12 w-[90vw] h-[94vh] flex items-center justify-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeImage}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
              aria-label="닫기"
            >
              ✕
            </button>
            <img src={activeImage} alt="확대 이미지" className="object-cover" />
          </div>
        </div>
      )}
    </>
  );
}
