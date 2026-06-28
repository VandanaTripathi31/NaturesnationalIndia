export function notFoundHandler(_req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof multerError(error)) {
    return res.status(400).json({ message: error.message });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern ?? {})[0] ?? "field";
    return res.status(409).json({
      message: `A category with this ${field} already exists`,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid category id" });
  }

  const statusCode = error.statusCode ?? 500;
  const message = error.message ?? "Internal server error";

  return res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
}

function multerError(error) {
  return error?.name === "MulterError" || /image files/i.test(error?.message ?? "");
}
