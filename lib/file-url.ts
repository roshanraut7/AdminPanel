const RAW_BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_AUTH_URL ??
  "";

function getBackendOrigin(): string {
  const rawBase = RAW_BACKEND_BASE_URL.trim();

  if (!rawBase) {
    return "";
  }

  try {
    /*
     * This returns only the backend origin.
     *
     * Examples:
     * http://localhost:3000/api/auth
     * becomes:
     * http://localhost:3000
     *
     * http://localhost:3000/api
     * also becomes:
     * http://localhost:3000
     */
    return new URL(rawBase).origin;
  } catch {
    const cleanedBase = rawBase
      .replace(/\/api\/auth\/?$/i, "")
      .replace(/\/api\/?$/i, "")
      .replace(/\/+$/, "");

    return cleanedBase;
  }
}

export function toAbsoluteFileUrl(
  url?: string | null,
): string | undefined {
  if (!url) {
    return undefined;
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return undefined;
  }

  /*
   * Leave already complete URLs unchanged.
   */
  if (
    /^(https?:\/\/|file:\/\/|data:|blob:)/i.test(
      trimmedUrl,
    )
  ) {
    return trimmedUrl;
  }

  const backendOrigin = getBackendOrigin();

  const normalizedPath = trimmedUrl.startsWith("/")
    ? trimmedUrl
    : `/${trimmedUrl}`;

  if (!backendOrigin) {
    console.error(
      "Backend URL is missing. Configure NEXT_PUBLIC_BACKEND_URL.",
    );

    return normalizedPath;
  }

  /*
   * URL handles joining and encoding safely.
   */
  return new URL(
    normalizedPath,
    `${backendOrigin}/`,
  ).toString();
}