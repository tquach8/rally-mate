import { getUser } from "@/app/lib/dal";
import Navigation from "./Navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="bg-secondary-700 min-h-screen">
      <div className="min-h-screen bg-tertiary-700 p-8 rounded-lg">
        <Navigation />
      </div>
    </div>
  );
}
