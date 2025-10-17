import { auth } from "../firebaseClient";

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const idToken = await user.getIdToken();

  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${idToken}`);

  return fetch(input, { ...init, headers });
}
