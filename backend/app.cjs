// Passenger (cPanel "Setup Node.js App") loads the startup file with
// require(), which cannot load an ES module that uses top-level await.
// Point the startup file at this wrapper instead of server.js.
import("./server.js").catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
