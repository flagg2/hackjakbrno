import Header from "@/components/header";

export default function FileLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { fileId: string };
}>) {
  return (
    <>
      <Header fileId={params.fileId} />
      {children}
    </>
  );
}
