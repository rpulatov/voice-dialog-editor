const API_URL = process.env.API_URL;

export function fetchData<TData>(
  url: string,
  options?: {
    method?: "GET" | "POST";
    body?: BodyInit;
  }
) {
  const { method = "GET", body } = options ?? {};

  const token = Buffer.from(
    `${process.env.API_USER}:${process.env.API_PASS}`
  ).toString("base64");

  console.info({ token, u: process.env.API_USER, p: process.env.API_PASS });

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", `Basic ${token}`);
  return fetch(`${API_URL}${url}`, { method, body, headers }).then((res) => {
    return res.json().then((data) => {
      if (res.status !== 200) {
        throw new ApiError(res.statusText, data);
      }
      return data as TData;
    });
  });
}

export type ErrorResponse = {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors: { [key: string]: string[] };
};

export class ApiError extends Error {
  errorResponse: ErrorResponse;
  constructor(statusText: string, errorResponse: ErrorResponse) {
    super(statusText);
    this.errorResponse = errorResponse;
  }
}
