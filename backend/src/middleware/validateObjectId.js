import mongoose from "mongoose";

// Use with router.param("id", validateObjectIdParam) so a malformed id is a
// clean 400 instead of a Mongoose CastError surfacing as a 500.
export function validateObjectIdParam(req, res, next, value) {
  if (!mongoose.isValidObjectId(value)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  return next();
}
