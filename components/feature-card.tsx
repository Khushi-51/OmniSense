import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  href: string
  status?: "development" | "completed" | "planned"
}

export function FeatureCard({ title, description, icon, href, status = "development" }: FeatureCardProps) {
  const statusColors = {
    development: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    planned: "bg-blue-100 text-blue-800",
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {icon} {title}
          </CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>{status}</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={href}>
          <Button variant="outline" className="w-full bg-transparent">
            Explore Feature
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
