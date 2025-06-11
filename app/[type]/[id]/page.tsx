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
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-50 mb-4">Invalid Type</h1>
          <p className="text-emerald-100/70 mb-4 text-sm sm:text-base">The requested type "{type}" is not supported.</p>
          <nav>
            <Link href="/">
              <Button className="bg-emerald-950/30 hover:bg-emerald-950/40 text-emerald-100 border-emerald-500/30 w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </nav>
        </article>
      </main>
    )
  }

  const item = await getItemByTypeAndId(type, id)

  if (!item) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 flex items-center justify-center p-4">
        <article className="backdrop-blur-md bg-emerald-950/30 rounded-xl sm:rounded-2xl border border-emerald-500/20 p-6 sm:p-8 text-center max-w-md w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-50 mb-4">Item Not Found</h1>
          <p className="text-emerald-100/70 mb-4 text-sm sm:text-base">
            The requested {type} with ID "{id}" could not be found in The One API.
          </p>
          <p className="text-emerald-100/50 text-xs sm:text-sm mb-4 break-all">
            API URL: https://the-one-api.dev/v2/{type}/{id}
          </p>
          <nav>
            <Link href="/">
              <Button className="bg-emerald-950/30 hover:bg-emerald-950/40 text-emerald-100 border-emerald-500/30 w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </nav>
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800">
      {/* Background Pattern */}
      <section className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23065F46&quot; fillOpacity=&quot;0.08&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></section>

      <article className="relative z-10">
        {/* Header */}
        <header className="p-4 sm:p-6 md:p-8">
          <section className="max-w-4xl mx-auto">
            <nav className="backdrop-blur-md bg-emerald-950/30 rounded-xl sm:rounded-2xl border border-emerald-500/20 p-4 sm:p-6 shadow-2xl shadow-emerald-900/20">
              <Link href="/">
                <Button className="mb-4 bg-emerald-950/30 hover:bg-emerald-950/40 text-emerald-100 border-emerald-500/30 w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <section className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                {getTypeIcon(type)}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-50 break-words">{item.name}</h1>
                <Badge
                  className={`${getTypeColor(type)} backdrop-blur-sm text-xs sm:text-sm self-start sm:self-center`}
                >
                  {type}
                </Badge>
              </section>
              <p className="text-emerald-100/80 text-sm sm:text-base md:text-lg">
                {type === "movie" && "Part of the legendary Lord of the Rings film trilogy"}
                {type === "character" && "A character from the world of Middle-earth"}
                {type === "book" && "A book from J.R.R. Tolkien's Middle-earth legendarium"}
                {type === "quote" && "A memorable quote from Middle-earth"}
              </p>
            </nav>
          </section>
        </header>

        {/* Main Content */}
        <section className="p-4 sm:p-6 md:p-8">
          <section className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {type === "movie" && (
              <>
                {/* Movie Stats */}
                <Card className="backdrop-blur-md bg-emerald-950/20 border-emerald-500/20">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-emerald-50 flex items-center gap-2 text-lg sm:text-xl">
                      <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                      Movie Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {(item as Movie)?.runtimeInMinutes && (
                        <article className="backdrop-blur-sm bg-emerald-950/20 rounded-lg p-3 sm:p-4 border border-emerald-500/10">
                          <section className="flex items-center gap-2 mb-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                            <span className="text-emerald-100/80 text-xs sm:text-sm">Runtime</span>
                          </section>
                          <p className="text-emerald-50 text-lg sm:text-xl font-bold">
                            {(item as Movie).runtimeInMinutes} min
                          </p>
                        </article>
                      )}
                      {(item as Movie)?.boxOfficeRevenueInMillions && (
                        <article className="backdrop-blur-sm bg-emerald-950/20 rounded-lg p-3 sm:p-4 border border-emerald-500/10">
                          <section className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                            <span className="text-emerald-100/80 text-xs sm:text-sm">Box Office</span>
                          </section>
                          <p className="text-emerald-50 text-lg sm:text-xl font-bold">
                            ${(item as Movie).boxOfficeRevenueInMillions}M
                          </p>
                        </article>
                      )}
                      {(item as Movie)?.academyAwardWins !== undefined && (
                        <article className="backdrop-blur-sm bg-emerald-950/20 rounded-lg p-3 sm:p-4 border border-emerald-500/10">
                          <section className="flex items-center gap-2 mb-2">
                            <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                            <span className="text-emerald-100/80 text-xs sm:text-sm">Oscar Wins</span>
                          </section>
                          <p className="text-emerald-50 text-lg sm:text-xl font-bold">
                            {(item as Movie).academyAwardWins}
                          </p>
                        </article>
                      )}
                      {(item as Movie)?.rottenTomatoesScore && (
                        <article className="backdrop-blur-sm bg-emerald-950/20 rounded-lg p-3 sm:p-4 border border-emerald-500/10">
                          <section className="flex items-center gap-2 mb-2">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                            <span className="text-emerald-100/80 text-xs sm:text-sm">RT Score</span>
                          </section>
                          <p className="text-emerald-50 text-lg sm:text-xl font-bold">
                            {(item as Movie).rottenTomatoesScore}%
                          </p>
                        </article>
                      )}
                    </section>
                  </CardContent>
                </Card>

                {/* Additional Movie Details */}
                <Card className="backdrop-blur-md bg-emerald-950/20 border-emerald-500/20">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="text-emerald-50 text-lg sm:text-xl">Additional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {(item as Movie)?.budgetInMillions && (
                        <article>
                          <section className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                            <span className="text-emerald-100/80 text-sm sm:text-base">Budget</span>
                          </section>
                          <p className="text-emerald-50 text-sm sm:text-base">
                            ${(item as Movie).budgetInMillions} Million
                          </p>
                        </article>
                      )}
                      {(item as Movie)?.academyAwardNominations && (
                        <article>
                          <section className="flex items-center gap-2 mb-2">
                            <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                            <span className="text-emerald-100/80 text-sm sm:text-base">Oscar Nominations</span>
                          </section>
                          <p className="text-emerald-50 text-sm sm:text-base">
                            {(item as Movie).academyAwardNominations}
                          </p>
                        </article>
                      )}
                    </section>
                  </CardContent>
                </Card>
              </>
            )}

            {type === "character" && (
              <Card className="backdrop-blur-md bg-emerald-950/20 border-emerald-500/20">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-emerald-50 text-lg sm:text-xl">Character Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {(item as Character)?.race && (
                      <article>
                        <section className="flex items-center gap-2 mb-2">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                          <span className="text-emerald-100/80 text-sm sm:text-base">Race</span>
                        </section>
                        <p className="text-emerald-50 text-sm sm:text-base">{(item as Character).race}</p>
                      </article>
                    )}
                    {(item as Character)?.gender && (
                      <article>
                        <section className="flex items-center gap-2 mb-2">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                          <span className="text-emerald-100/80 text-sm sm:text-base">Gender</span>
                        </section>
                        <p className="text-emerald-50 text-sm sm:text-base">{(item as Character).gender}</p>
                      </article>
                    )}
                    {(item as Character)?.realm && (
                      <article>
                        <section className="flex items-center gap-2 mb-2">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                          <span className="text-emerald-100/80 text-sm sm:text-base">Realm</span>
                        </section>
                        <p className="text-emerald-50 text-sm sm:text-base">{(item as Character).realm}</p>
                      </article>
                    )}
                    {(item as Character)?.birth && (
                      <article>
                        <section className="flex items-center gap-2 mb-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
                          <span className="text-emerald-100/80 text-sm sm:text-base">Birth</span>
                        </section>
                        <p className="text-emerald-50 text-sm sm:text-base break-words">{(item as Character).birth}</p>
                      </article>
                    )}
                    {(item as Character)?.death && (
                      <article>
                        <section className="flex items-center gap-2 mb-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                          <span className="text-emerald-100/80 text-sm sm:text-base">Death</span>
                        </section>
                        <p className="text-emerald-50 text-sm sm:text-base break-words">{(item as Character).death}</p>
                      </article>
                    )}
                    {(item as Character)?.spouse && (
                      <article>
                        <section className="flex items-center gap-2 mb-2">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-pink-400" />
                          <span className="text-emerald-100/80 text-sm sm:text-base">Spouse</span>
                        </section>
                        <p className="text-emerald-50 text-sm sm:text-base">{(item as Character).spouse}</p>
                      </article>
                    )}
                    {(item as Character)?.hair && (
                      <article>
                        <section className="flex items-center gap-2 mb-2">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                          <span className="text-emerald-100/80 text-sm sm:text-base">Hair</span>
                        </section>
                        <p className="text-emerald-50 text-sm sm:text-base">{(item as Character).hair}</p>
                      </article>
                    )}
                    {(item as Character)?.height && (
                      <article>
                        <section className="flex items-center gap-2 mb-2">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                          <span className="text-emerald-100/80 text-sm sm:text-base">Height</span>
                        </section>
                        <p className="text-emerald-50 text-sm sm:text-base">{(item as Character).height}</p>
                      </article>
                    )}
                  </section>
                  {(item as Character)?.wikiUrl && (
                    <nav className="pt-3 sm:pt-4">
                      <a
                        href={(item as Character).wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors text-sm sm:text-base"
                      >
                        <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                        View on Wiki
                      </a>
                    </nav>
                  )}
                </CardContent>
              </Card>
            )}

            {type === "book" && (
              <Card className="backdrop-blur-md bg-emerald-950/20 border-emerald-500/20">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-emerald-50 text-lg sm:text-xl">Book Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <article className="text-center py-6 sm:py-8">
                    <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-emerald-50 mb-2">{item.name}</h3>
                    <p className="text-emerald-100/70 text-sm sm:text-base">
                      This is one of the books from J.R.R. Tolkien's Middle-earth legendarium available in The One API.
                    </p>
                  </article>
                </CardContent>
              </Card>
            )}

            {type === "quote" && (
              <Card className="backdrop-blur-md bg-emerald-950/20 border-emerald-500/20">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-emerald-50 text-lg sm:text-xl">Quote Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <article className="text-center py-6 sm:py-8">
                    <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-teal-400 mx-auto mb-4" />
                    <blockquote className="text-lg sm:text-xl font-medium text-emerald-50 mb-4 sm:mb-6 italic break-words">
                      "{(item as Quote).dialog}"
                    </blockquote>
                    <section className="space-y-2 sm:space-y-3 text-emerald-100/70">
                      {(item as Quote).characterName && (
                        <article className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                          <section className="flex items-center gap-2">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                            <span className="text-sm sm:text-base">Character:</span>
                          </section>
                          {(item as Quote).character ? (
                            <Link
                              href={`/character/${(item as Quote).character}`}
                              className="text-emerald-300 hover:text-emerald-200 underline underline-offset-2 transition-colors text-sm sm:text-base"
                            >
                              {(item as Quote).characterName}
                            </Link>
                          ) : (
                            <span className="text-emerald-300 text-sm sm:text-base">
                              {(item as Quote).characterName}
                            </span>
                          )}
                        </article>
                      )}
                      {(item as Quote).movieName && (
                        <article className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                          <section className="flex items-center gap-2">
                            <Film className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                            <span className="text-sm sm:text-base">Movie:</span>
                          </section>
                          {(item as Quote).movie ? (
                            <Link
                              href={`/movie/${(item as Quote).movie}`}
                              className="text-blue-300 hover:text-blue-200 underline underline-offset-2 transition-colors text-sm sm:text-base"
                            >
                              {(item as Quote).movieName}
                            </Link>
                          ) : (
                            <span className="text-blue-300 text-sm sm:text-base">{(item as Quote).movieName}</span>
                          )}
                        </article>
                      )}
                      {!(item as Quote).characterName && !(item as Quote).movieName && (
                        <p className="text-emerald-100/50 text-sm sm:text-base">Quote details not available</p>
                      )}
                    </section>
                  </article>
                </CardContent>
              </Card>
            )}

            {/* API Info */}
            <Card className="backdrop-blur-md bg-emerald-950/10 border-emerald-500/10">
              <CardContent className="p-3 sm:p-4">
                <footer className="text-emerald-100/50 text-xs sm:text-sm text-center break-words">
                  Data sourced from The One API • Type: {type} • ID: {item._id}
                </footer>
              </CardContent>
            </Card>
          </section>
        </section>
      </article>
    </main>
  )
}
