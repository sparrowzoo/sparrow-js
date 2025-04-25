export default class UrlUtils {
  public static isCros(url: string, url2: string) {
    return !this.isSameDomain(url, url2);
  }

  public static isSameDomain(url: string, url2: string): boolean {
    try {
      const urlObj1 = new URL(url);
      const urlObj2 = new URL(url2);
      return (
        urlObj1.protocol === urlObj2.protocol &&
        urlObj1.hostname === urlObj2.hostname &&
        urlObj1.port === urlObj2.port
      );
    } catch (e) {
      return false;
    }
  }

  public static getParameter(name: string) {
    if (typeof document === "undefined") {
      return null;
    }
    var params = new URL(document.location.href).searchParams;
    return params.get(name);
  }

  public static getQueryString() {
    if (typeof window === "undefined") {
      return null;
    }
    const queryString = window.location.search;
    if (!queryString) {
      null;
    }
    return decodeURIComponent(queryString.substring(1));
  }

  public static getHrefWithoutQueryString() {
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
}
