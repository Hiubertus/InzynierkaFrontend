import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Component() {
    const pointPackages = [
        { points: 100, cost: 5 },
        { points: 500, cost: 20 },
        { points: 1000, cost: 35 },
        { points: 2500, cost: 75 },
        { points: 5000, cost: 140 },
        { points: 10000, cost: 250 },
    ]
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Kup Punkty</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pointPackages.map((pkg, index) => (
                    <Card key={index} className="flex flex-col transition-transform hover:scale-105">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">{pkg.points} Punktów</CardTitle>
                            <CardDescription className="text-center">Najlepsza wartość!</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-center justify-center">
                            <p className="text-4xl font-bold">{pkg.cost} zł</p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Kup Teraz</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}