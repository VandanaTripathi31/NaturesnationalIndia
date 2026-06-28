import { Link } from "react-router-dom";

export default function RelatedProducts({ products = [], title = "Related Products" }) {
  if (!products.length) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-semibold text-[#2C1A0E]">{title}</h2>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.slug}`}
            className="overflow-hidden rounded-2xl border border-[#E8DCC8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="aspect-square overflow-hidden bg-[#F5EFE6]">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#9C6B3C]">
                  No image
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-medium text-[#2C1A0E]">{product.name}</h3>
              <p className="mt-1 text-xs text-[#9C6B3C]">
                {product.category?.name ?? "Product"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
