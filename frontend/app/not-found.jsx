import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-[#faf6ee] px-4 text-center">
      <h1 className="text-3xl font-semibold text-[#2C1A0E]">Page not found</h1>
      <p className="mt-3 text-sm text-[#9C6B3C]">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-[#3B7D4A] px-5 py-2.5 text-sm font-medium text-white"
      >
        Back to home
      </Link>
    </div>
  );
}
