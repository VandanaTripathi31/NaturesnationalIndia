const SectionHeader = ({ label, title, description, className = "" }) => (
  <div className={`text-center ${className}`}>
    {label && (
      <div className="text-[11px] uppercase tracking-[0.3em] text-[#8b6914] font-semibold mb-3">
        {label}
      </div>
    )}
    {title && (
      <h2 className="font-playfair text-3xl font-semibold text-[#3a2c1a] leading-tight sm:text-4xl">
        {title}
      </h2>
    )}
    {description && (
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#7a6450] sm:text-base">
        {description}
      </p>
    )}
  </div>
);

export default SectionHeader;
