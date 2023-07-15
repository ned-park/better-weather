import Navbar from "./Navbar";

function Header() {
  return (
    <header className="bg-slate-800 h-24 flex items-center justify-between px-8">
      <h1 className="text-white text-xl">{process.env.NEXT_PUBLIC_TITLE}</h1>
      <Navbar />
    </header>
  )
}

export default Header;
