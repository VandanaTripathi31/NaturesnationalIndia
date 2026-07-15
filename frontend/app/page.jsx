import HomePage from "../src/components/HomePage";
import { getCategories } from "../src/services/categoryService";

export default async function Page() {
  let categories = [];

  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return <HomePage categories={categories} />;
}
