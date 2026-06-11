import { NextRequest, NextResponse } from 'next/server';

const AGNES_API_HOST = 'https://apihub.agnes-ai.com';
const AGNES_API_KEY =
  process.env.AGNES_API_KEY || process.env.NEXT_PUBLIC_AGNES_API_KEY || '';

async function proxy(request: NextRequest, pathSegments: string[]) {
  if (!AGNES_API_KEY) {
    return NextResponse.json(
      { error: { message: '服务暂不可用，请联系管理员配置 API Key' } },
      { status: 503 },
    );
  }

  const isAgnesApi = pathSegments[0] === 'agnesapi';
  const upstreamPath = pathSegments.join('/');
  const targetUrl = isAgnesApi
    ? `${AGNES_API_HOST}/${upstreamPath}${request.nextUrl.search}`
    : `${AGNES_API_HOST}/v1/${upstreamPath}${request.nextUrl.search}`;

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${AGNES_API_KEY}`);

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const init: RequestInit & { duplex?: 'half' } = {
    method: request.method,
    headers,
  };

  if (hasBody) {
    init.body = request.body;
    init.duplex = 'half';
  }

  const upstream = await fetch(targetUrl, init);
  const responseHeaders = new Headers();
  const upstreamContentType = upstream.headers.get('Content-Type');
  if (upstreamContentType) {
    responseHeaders.set('Content-Type', upstreamContentType);
    if (upstreamContentType.includes('text/event-stream')) {
      responseHeaders.set('Cache-Control', 'no-cache, no-transform');
      responseHeaders.set('Connection', 'keep-alive');
      responseHeaders.set('X-Accel-Buffering', 'no');
    }
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxy(request, path);
}
