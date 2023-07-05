import { UserButton, SignInButton, useUser, SignUpButton } from "@clerk/nextjs";


const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <nav className="bg-slate-800 h-24 flex items-center gap-4">
      {!isSignedIn && (
        <div className="flex gap-4">
          <SignUpButton>
            <span className="cursor-pointer text-white">Sign up</span>
          </SignUpButton>
          <SignInButton>
            <span className="cursor-pointer text-white">Sign in</span>
          </SignInButton>
        </div>
      )}
      {isSignedIn && <UserButton />}
    </nav>
  )
}


export default Navbar;