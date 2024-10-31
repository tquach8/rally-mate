import { getUser } from "@/app/lib/dal";
import Navigation from "./Navigation";
import { UserProvider } from "./user-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="h-screen bg-secondary-700 flex flex-col">
      <div className="h-full bg-tertiary-700 p-8 rounded-lg flex flex-col gap-4">
        {user && (
          <UserProvider user={user}>
            <Navigation />

            <div className="h-full w-full">{children}</div>
          </UserProvider>
        )}
      </div>
    </div>
  );
}
