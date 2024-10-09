import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Trophy } from "lucide-react"

export const UserProfile = () => {
    return (
        <Card className="w-[350px]">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Zdjęcie profilowe" />
                    <AvatarFallback>JK</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-bold">Jan Kowalski</h2>
                    <p className="text-sm text-muted-foreground">Programista Full-Stack</p>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-sm">
                    Pasjonat technologii z 5-letnim doświadczeniem w tworzeniu aplikacji webowych.
                    Specjalizuje się w React i Node.js.
                </p>
                <div className="space-y-2">
                    <h3 className="font-semibold">Osiągnięcia:</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            Pracownik Roku 2023
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            100+ Projektów
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            Mentor Junior Devs
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}