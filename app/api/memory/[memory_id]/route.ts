import { NextRequest } from 'next/server';
import { ChatSDKError } from '@/lib/error';

const API_BASE_URL = process.env.MEMORY_API_BASE_URL || 'http://127.0.0.1:8000';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { memory_id: string } }
) {
  try {
    const { memory_id } = params;
    const authorization = request.headers.get('authorization');

    if (!authorization) {
      throw new ChatSDKError('unauthorized:memory');
    }

    if (!memory_id || memory_id.trim() === '') {
      throw new ChatSDKError(
        'bad_request:memory',
        'Memory ID is required'
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/memory/${memory_id}`,
      {
        method: 'DELETE',
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
          'Failed to delete memory'
        );
      }
    }

    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error('Unexpected error deleting memory:', error);
    return new ChatSDKError('bad_request:memory').toResponse();
  }
}