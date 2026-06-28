import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb.jsx";
import CategorySidebar from "../components/CategorySidebar.jsx";
import RelatedProducts from "../components/RelatedProducts.jsx";
import SeoHead from "../components/SeoHead.jsx";
import { publicApi } from "../lib/api.js";

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setError("");

    Promise.all([
      publicApi.getProductBySlug(slug),
      publicApi.getRelatedProducts(slug),
    ])
      .then(([productData, relatedData]) => {
        setProduct(productData.product);
        setRelatedProducts(relatedData.products ?? []);
        setActiveImage(0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="bg-[#faf6ee] px-4 py-16 text-center text-sm text-[#9C6B3C]">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#faf6ee] px-4 py-16 text-center text-sm text-red-600">
        {error || "Product not found"}
      </div>
    );
  }

  const images = product.images ?? [];

  return (
    <div className="bg-[#faf6ee] px-4 py-10 sm:px-6 lg:px-10">
      <SeoHead
        title={product.metaTitle || `${product.name} | Natures National`}
        description={product.metaDescription || product.description}
        keywords={product.metaKeywords}
      />

      <div className="mx-auto max-w-7xl">
        <Breadcrumb
          items={[
            product.category
              ? {
                  label: product.category.name,
                  href: `/category/${product.category.slug}`,
                }
              : null,
            { label: product.name },
          ].filter(Boolean)}
        />

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <CategorySidebar />

          <section>
            <div className="grid gap-8 rounded-2xl border border-[#E8DCC8] bg-white p-6 shadow-sm lg:grid-cols-2">
              <div>
                <div className="aspect-square overflow-hidden rounded-2xl bg-[#F5EFE6]">
                  {images[activeImage]?.url ? (
                    <img
                      src={images[activeImage].url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#9C6B3C]">
                      No image available
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                      <button
                        key={image.public_id}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={`aspect-square overflow-hidden rounded-xl border ${
                          activeImage === index
                            ? "border-[#3B7D4A]"
                            : "border-[#E8DCC8]"
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {product.featured && (
                    <span className="rounded-full bg-[#3B7D4A]/10 px-3 py-1 text-xs font-medium text-[#3B7D4A]">
                      Featured
                    </span>
                  )}
                  {product.category?.name && (
                    <span className="rounded-full bg-[#F5EFE6] px-3 py-1 text-xs font-medium text-[#5C3A1E]">
                      {product.category.name}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-semibold text-[#2C1A0E]">
                  {product.name}
                </h1>

                {product.botanicalName && (
                  <p className="mt-2 text-sm italic text-[#9C6B3C]">
                    {product.botanicalName}
                  </p>
                )}

                {product.description && (
                  <p className="mt-4 text-sm leading-7 text-[#5C3A1E]">
                    {product.description}
                  </p>
                )}

                <dl className="mt-6 space-y-3 text-sm">
                  {product.origin && (
                    <div className="flex gap-3">
                      <dt className="w-32 font-medium text-[#2C1A0E]">Origin</dt>
                      <dd className="text-[#5C3A1E]">{product.origin}</dd>
                    </div>
                  )}
                  {product.extractionMethod && (
                    <div className="flex gap-3">
                      <dt className="w-32 font-medium text-[#2C1A0E]">Extraction</dt>
                      <dd className="text-[#5C3A1E]">{product.extractionMethod}</dd>
                    </div>
                  )}
                </dl>

                {product.benefits?.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2C1A0E]">
                      Benefits
                    </h2>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#5C3A1E]">
                      {product.benefits.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.uses?.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2C1A0E]">
                      Uses
                    </h2>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#5C3A1E]">
                      {product.uses.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <RelatedProducts products={relatedProducts} />
          </section>
        </div>
      </div>
    </div>
  );
}
