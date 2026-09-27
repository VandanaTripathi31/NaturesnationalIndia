import ToastProvider from "@/components/admin/ToastProvider";

export const metadata = {
  title: "Admin | Natures National",
  description: "Natures National admin panel",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <ToastProvider />
    </>
  );
}
