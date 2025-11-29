// app/api/memory/all/route.ts
import { NextRequest } from 'next/server';
import { ChatSDKError } from '@/lib/error';

const API_BASE_URL = process.env.MEMORY_API_BASE_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('page_size') || '100';
    const authorization = request.headers.get('authorization');
    console.log("AHIHI",authorization)

    if (!authorization) {
      throw new ChatSDKError('unauthorized:memory');
    }

    // Validate parameters
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);

    if (isNaN(pageNum) || pageNum < 1) {
      throw new ChatSDKError(
        'bad_request:memory',
        'Page must be a number greater than or equal to 1'
      );
    }

    if (isNaN(pageSizeNum) || pageSizeNum < 1 || pageSizeNum > 200) {
      throw new ChatSDKError(
        'bad_request:memory',
        'Page size must be between 1 and 200'
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/memory/all?page=${pageNum}&page_size=${pageSizeNum}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authorization,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      // Map HTTP status to appropriate error
      if (response.status === 401) {
        throw new ChatSDKError('unauthorized:memory');
      } else if (response.status === 403) {
        throw new ChatSDKError('forbidden:memory');
      } else if (response.status === 404) {
        throw new ChatSDKError('not_found:memory');
      } else if (response.status === 429) {
        throw new ChatSDKError('rate_limit:memory');
      } else if (response.status === 422) {
        const errorData = await response.json();
        throw new ChatSDKError(
          'bad_request:memory',
          errorData.detail?.[0]?.msg || 'Validation error'
        );
      } else {
        throw new ChatSDKError(
          'bad_request:memory',
          'Failed to fetch memories'
        );
      }
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error('Unexpected error fetching memories:', error);
    return new ChatSDKError('bad_request:memory').toResponse();
  }
}
