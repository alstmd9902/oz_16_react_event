import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate(); //페이지 이동
  const handleLoginClick = () => {
    navigate("login");
  };

  return (
    <>
      <nav
        className="
        fixed top-0 left-0 z-10 w-full h-14
        flex items-center justify-between
        px-6
        bg-[rgba(28,28,28,0.31)]
        backdrop-blur-md
        border-b border-white/10
      "
      >
        <h1 className="text-sm font-semibold text-[#e6e8eb] tracking-wide">
          Local Board
        </h1>
        <div className="flex items-center gap-3">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full transition cursor-pointer"
            aria-label="toggle dark mode"
          >
            🌙
          </button>
          {/* 로그인 */}

          <button
            onClick={handleLoginClick}
            className="
              text-sm font-medium
              px-2 py-1
              rounded-md
              hover:text-[#7CFF6B]
              hover:bg-white/5
              transition
              cursor-pointer
            "
          >
            Login
          </button>
        </div>
      </nav>
    </>
  );
}
