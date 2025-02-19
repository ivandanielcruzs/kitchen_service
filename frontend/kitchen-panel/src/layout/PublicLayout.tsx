import { ChildrenProps } from "../interfaces/childrenElements";

const PublicLayout = ({ children }: ChildrenProps) => {
  return (
    <>
      <div className="body-content container">{children}</div>
    </>
  );
};

export default PublicLayout;
