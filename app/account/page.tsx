import { createSessionClient, getLoggedInUser } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, LogOut } from "lucide-react";
import Image from "next/image";

async function signOut() {
  "use server";
  const { account } = await createSessionClient();
  cookies().delete("my-custom-session");
  await account.deleteSession("current");
  redirect("/signup");
}

export default async function AccountPage() {
  const user = await getLoggedInUser();
  if (!user) redirect("/signup");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        {/* Profile Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20">
              <Image
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.$id}`}
                alt="Profile"
                fill
                className="rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <form action={signOut}>
            <Button variant="destructive" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </form>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">User ID</label>
                <code className="rounded bg-muted px-2 py-1">{user.$id}</code>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Email</label>
                <p className="rounded bg-muted px-2 py-1">{user.email}</p>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <p className="rounded bg-muted px-2 py-1">{user.name}</p>
              </div>
              <Button className="w-full" variant="outline">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
