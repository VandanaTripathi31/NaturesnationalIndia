const InquiryModal = ({ open, onClose }) => {
  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel modal-scroll"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-[#3a2c1a] px-6 py-5 text-white">
          <div>
            <h3 className="font-playfair text-2xl font-semibold">
              Request an Inquiry
            </h3>
            <p className="mt-1 text-sm text-[#d3c7aa]">
              Share your requirement and our team will respond within one
              business day.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 px-3 py-2 text-white transition hover:bg-white/20"
          >
            ✕
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-[#3a2c1a]">
                Name
                <input
                  className="w-full rounded-2xl border border-[#ddd0b8] bg-white px-4 py-3 text-sm outline-none"
                  placeholder="Your name"
                  required
                />
              </label>
              <label className="space-y-2 text-sm text-[#3a2c1a]">
                Email
                <input
                  type="email"
                  className="w-full rounded-2xl border border-[#ddd0b8] bg-white px-4 py-3 text-sm outline-none"
                  placeholder="you@example.com"
                  required
                />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-[#3a2c1a]">
                Phone
                <input
                  type="tel"
                  className="w-full rounded-2xl border border-[#ddd0b8] bg-white px-4 py-3 text-sm outline-none"
                  placeholder="+91 99999 99999"
                />
              </label>
              <label className="space-y-2 text-sm text-[#3a2c1a]">
                Product interest
                <select
                  className="w-full rounded-2xl border border-[#ddd0b8] bg-white px-4 py-3 text-sm outline-none"
                  defaultValue="Essential Oils"
                >
                  <option>Essential Oils</option>
                  <option>Carrier Oils</option>
                  <option>Aromatic Extracts</option>
                  <option>Private Label</option>
                </select>
              </label>
            </div>
            <label className="space-y-2 text-sm text-[#3a2c1a]">
              Message
              <textarea
                rows="4"
                className="w-full rounded-2xl border border-[#ddd0b8] bg-white px-4 py-3 text-sm outline-none"
                placeholder="Tell us about your requirement"
              />
            </label>
            <button
              type="submit"
              className="btn-primary w-full bg-[#3a2c1a] px-6 py-3 text-white"
            >
              Submit Inquiry
            </button>
          </form>
          <div className="mt-6 rounded-3xl bg-[#f7f0e0] px-6 py-5 text-sm text-[#7a6450]">
            <p className="font-semibold text-[#3a2c1a]">Need quick support?</p>
            <p className="mt-2">
              Email us at info@naturesnaturalindia.com or call +91 99999 99999.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
