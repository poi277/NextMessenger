import Header from "@/features/header/header"
import { AuthProvider } from "@/context/AuthContext"

export default function NormalLayout({ children }) {
  return (
    <>
        <Header/>
      {children}
    </>
  );
}
