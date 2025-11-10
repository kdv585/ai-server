import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get("keyword");
    const entityType = searchParams.get("entityType");

    if (!keyword) {
      return NextResponse.json(
        { code: 400, message: "keyword 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    // 백엔드 API 호출
    const params = new URLSearchParams({ keyword });
    if (entityType) {
      params.append("entityType", entityType);
    }

    const backendUrl = `http://localhost:8080/api/soccer/search/findByKeyword?${params.toString()}`;
    
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { code: response.status, message: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("프록시 에러:", error);
    return NextResponse.json(
      {
        code: 500,
        message: `서버 오류: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      },
      { status: 500 }
    );
  }
}

