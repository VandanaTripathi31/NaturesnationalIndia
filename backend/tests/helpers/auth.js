import { Admin } from "../../src/db/models/index.js";

// Creates (or reuses) the test admin and returns a Bearer header value.
export async function adminAuth(baseUrl) {
  await Admin.findOrCreate({
    where: { email: "tester@example.com" },
    defaults: { name: "Tester", password: "secret1" },
  });
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "tester@example.com", password: "secret1" }),
  });
  const { token } = await res.json();
  return { Authorization: `Bearer ${token}` };
}

// JSON request helper: api(baseUrl, headers)(method, path, body?) -> { status, body }
export function api(baseUrl, headers = {}) {
  return async (method, path, body) => {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    let json = null;
    try {
      json = await res.json();
    } catch {
      /* empty body */
    }
    return { status: res.status, body: json };
  };
}
