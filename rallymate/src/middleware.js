import { NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";

export async function middleware(request) {
  const sessionToken = request.cookies.get("session")?.value;
  console.log("Session token:", sessionToken);

  // If there's no session cookie, redirect to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  try {
    await decrypt(sessionToken);

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    console.log("Failed to verify session");
    // Invalid token; redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Define the routes that should be protected by this middleware
export const config = {
  matcher: ["/profile", "/dashboard/:path*", "/protected-route/:path*", "/find-courts/:path*"], // Adjust paths as needed
};
