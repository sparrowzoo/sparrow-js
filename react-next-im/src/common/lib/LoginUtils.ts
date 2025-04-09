export default function loginDirect() {
  console.log("loginDirect");
  if (!window) {
    return;
  }
  const queryString = window.location.search;
  if (!queryString) {
    window.location.href = "/";
    return;
  }
  window.location.href = queryString.substring(1);
}
