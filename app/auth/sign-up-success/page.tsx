"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 text-center">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-2xl">Account Created!</CardTitle>
              <CardDescription>Please check your email to confirm your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-400">
                We've sent a confirmation link to your email address. Click the link to verify your email and start
                using Room Manager.
              </p>
              <p className="text-xs text-slate-500">
                If you don't see the email, check your spam folder or try signing up again.
              </p>
              <Button asChild className="w-full">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
