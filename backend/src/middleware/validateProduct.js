function parseBoolean(value, fallback = true) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return ["true", "1", "active", "yes"].includes(String(value).toLowerCase());
}

export function parseRemovedImageIds(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  const trimmed = value.trim();

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return [];
    }
  }

  return [trimmed];
}

function parseStringArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  const trimmed = value.trim();

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // fall through to delimiter parsing
    }
  }

  return trimmed
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateName(name) {
  if (!name || !String(name).trim()) {
    return "Product name is required";
  }

  if (String(name).trim().length < 2) {
    return "Product name must be at least 2 characters";
  }

  if (String(name).trim().length > 160) {
    return "Product name cannot exceed 160 characters";
  }

  return null;
}

function validateSeoFields(body) {
  const { metaTitle, metaDescription, metaKeywords, description } = body;

  if (description && String(description).length > 5000) {
    return "Description cannot exceed 5000 characters";
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

function validateCategoryId(category) {
  if (!category || !String(category).trim()) {
    return "Category is required";
  }

  return null;
}

export function validateCreateProduct(req, res, next) {
  const nameError = validateName(req.body.name);

  if (nameError) {
    return res.status(400).json({ message: nameError });
  }

  const categoryError = validateCategoryId(req.body.category);

  if (categoryError) {
    return res.status(400).json({ message: categoryError });
  }

  const seoError = validateSeoFields(req.body);

  if (seoError) {
    return res.status(400).json({ message: seoError });
  }

  req.body.isActive = parseBoolean(req.body.isActive, true);
  req.body.featured = parseBoolean(req.body.featured, false);
  req.body.benefits = parseStringArray(req.body.benefits);
  req.body.uses = parseStringArray(req.body.uses);
  req.body.removedImageIds = parseRemovedImageIds(req.body.removedImageIds);

  return next();
}

export function validateUpdateProduct(req, res, next) {
  if (req.body.name !== undefined) {
    const nameError = validateName(req.body.name);

    if (nameError) {
      return res.status(400).json({ message: nameError });
    }
  }

  if (req.body.category !== undefined) {
    const categoryError = validateCategoryId(req.body.category);

    if (categoryError) {
      return res.status(400).json({ message: categoryError });
    }
  }

  const seoError = validateSeoFields(req.body);

  if (seoError) {
    return res.status(400).json({ message: seoError });
  }

  if (req.body.isActive !== undefined) {
    req.body.isActive = parseBoolean(req.body.isActive, true);
  }

  if (req.body.featured !== undefined) {
    req.body.featured = parseBoolean(req.body.featured, false);
  }

  if (req.body.benefits !== undefined) {
    req.body.benefits = parseStringArray(req.body.benefits);
  }

  if (req.body.uses !== undefined) {
    req.body.uses = parseStringArray(req.body.uses);
  }

  if (req.body.removedImageIds !== undefined) {
    req.body.removedImageIds = parseRemovedImageIds(req.body.removedImageIds);
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

export function validateFeaturedUpdate(req, res, next) {
  if (req.body.featured === undefined) {
    return res.status(400).json({ message: "featured is required" });
  }

  req.body.featured = parseBoolean(req.body.featured, false);
  return next();
}
