"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "#hero" },
    { name: "Leaderboard", href: "#leaderboard" },
    { name: "Stats", href: "#stats" },
    { name: "Events", href: "/events" },
    { name: "Developers", href: "/developers" },
  ]

  return (
    <header className="fixed w-full z-50">
      <nav className="bg-gradient-to-r from-green-900/95 to-green-800/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <Link href="/" className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-300/20 rounded-full blur-2xl"></div>
                    <div className="relative">
                      <Image
                        src="/Logos/Minsu.png"
                        alt="Minsu Logo"
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-emerald-500/20"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white bg-gradient-to-r from-emerald-200 to-emerald-300 bg-clip-text text-transparent">
                      MinSu
                    </span>
                    <span className="text-sm text-gray-400">INTRATRACK</span>
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <div className="hidden sm:flex sm:space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-emerald-200 transition-all duration-300 relative group"
                  >
                    <span className="relative z-10">
                      <div className="relative">
                        <span className="relative z-10">{item.name}</span>
                        <div className="absolute -bottom-0.5 left-0 w-0 h-1 bg-emerald-400 rounded-full transition-all duration-300 group-hover:w-full"></div>
                      </div>
                    </span>
                  </Link>
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2.5 rounded-md text-gray-300 hover:text-emerald-200 hover:bg-emerald-900/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500/50"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-6 right-1/2 transform translate-x-1/2 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-200"></div>
          <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-32 h-32 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-400"></div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="px-4 py-4 bg-gradient-to-r from-green-900/95 to-green-800/95 backdrop-blur-lg rounded-b-xl shadow-lg">
              <div className="space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block w-full px-4 py-3 text-sm font-medium text-gray-300 hover:text-emerald-200 hover:bg-emerald-900/50 rounded-xl transition-colors duration-300 relative group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400/20 to-emerald-300/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative z-10">
                      <div className="relative">
                        {item.name}
                        <div className="absolute -bottom-0.5 left-0 w-0 h-1 bg-emerald-400 rounded-full transition-all duration-300 group-hover:w-full"></div>
                      </div>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
