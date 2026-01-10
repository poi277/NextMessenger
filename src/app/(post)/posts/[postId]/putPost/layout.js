import Header from "@/features/header/header";

export default function NormalLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
