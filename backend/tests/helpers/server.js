import "./env.js";

// Starts the real Express app on a random port. Import after ./env.js.
export async function startTestServer() {
  const { createApp } = await import("../../src/app.js");
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  return {
    baseUrl,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
