import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { publicApi } from "../lib/api.js";

export default function CategorySidebar() {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getCategories()
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <aside className="rounded-2xl border border-[#E8DCC8] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-[#2C1A0E]">Categories</h2>

      {isLoading ? (
        <p className="text-sm text-[#9C6B3C]">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-[#9C6B3C]">No categories available.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((category) => {
            const isActive = slug === category.slug;

            return (
              <li key={category.id}>
                <Link
                  to={`/category/${category.slug}`}
                  className={`block rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-[#3B7D4A] font-medium text-white"
                      : "text-[#5C3A1E] hover:bg-[#FBF7F2]"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
