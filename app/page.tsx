"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sword, Crown, Users, BookOpen, Film, MessageCircle, Filter } from "lucide-react"

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
}

// Fallback data in case API fails
const fallbackMovies: Movie[] = [
  {
    _id: "5cd95395de30eff6ebccde5c",
    name: "The Fellowship of the Ring",
    runtimeInMinutes: 178,
    budgetInMillions: 93,
    boxOfficeRevenueInMillions: 871.5,
    academyAwardNominations: 13,
    academyAwardWins: 4,
    rottenTomatoesScore: 91,
  },
  {
    _id: "5cd95395de30eff6ebccde5b",
    name: "The Two Towers",
    runtimeInMinutes: 179,
    budgetInMillions: 94,
    boxOfficeRevenueInMillions: 926,
    academyAwardNominations: 6,
    academyAwardWins: 2,
    rottenTomatoesScore: 95,
  },
  {
    _id: "5cd95395de30eff6ebccde5d",
    name: "The Return of the King",
    runtimeInMinutes: 201,
    budgetInMillions: 94,
    boxOfficeRevenueInMillions: 1146,
    academyAwardNominations: 11,
    academyAwardWins: 11,
    rottenTomatoesScore: 93,
  },
]

const fallbackCharacters: Character[] = [
  {
    _id: "5cd99d4bde30eff6ebccfbbe",
    name: "Gandalf",
    race: "Maiar",
    gender: "Male",
    birth: "Before the Shaping of Arda",
    realm: "Valinor",
  },
  {
    _id: "5cd99d4bde30eff6ebccfc15",
    name: "Frodo Baggins",
    race: "Hobbit",
    gender: "Male",
    birth: "September 22, 2968",
    realm: "The Shire",
  },
  {
    _id: "5cd99d4bde30eff6ebccfea0",
    name: "Aragorn II Elessar",
    race: "Men",
    gender: "Male",
    birth: "March 1, 2931",
    spouse: "Arwen",
    realm: "Gondor",
  },
  {
    _id: "5cd99d4bde30eff6ebccfe9e",
    name: "Legolas",
    race: "Elf",
    gender: "Male",
    realm: "Woodland Realm",
  },
  {
    _id: "5cd99d4bde30eff6ebccfea4",
    name: "Gimli",
    race: "Dwarf",
    gender: "Male",
    realm: "Erebor",
  },
  {
    _id: "5cd99d4bde30eff6ebccfe9f",
    name: "Boromir",
    race: "Men",
    gender: "Male",
    realm: "Gondor",
  },
  {
    _id: "5cd99d4bde30eff6ebccfea1",
    name: "Samwise Gamgee",
    race: "Hobbit",
    gender: "Male",
    realm: "The Shire",
  },
  {
    _id: "5cd99d4bde30eff6ebccfea2",
    name: "Meriadoc Brandybuck",
    race: "Hobbit",
    gender: "Male",
    realm: "The Shire",
  },
]

const fallbackBooks: Book[] = [
  { _id: "5cf5805fb53e011a64671582", name: "The Fellowship Of The Ring" },
  { _id: "5cf58077b53e011a64671583", name: "The Two Towers" },
  { _id: "5cf58080b53e011a64671584", name: "The Return Of The King" },
]

const fallbackQuotes: Quote[] = [
  {
    _id: "5cd96e05de30eff6ebcce7e9",
    dialog: "I will take the Ring, though I do not know the way.",
    character: "Frodo",
    movie: "The Fellowship of the Ring",
  },
  {
    _id: "5cd96e05de30eff6ebcce7ea",
    dialog: "You shall not pass!",
    character: "Gandalf",
    movie: "The Fellowship of the Ring",
  },
  {
    _id: "5cd96e05de30eff6ebcce7eb",
    dialog: "My precious.",
    character: "Gollum",
    movie: "The Two Towers",
  },
  {
    _id: "5cd96e05de30eff6ebcce7ec",
    dialog: "One does not simply walk into Mordor.",
    character: "Boromir",
    movie: "The Fellowship of the Ring",
  },
  {
    _id: "5cd96e05de30eff6ebcce7ed",
    dialog: "Even the smallest person can change the course of the future.",
    character: "Galadriel",
    movie: "The Fellowship of the Ring",
  },
]

async function getMovies(): Promise<Movie[]> {
  try {
    const response = await fetch("https://the-one-api.dev/v2/movie", {
      headers: {
        Authorization: "Bearer taanDR9vZtK7acQV5VY0",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Movies API returned ${response.status}, using fallback data`)
      return fallbackMovies
    }

    const data = await response.json()
    return data.docs && data.docs.length > 0 ? data.docs : fallbackMovies
  } catch (error) {
    console.warn("Error fetching movies, using fallback data:", error)
    return fallbackMovies
  }
}

async function getCharacters(): Promise<Character[]> {
  try {
    const response = await fetch("https://the-one-api.dev/v2/character?limit=20", {
      headers: {
        Authorization: "Bearer taanDR9vZtK7acQV5VY0",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Characters API returned ${response.status}, using fallback data`)
      return fallbackCharacters
    }

    const data = await response.json()
    return data.docs && data.docs.length > 0 ? data.docs : fallbackCharacters
  } catch (error) {
    console.warn("Error fetching characters, using fallback data:", error)
    return fallbackCharacters
  }
}

async function getBooks(): Promise<Book[]> {
  try {
    const response = await fetch("https://the-one-api.dev/v2/book", {
      headers: {
        Authorization: "Bearer taanDR9vZtK7acQV5VY0",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Books API returned ${response.status}, using fallback data`)
      return fallbackBooks
    }

    const data = await response.json()
    return data.docs && data.docs.length > 0 ? data.docs : fallbackBooks
  } catch (error) {
    console.warn("Error fetching books, using fallback data:", error)
    return fallbackBooks
  }
}

async function getQuotes(): Promise<Quote[]> {
  try {
    const response = await fetch("https://the-one-api.dev/v2/quote?limit=15", {
      headers: {
        Authorization: "Bearer taanDR9vZtK7acQV5VY0",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.warn(`Quotes API returned ${response.status}, using fallback data`)
      return fallbackQuotes
    }

    const data = await response.json()
    return data.docs && data.docs.length > 0 ? data.docs : fallbackQuotes
  } catch (error) {
    console.warn("Error fetching quotes, using fallback data:", error)
    return fallbackQuotes
  }
}

function getIcon(type: string) {
  switch (type) {
    case "movie":
      return <Film className="h-4 w-4 sm:h-5 sm:w-5" />
    case "character":
      return <Users className="h-4 w-4 sm:h-5 sm:w-5" />
    case "book":
      return <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
    case "quote":
      return <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
    default:
      return <Sword className="h-4 w-4 sm:h-5 sm:w-5" />
  }
}

function getTypeColor(type: string) {
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
      return "bg-teal-500/20 text-teal-300 border-teal-500/30"
  }
}

type ContentType = "all" | "movie" | "character" | "book" | "quote"

const filterOptions = [
  {
    value: "all" as ContentType,
    label: "All",
    fullLabel: "All Content",
    icon: Crown,
    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  {
    value: "movie" as ContentType,
    label: "Movies",
    fullLabel: "Movies",
    icon: Film,
    color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    value: "character" as ContentType,
    label: "Characters",
    fullLabel: "Characters",
    icon: Users,
    color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    value: "book" as ContentType,
    label: "Books",
    fullLabel: "Books",
    icon: BookOpen,
    color: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  {
    value: "quote" as ContentType,
    label: "Quotes",
    fullLabel: "Quotes",
    icon: MessageCircle,
    color: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  },
]

export default function HomePage() {
  const [selectedFilter, setSelectedFilter] = useState<ContentType>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [movies, setMovies] = useState<Movie[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [moviesResult, charactersResult, booksResult, quotesResult] = await Promise.allSettled([
        getMovies(),
        getCharacters(),
        getBooks(),
        getQuotes(),
      ])

      setMovies(moviesResult.status === "fulfilled" ? moviesResult.value : fallbackMovies)
      setCharacters(charactersResult.status === "fulfilled" ? charactersResult.value : fallbackCharacters)
      setBooks(booksResult.status === "fulfilled" ? booksResult.value : fallbackBooks)
      setQuotes(quotesResult.status === "fulfilled" ? quotesResult.value : fallbackQuotes)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Filter and combine data based on selection
  const getFilteredItems = () => {
    const allItems = []

    if (selectedFilter === "all" || selectedFilter === "movie") {
      allItems.push(...movies.map((movie) => ({ ...movie, type: "movie" })))
    }
    if (selectedFilter === "all" || selectedFilter === "character") {
      allItems.push(...characters.map((character) => ({ ...character, type: "character" })))
    }
    if (selectedFilter === "all" || selectedFilter === "book") {
      allItems.push(...books.map((book) => ({ ...book, type: "book" })))
    }
    if (selectedFilter === "all" || selectedFilter === "quote") {
      allItems.push(
        ...quotes.map((quote) => ({
          ...quote,
          type: "quote",
          name: quote.dialog.length > 50 ? quote.dialog.substring(0, 50) + "..." : quote.dialog,
        })),
      )
    }

    return allItems
  }

  const filteredItems = getFilteredItems()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800">
      {/* Background Pattern */}
      <section className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23065F46&quot; fillOpacity=&quot;0.08&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></section>

      <article className="relative z-10">
        {/* Header */}
        <header className="p-4 sm:p-6 md:p-8">
          <section className="max-w-7xl mx-auto">
            <article className="backdrop-blur-md bg-emerald-950/30 rounded-xl sm:rounded-2xl border border-emerald-500/20 p-4 sm:p-6 shadow-2xl shadow-emerald-900/20">
              <section className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-50">Middle-earth Chronicles</h1>
              </section>
              <p className="text-emerald-100/80 text-base sm:text-lg mb-4 sm:mb-6">
                Explore the vast world of Tolkien's Middle-earth through movies, characters, books, and quotes
              </p>

              {/* Filter Selector */}
              <section className="space-y-3 sm:space-y-4">
                <section className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-100/80" />
                  <label className="text-emerald-100/80 font-medium text-sm sm:text-base">Filter Content:</label>
                </section>
                <nav className="flex flex-wrap gap-2 sm:gap-3">
                  {filterOptions.map((option) => {
                    const IconComponent = option.icon
                    const isSelected = selectedFilter === option.value
                    return (
                      <Button
                        key={option.value}
                        onClick={() => setSelectedFilter(option.value)}
                        size="sm"
                        className={`
                          backdrop-blur-sm border transition-all duration-300 hover:scale-105 text-xs sm:text-sm
                          ${
                            isSelected
                              ? `${option.color} shadow-lg scale-105`
                              : "bg-emerald-950/20 text-emerald-100/70 border-emerald-500/20 hover:bg-emerald-950/30 hover:text-emerald-100"
                          }
                        `}
                      >
                        <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <output className="hidden xs:inline">{option.fullLabel}</output>
                        <output className="xs:hidden">{option.label}</output>
                      </Button>
                    )
                  })}
                </nav>
              </section>

              {/* Stats */}
              <section className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6 text-xs sm:text-sm text-emerald-100/60">
                <output>🎬 {movies.length}</output>
                <output>👥 {characters.length}</output>
                <output>📚 {books.length}</output>
                <output>💬 {quotes.length}</output>
                <output className="text-emerald-100/80 hidden sm:inline">• Showing: {filteredItems.length} items</output>
                <output className="text-emerald-100/80 sm:hidden">• {filteredItems.length} items</output>
              </section>
            </article>
          </section>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 md:p-8">
          <section className="max-w-7xl mx-auto">
            {isLoading ? (
              <article className="text-center py-8 sm:py-12">
                <section className="backdrop-blur-md bg-emerald-950/30 rounded-xl sm:rounded-2xl border border-emerald-500/20 p-6 sm:p-8">
                  <section className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full mx-auto mb-4"></section>
                  <h2 className="text-xl sm:text-2xl font-bold text-emerald-50 mb-4">Loading Middle-earth...</h2>
                  <p className="text-emerald-100/70 text-sm sm:text-base">Fetching data from The One API</p>
                </section>
              </article>
            ) : filteredItems.length === 0 ? (
              <article className="text-center py-8 sm:py-12">
                <section className="backdrop-blur-md bg-emerald-950/30 rounded-xl sm:rounded-2xl border border-emerald-500/20 p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-emerald-50 mb-4">No items found</h2>
                  <p className="text-emerald-100/70 text-sm sm:text-base">Try selecting a different filter</p>
                </section>
              </article>
            ) : (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredItems.map((item) => (
                  <Link key={item._id} href={`/${item.type}/${item._id}`}>
                    <Card className="group backdrop-blur-md bg-emerald-950/20 border-emerald-500/20 hover:bg-emerald-950/30 hover:border-emerald-400/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-900/20 cursor-pointer h-full">
                      <CardHeader className="pb-2 sm:pb-3">
                        <section className="flex items-center justify-between mb-2">
                          <section className="flex items-center gap-2 text-emerald-100/80">
                            {getIcon(item.type)}
                            <Badge className={`${getTypeColor(item.type)} backdrop-blur-sm text-xs`}>{item.type}</Badge>
                          </section>
                        </section>
                        <CardTitle className="text-emerald-50 text-lg sm:text-xl group-hover:text-yellow-300 transition-colors line-clamp-2">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="text-emerald-100/70 text-sm">
                          {item.type === "movie" && (item as any).runtimeInMinutes
                            ? `Runtime: ${(item as any).runtimeInMinutes} minutes`
                            : item.type === "character" && (item as any).race
                              ? `Race: ${(item as any).race}`
                              : item.type === "book"
                                ? "Book of Middle-earth"
                                : item.type === "quote"
                                  ? "Memorable quote"
                                  : "Explore details"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <section className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-emerald-100/60">
                          {item.type === "movie" && (item as any).boxOfficeRevenueInMillions ? (
                            <>
                              <section className="flex justify-between">
                                <label>Box Office:</label>
                                <data value={(item as any).boxOfficeRevenueInMillions} className="text-emerald-300">${(item as any).boxOfficeRevenueInMillions}M</data>
                              </section>
                              {(item as any).rottenTomatoesScore && (
                                <section className="flex justify-between">
                                  <label>RT Score:</label>
                                  <data value={(item as any).rottenTomatoesScore} className="text-yellow-300">{(item as any).rottenTomatoesScore}%</data>
                                </section>
                              )}
                              {(item as any).academyAwardWins !== undefined && (
                                <section className="flex justify-between">
                                  <label>Oscar Wins:</label>
                                  <data value={(item as any).academyAwardWins} className="text-blue-300">{(item as any).academyAwardWins}</data>
                                </section>
                              )}
                            </>
                          ) : item.type === "character" ? (
                            <>
                              {(item as any).gender && (
                                <section className="flex justify-between">
                                  <label>Gender:</label>
                                  <data value={(item as any).gender} className="text-blue-300">{(item as any).gender}</data>
                                </section>
                              )}
                              {(item as any).realm && (
                                <section className="flex justify-between">
                                  <label>Realm:</label>
                                  <data value={(item as any).realm} className="text-emerald-300">{(item as any).realm}</data>
                                </section>
                              )}
                              {(item as any).spouse && (
                                <section className="flex justify-between">
                                  <label>Spouse:</label>
                                  <data value={(item as any).spouse} className="text-pink-300">{(item as any).spouse}</data>
                                </section>
                              )}
                            </>
                          ) : item.type === "quote" ? (
                            <section className="text-center py-1 sm:py-2">
                              <small className="text-teal-300 italic text-xs sm:text-sm">
                                "{(item as any).dialog.substring(0, 50)}..."
                              </small>
                            </section>
                          ) : (
                            <section className="text-center py-1 sm:py-2">
                              <small className="text-amber-300 text-xs sm:text-sm">Click to explore</small>
                            </section>
                          )}
                        </section>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </section>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="p-4 sm:p-6 md:p-8 mt-8 sm:mt-12">
          <section className="max-w-7xl mx-auto">
            <article className="backdrop-blur-md bg-emerald-950/20 rounded-xl sm:rounded-2xl border border-emerald-500/10 p-4 sm:p-6 text-center">
              <p className="text-emerald-100/60 text-xs sm:text-sm">
                Data powered by The One API • Built with Next.js & Glassmorphism
              </p>
            </article>
          </section>
        </footer>
      </article>
    </main>
  )
}
