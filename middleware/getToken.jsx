import { redirect } from "react-router-dom";

export function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

export function checkAuthLoader() {
  const token = getToken();
  if (!token) {
    return redirect("/login");
  }
  return null;
}
