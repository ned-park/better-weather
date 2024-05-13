import Navbar from "./Navbar";

function Header() {
  return (
    <header className="bg-slate-800 h-24 flex items-center justify-between px-8">
      <h1 className="text-white text-xl">{"Weekly Weather"}</h1>
      <Navbar />
    </header>
  )
}

export default Header;
