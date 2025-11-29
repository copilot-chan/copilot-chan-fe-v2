import { AppError } from "./error";

export const fetcher = async (key: [string, string]) => {
  const [url, token] = key;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    let message = res.statusText;
    let code = "API_ERROR";

    try {
      const data = await res.json();
      message = data.message || data.error || message;
      code = data.code || code;
    } catch {}

    throw new AppError(message, res.status, code);
  }

  return res.json();
};


export const authFetcher = async ([url, token]: [string, string]) => {
  const response = await fetch(url, {
    headers: {
      'Authorization':  `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const { code, cause } = await response.json();
    throw new AppError(cause);
  }

  return response.json();
};
