"use client"

import { useSession } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SessionDebug() {
  const { data: session, isPending, error } = useSession()

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-sm text-orange-800">Debug: Session State</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs space-y-2">
          <div>
            <strong>isPending:</strong> {isPending ? "true" : "false"}
          </div>
          <div>
            <strong>hasSession:</strong> {session ? "true" : "false"}
          </div>
          {session && (
            <div>
              <strong>User:</strong> {session.user.email} ({session.user.name})
            </div>
          )}
          {error && (
            <div className="text-red-600">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          <div>
            <strong>Document cookies:</strong> {typeof document !== 'undefined' ? document.cookie : 'N/A'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Also export as named export for consistency
export { SessionDebug }
