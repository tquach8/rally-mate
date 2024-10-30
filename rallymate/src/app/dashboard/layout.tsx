import { getUser } from "@/app/lib/dal";
import Navigation from "./Navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <div className="bg-secondary-700 h-screen overflow-hidden">
      <div className="h-full bg-tertiary-700 p-8 rounded-lg">
        <Navigation username={user?.name} />
        <div className="h-full w-full p-12">{children}</div>
      </div>
    </div>
  );
}
