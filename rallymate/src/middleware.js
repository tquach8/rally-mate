import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = "secret";

export async function middleware(request) {
  const sessionToken = request.cookies.get("session")?.value;
  console.log("Session token:", sessionToken);

  // If there's no session cookie, redirect to login
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  try {
    const encodedKey = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(sessionToken, encodedKey, {
      algorithms: ["HS256"],
    });
    console.log(payload);

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
