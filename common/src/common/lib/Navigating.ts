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

export function getHrefWithoutQueryString() {
  if (typeof window === "undefined") {
    return null;
  }
  const href = window.location.href;
  const queryStringIndex = href.indexOf("?");
  if (queryStringIndex === -1) {
    return href;
  }
  return href.substring(0, queryStringIndex);
}
