// Import this first in every test file: loads backend/.env and switches the
// db layer to the TEST_DB_NAME database before anything touches Sequelize.
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, "..", "..", ".env"), quiet: true });
process.env.NODE_ENV = "test";
process.env.JWT_SECRET ||= "test-secret";

if (!process.env.TEST_DB_NAME || process.env.TEST_DB_NAME === process.env.DB_NAME) {
  throw new Error("TEST_DB_NAME must be set and differ from DB_NAME");
}

// Never call Google reCAPTCHA or Brevo from tests.
delete process.env.RECAPTCHA_SECRET_KEY;
delete process.env.BREVO_API_KEY;
