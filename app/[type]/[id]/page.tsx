import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Crown,
  Calendar,
  MapPin,
  Heart,
  Award,
  DollarSign,
  Clock,
  Star,
  Film,
  Users,
  BookOpen,
  MessageCircle,
} from "lucide-react"

interface Movie {
  _id: string
  name: string
  runtimeInMinutes?: number
  budgetInMillions?: number
  boxOfficeRevenueInMillions?: number
  academyAwardNominations?: number
  academyAwardWins?: number
  rottenTomatoesScore?: number
}

interface Character {
  _id: string
  name: string
  race?: string
  gender?: string
  birth?: string
  spouse?: string
  death?: string
  realm?: string
  hair?: string
  height?: string
  wikiUrl?: string
}

interface Book {
  _id: string
  name: string
}

interface Quote {
  _id: string
  dialog: string
  movie?: string
  character?: string
  characterName?: string
  movieName?: string
}

async function getItemByTypeAndId(type: string, id: string): Promise<Movie | Character | Book | Quote | null> {
  try {
    const headers: HeadersInit = {
      Authorization: "Bearer taanDR9vZtK7acQV5VY0",
      Accept: "application/json",
      "Content-Type": "application/json",
    }

    // Use the correct API endpoint structure
    const response = await fetch(`https://the-one-api.dev/v2/${type}/${id}`, {
      headers,
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      console.error(`API returned ${response.status} for ${type}/${id}`)
      return null
    }

    const data = await response.json()
    console.log(`Fetched ${type} data:`, data) // Debug log

    // The API returns data in docs array, get the first item
    const item = data.docs?.[0] || data || null

    // If it's a quote, fetch the related character and movie names
    if (type === "quote" && item) {
      const quote = item as Quote

      // Fetch character name if character ID exists
      if (quote.character) {
        try {
          const characterResponse = await fetch(`https://the-one-api.dev/v2/character/${quote.character}`, {
            headers,
            next: { revalidate: 3600 },
          })
          if (characterResponse.ok) {
            const characterData = await characterResponse.json()
            const character = characterData.docs?.[0]
            if (character) {
              quote.characterName = character.name
            }
          }
        } catch (error) {
          console.warn("Error fetching character name:", error)
        }
      }

      // Fetch movie name if movie ID exists
      if (quote.movie) {
        try {
          const movieResponse = await fetch(`https://the-one-api.dev/v2/movie/${quote.movie}`, {
            headers,
            next: { revalidate: 3600 },
          })
          if (movieResponse.ok) {
            const movieData = await movieResponse.json()
            const movie = movieData.docs?.[0]
            if (movie) {
              quote.movieName = movie.name
            }
          }
        } catch (error) {
          console.warn("Error fetching movie name:", error)
        }
      }
    }

    return item
  } catch (error) {
    console.error(`Error fetching ${type} with id ${id}:`, error)
    return null
  }
}

interface PageProps {
  params: {
    type: string
    id: string
  }
}

export default async function TypedDetailPage({ params }: PageProps) {
  const { type, id } = params

  console.log(`Fetching ${type} with id: ${id}`) // Debug log

  // Validate type
  if (!["movie", "character", "book", "quote"].includes(type)) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 flex items-center justify-center p-4">
        <article className="backdrop-blur-md bg-emerald-950/30 rounded-xl sm:rounded-2xl border border-emerald-500/20 p-6 sm:p-8 text-center max-w-md w-full">
          <header>
            <h1 className="text-xl sm:text-2xl font-bold text-emerald-50 mb-4">Invalid Type</h1>
          </header>
          <p className="text-emerald-100/70 mb-4 text-sm sm:text-base">The requested type "{type}" is not supported.</p>
          <footer>
            <Link href="/">
              <Button className="bg-emerald-950/30 hover:bg-emerald-950/40 text-emerald-100 border-emerald-500/30 w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </footer>
        </article>
      </main>
    )
  }

  const item = await getItemByTypeAndId(type, id)

  if (!item) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 flex items-center justify-center p-4">
        <article className="backdrop-blur-md bg-emerald-950/30 rounded-xl sm:rounded-2xl border border-emerald-500/20 p-6 sm:p-8 text-center max-w-md w-full">
          <header>
            <h1 className="text-xl sm:text-2xl font-bold text-emerald-50 mb-4">Item Not Found</h1>
          </header>
          <p className="text-emerald-100/70 mb-4 text-sm sm:text-base">
            The requested {type} with ID "{id}" could not be found in The One API.
          </p>
          <p className="text-emerald-100/50 text-xs sm:text-sm mb-4 break-all">
            API URL: https://the-one-api.dev/v2/{type}/{id}
          </p>
          <footer>
            <Link href="/">
              <Button className="bg-emerald-950/30 hover:bg-emerald-950/40 text-emerald-100 border-emerald-500/30 w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </footer>
        </article>
      </main>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "movie":
        return <Film className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
      case "character":
        return <Users className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
      case "book":
        return <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
      case "quote":
        return <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-teal-400" />
      default:
        return <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "movie":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "character":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      case "book":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "quote":
        return "bg-teal-500/20 text-teal-300 border-teal-500/30"
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 p-4 sm:p-6 lg:p-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <Link href="/">
            <Button className="bg-emerald-950/30 hover:bg-emerald-950/40 text-emerald-100 border-emerald-500/30 mb-4 sm:mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <section className="flex items-center gap-2 sm:gap-3">
            {getTypeIcon(type)}
            <Badge variant="outline" className={`${getTypeColor(type)} text-xs sm:text-sm`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </section>
        </header>

        <section className="space-y-6 sm:space-y-8">
          {type === "movie" && (
            <Card className="backdrop-blur-md bg-emerald-950/30 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-50">
                  {(item as Movie).name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(item as Movie).runtimeInMinutes && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Movie).runtimeInMinutes}>Runtime: {(item as Movie).runtimeInMinutes} minutes</data>
                  </section>
                )}
                {(item as Movie).budgetInMillions && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Movie).budgetInMillions}>Budget: ${(item as Movie).budgetInMillions} million</data>
                  </section>
                )}
                {(item as Movie).boxOfficeRevenueInMillions && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Movie).boxOfficeRevenueInMillions}>Box Office: ${(item as Movie).boxOfficeRevenueInMillions} million</data>
                  </section>
                )}
                {(item as Movie).academyAwardNominations && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Award className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Movie).academyAwardNominations}>Academy Award Nominations: {(item as Movie).academyAwardNominations}</data>
                  </section>
                )}
                {(item as Movie).academyAwardWins && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Award className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Movie).academyAwardWins}>Academy Award Wins: {(item as Movie).academyAwardWins}</data>
                  </section>
                )}
                {(item as Movie).rottenTomatoesScore && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Star className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Movie).rottenTomatoesScore}>Rotten Tomatoes Score: {(item as Movie).rottenTomatoesScore}%</data>
                  </section>
                )}
              </CardContent>
            </Card>
          )}

          {type === "character" && (
            <Card className="backdrop-blur-md bg-emerald-950/30 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-50">
                  {(item as Character).name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(item as Character).race && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Character).race}>Race: {(item as Character).race}</data>
                  </section>
                )}
                {(item as Character).gender && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Character).gender}>Gender: {(item as Character).gender}</data>
                  </section>
                )}
                {(item as Character).birth && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <time dateTime={(item as Character).birth}>Birth: {(item as Character).birth}</time>
                  </section>
                )}
                {(item as Character).death && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <time dateTime={(item as Character).death}>Death: {(item as Character).death}</time>
                  </section>
                )}
                {(item as Character).spouse && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Heart className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Character).spouse}>Spouse: {(item as Character).spouse}</data>
                  </section>
                )}
                {(item as Character).realm && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Character).realm}>Realm: {(item as Character).realm}</data>
                  </section>
                )}
              </CardContent>
            </Card>
          )}

          {type === "book" && (
            <Card className="backdrop-blur-md bg-emerald-950/30 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-50">
                  {(item as Book).name}
                </CardTitle>
              </CardHeader>
            </Card>
          )}

          {type === "quote" && (
            <Card className="backdrop-blur-md bg-emerald-950/30 border-emerald-500/20">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-50">
                  Quote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <blockquote className="text-lg sm:text-xl text-emerald-100/90 italic">
                  "{(item as Quote).dialog}"
                </blockquote>
                {(item as Quote).characterName && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Quote).characterName}>Character: {(item as Quote).characterName}</data>
                  </section>
                )}
                {(item as Quote).movieName && (
                  <section className="flex items-center gap-2 text-emerald-100/70">
                    <Film className="h-4 w-4 text-emerald-400" />
                    <data value={(item as Quote).movieName}>Movie: {(item as Quote).movieName}</data>
                  </section>
                )}
              </CardContent>
            </Card>
          )}
        </section>
      </article>
    </main>
  )
}
