import type { ReactNode } from "react";
import Header from "../Header";
import Footer from "../Footer";

function Layout({ children }: { children: ReactNode }) {

  return (
    <main className="min-h-screen flex flex-col items-stretch">
      <Header />
      <div className="flex-grow px-4">{children}</div>
      <div className="self-end">
        < Footer />
      </div>
    </main>
  )
}

export default Layout;