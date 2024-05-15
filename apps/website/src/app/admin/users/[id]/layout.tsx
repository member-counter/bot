import { LoadUser } from "../LoadUser";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden sm:block">
        <LoadUser />
      </div>
      {children}
    </>
  );
}
