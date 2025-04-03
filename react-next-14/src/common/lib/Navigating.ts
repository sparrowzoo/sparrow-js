export function loginDirect(directUrl: string) {
  if (typeof window === "undefined") {
    return;
  }
  if (directUrl) {
    window.location.href = directUrl;
    return;
  }
  window.location.href = "/";
}

export function getQueryString() {
  if (typeof window === "undefined") {
    return null;
  }
  const queryString = window.location.search;
  if (!queryString) {
    null;
  }
  return decodeURIComponent(queryString.substring(1));
}
