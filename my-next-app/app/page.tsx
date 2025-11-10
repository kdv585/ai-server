"use client";

import { useState } from "react";

interface Messenger {
  code: number;
  message: string;
  data?: any;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      alert("입력된 텍스트가 없습니다.");
      return;
    }

    setLoading(true);
    try {
      // Next.js API 라우트를 통해 프록시 요청
      const params = new URLSearchParams({
        keyword: trimmedInput,
      });

      const url = `/api/soccer/search?${params.toString()}`;
      console.log("요청 URL:", url);
      console.log("입력한 검색어:", trimmedInput);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API 응답 오류:", response.status, errorText);
        throw new Error(`API 요청 실패 (${response.status}): ${errorText}`);
      }

      const data: Messenger = await response.json();
      console.log("백엔드 응답:", data);

      // 응답 데이터를 알러트로 표시
      const alertMessage = data.data
        ? JSON.stringify(data.data, null, 2)
        : data.message || "데이터가 없습니다.";

      alert(alertMessage);
    } catch (error) {
      console.error("에러 발생:", error);
      alert(`에러가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-lg font-semibold text-gray-900"></h1>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <div className="max-w-3xl w-full flex flex-col items-center">
          {/* 중앙 질문 */}
          <h2 className="text-3xl font-normal text-gray-900 mb-8 text-center">
            한국 축구 K리그 관련 질문만 받습니다. 다른 분야는 대답하지 않습니다.
          </h2>

          {/* 입력 바 */}
          <div className="w-full max-w-2xl">
            <div className="relative flex items-center bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              {/* 플러스 아이콘 */}
              <button className="p-3 text-gray-600 hover:text-gray-900">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>

              {/* 입력 필드 */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="전체 축구팀 목록을 알려줘."
                className="flex-1 py-3 px-2 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none text-base"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleSearch();
                  }
                }}
              />

              {/* 마이크 아이콘 */}
              <button
                className="p-3 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                onClick={handleSearch}
                disabled={loading}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>

              {/* 오디오 아이콘 */}
              <button className="p-2 mr-2 text-gray-600 hover:text-gray-900">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
