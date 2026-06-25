import { auth } from "@/auth"
import { NextResponse } from "next/server"

const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/api/register", "/api/verify-email", "/api/forgot-password", "/api/reset-password", "/email-verified"]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith("/api/auth")
  )

  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
