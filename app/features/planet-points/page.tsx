import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function PlanetPointsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4">
            Feature Development
          </Badge>
          <h1 className="text-3xl font-bold mb-4">🌍 Planet Points</h1>
          <p className="text-lg text-gray-600">
            Eco-friendly shopping rewards system that encourages sustainable choices
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Overview</CardTitle>
              <CardDescription>Gamified sustainability tracking with rewards for eco-friendly choices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Core Functionality:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Eco-score tracking for products (local, plastic-free, fair-trade)</li>
                  <li>Planet Points accumulation system</li>
                  <li>Reward redemption options</li>
                  <li>Green badge achievements</li>
                  <li>Impact visualization and progress tracking</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Reward Options:</h3>
                <div className="bg-green-50 p-4 rounded-lg text-sm space-y-2">
                  <p>
                    💚 <strong>Donate meals:</strong> Use points to donate meals to those in need
                  </p>
                  <p>
                    🏅 <strong>Green Badges:</strong> Unlock achievement badges (optional NFT)
                  </p>
                  <p>
                    ₹ <strong>Coupons:</strong> "Get ₹10 off for 100 points"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Suggested Tech Stack:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>JSON product database with eco-scores</li>
                    <li>React state management for points tracking</li>
                    <li>Firebase for user data persistence (optional)</li>
                    <li>Chart.js for impact visualization</li>
                    <li>Optional: ERC20 tokens on Polygon Mumbai + NFT.storage</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">File Structure:</h3>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                    {`app/features/planet-points/
├── page.tsx (this file)
├── components/
│   ├── EcoScoreDisplay.tsx
│   ├── PointsTracker.tsx
│   ├── RewardsShop.tsx
│   └── ImpactVisualization.tsx
├── lib/
│   ├── eco-scoring.ts
│   ├── points-calculation.ts
│   └── rewards-system.ts
└── types/
    └── sustainability.types.ts`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sustainability Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Local Products</span>
                  <Badge variant="outline">+10 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Plastic-Free Packaging</span>
                  <Badge variant="outline">+15 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fair Trade Certified</span>
                  <Badge variant="outline">+20 points</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Organic Products</span>
                  <Badge variant="outline">+12 points</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
