import { Header } from "@/components/header";

export default function AppLayout({ children }) {
  return (
    <>
      <Header />
      <main className="w-full">
        {children}
      </main>
    </>
  );
}