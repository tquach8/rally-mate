import { getUser } from "@/app/lib/dal";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
 
  return (
    <div>Hello {user?.name}</div>
  )
}

