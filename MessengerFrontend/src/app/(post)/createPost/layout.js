import Header from "@/features/header/header"
import { AuthProvider } from "@/context/AuthContext"
import FriendSidebar from "@/features/friendsSidebar/FriendSidebar";

export default function NormalLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
