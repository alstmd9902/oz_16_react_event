import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="flex justify-center items-center gap-3 mb-6">
        <img src="/logo.svg" alt="Local Board 로고" className="w-8 h-8" />
        <h2
          onClick={() => navigate("/")}
          className="
            cursor-pointer text-center text-3xl font-bold tracking-wider
            bg-linear-to-r from-white via-[#d6f5a2] to-[#2de668]
            bg-clip-text text-transparent"
        >
          Local Board
        </h2>
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800/80 bg-neutral-900/80 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Login
        </h1>
        <p className="mb-6 text-center text-sm text-neutral-400">
          Local Board에 로그인하세요
        </p>

        <form className="space-y-4">
          <InputField
            label="email"
            hideLabel
            name="email"
            type="email"
            placeholder="이메일"
          />

          <InputField
            label="password"
            type="password"
            placeholder="비밀번호"
            hideLabel
          />

          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 font-semibold text-amber-50 transition hover:bg-green-500 hover:shadow-[0_0_12px_rgba(34,197,94,0.6)]"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-400">
          계정이 없으신가요?
          <button
            onClick={() => navigate("/signup")}
            className="pl-1.5 cursor-pointer text-white underline transition hover:text-green-400"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
