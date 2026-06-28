import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-[#9C6B3C]">
        <li>
          <Link to="/" className="transition hover:text-[#2C1A0E]">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link to={item.href} className="transition hover:text-[#2C1A0E]">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-[#2C1A0E]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
