import NavBar from "../components/Navbar/NavbarItem";
import { ChildrenProps } from "../interfaces/childrenElements";

const SignInLayout = ({ children }: ChildrenProps) => {
  return (
    <>
      <NavBar></NavBar>
      <div className="body-content container">{children}</div>
    </>
  );
};

export default SignInLayout;
