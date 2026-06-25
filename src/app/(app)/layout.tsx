import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Navbar } from "@/components/navbar"
import { EmailVerificationBanner } from "@/components/email-verification-banner"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  let emailVerified = true
  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { emailVerified: true },
    })
    emailVerified = !!user?.emailVerified
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {session?.user && !emailVerified && <EmailVerificationBanner />}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
