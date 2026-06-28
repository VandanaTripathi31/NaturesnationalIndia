function parseBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return ["true", "1", "active", "yes"].includes(String(value).toLowerCase());
}

function validateName(name) {
  if (!name || !String(name).trim()) {
    return "Category name is required";
  }

  if (String(name).trim().length < 2) {
    return "Category name must be at least 2 characters";
  }

  if (String(name).trim().length > 120) {
    return "Category name cannot exceed 120 characters";
  }

  return null;
}

function validateSeoFields(body) {
  const { metaTitle, metaDescription, metaKeywords, description } = body;

  if (description && String(description).length > 1000) {
    return "Description cannot exceed 1000 characters";
  }

  if (metaTitle && String(metaTitle).length > 70) {
    return "Meta title cannot exceed 70 characters";
  }

  if (metaDescription && String(metaDescription).length > 160) {
    return "Meta description cannot exceed 160 characters";
  }

  if (metaKeywords && String(metaKeywords).length > 255) {
    return "Meta keywords cannot exceed 255 characters";
  }

  return null;
}

export function validateCreateCategory(req, res, next) {
  const nameError = validateName(req.body.name);

  if (nameError) {
    return res.status(400).json({ message: nameError });
  }

  const seoError = validateSeoFields(req.body);

  if (seoError) {
    return res.status(400).json({ message: seoError });
  }

  req.body.isActive = parseBoolean(req.body.isActive, true);
  return next();
}

export function validateUpdateCategory(req, res, next) {
  if (req.body.name !== undefined) {
    const nameError = validateName(req.body.name);

    if (nameError) {
      return res.status(400).json({ message: nameError });
    }
  }

  const seoError = validateSeoFields(req.body);

  if (seoError) {
    return res.status(400).json({ message: seoError });
  }

  if (req.body.isActive !== undefined) {
    req.body.isActive = parseBoolean(req.body.isActive, true);
  }

  return next();
}

export function validateStatusUpdate(req, res, next) {
  if (req.body.isActive === undefined) {
    return res.status(400).json({ message: "isActive is required" });
  }

  req.body.isActive = parseBoolean(req.body.isActive, true);
  return next();
}
