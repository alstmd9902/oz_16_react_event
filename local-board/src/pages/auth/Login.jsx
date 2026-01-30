import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">
          Login
        </h1>
        <p className="mb-6 text-center text-sm text-neutral-400">
          Local Board에 로그인하세요
        </p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600"
          />

          <input
            type="password"
            placeholder="비밀번호"
            className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-600"
          />

          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 font-semibold text-amber-50
            transition hover:bg-green-500"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-400">
          계정이 없으신가요?
          <span
            onClick={() => navigate("/signup")}
            className="cursor-pointer text-white underline"
          >
            회원가입
          </span>
        </div>
      </div>
    </div>
  );
}
