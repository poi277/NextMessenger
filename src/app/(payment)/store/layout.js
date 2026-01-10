import Header from "@/features/header/header"
import ShoppingCartIcon from "../../../features/store/icon/CartIconComponent";

export default function NormalLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <ShoppingCartIcon/>
    </>   
  );
}
