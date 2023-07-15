import type { PropsWithChildren, ReactNode } from "react";
import Header from "../Header";
import Footer from "../Footer";

function Layout({children} : {children: ReactNode}) {

  return (
    <main className="min-h-screen">
      <Header />
      <div className="flex-grow px-4">{children}</div>
      <Footer />
    </main>
  )
}

export default Layout;