import type { PropsWithChildren } from "react";
import Header from "../Header";
import Footer from "../Footer";

type LayoutOwnProps = {
  handleShowPreviousSearch?: boolean;
};

const Layout: React.FC<PropsWithChildren & LayoutOwnProps> = ({
  children,
}) => {



  return (
    <main className="min-h-screen">
      <Header />
      <div className="flex-grow px-4">{children}</div>
      <Footer />
    </main>
  )
}

export default Layout;