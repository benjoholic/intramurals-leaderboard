"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, MapPin, Clock, Users, Trophy, Filter } from "lucide-react";

export default function EventsPage() {
  const [selectedSport, setSelectedSport] = useState("All");

  const sports = [
    "All",
    "Basketball",
    "Volleyball",
    "Badminton",
    "Table Tennis",
    "Sepak Takraw",
    "Chess",
    "Track & Field",
  ];

  const matches = [
    {
      id: 1,
      sport: "Basketball",
      team1: {
        name: "Engineering Warriors",
        logo: "/Logos/Minsu.png",
        score: 0,
      },
      team2: {
        name: "Business Titans",
        logo: "/Logos/Minsu.png",
        score: 0,
      },
      date: "Nov 5, 2025",
      time: "2:00 PM",
      venue: "Main Court",
      status: "upcoming",
    },
    {
      id: 2,
      sport: "Basketball",
      team1: {
        name: "IT Hackers",
        logo: "/Logos/Minsu.png",
        score: 78,
      },
      team2: {
        name: "Education Eagles",
        logo: "/Logos/Minsu.png",
        score: 72,
      },
      date: "Oct 28, 2025",
      time: "3:00 PM",
      venue: "Main Court",
      status: "completed",
    },
    {
      id: 3,
      sport: "Volleyball",
      team1: {
        name: "Nursing Ninjas",
        logo: "/Logos/Minsu.png",
        score: 0,
      },
      team2: {
        name: "Arts Avengers",
        logo: "/Logos/Minsu.png",
        score: 0,
      },
      date: "Nov 6, 2025",
      time: "10:00 AM",
      venue: "Volleyball Court",
      status: "upcoming",
    },
    {
      id: 4,
      sport: "Volleyball",
      team1: {
        name: "Science Squad",
        logo: "/Logos/Minsu.png",
        score: 3,
      },
      team2: {
        name: "Law Legends",
        logo: "/Logos/Minsu.png",
        score: 1,
      },
      date: "Oct 30, 2025",
      time: "4:00 PM",
      venue: "Volleyball Court",
      status: "completed",
    },
    {
      id: 5,
      sport: "Badminton",
      team1: {
        name: "Engineering Warriors",
        logo: "/Logos/Minsu.png",
        score: 0,
      },
      team2: {
        name: "IT Hackers",
        logo: "/Logos/Minsu.png",
        score: 0,
      },
      date: "Nov 7, 2025",
      time: "1:00 PM",
      venue: "Gym Hall",
      status: "upcoming",
    },
    {
      id: 6,
      sport: "Chess",
      team1: {
        name: "Business Titans",
        logo: "/Logos/Minsu.png",
        score: 5,
      },
      team2: {
        name: "Education Eagles",
        logo: "/Logos/Minsu.png",
        score: 3,
      },
      date: "Oct 29, 2025",
      time: "9:00 AM",
      venue: "Chess Room",
      status: "completed",
    },
  ];

  const filteredMatches =
    selectedSport === "All"
      ? matches
      : matches.filter((match) => match.sport === selectedSport);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "live":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calendar className="w-10 h-10 text-green-600" />
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900">
                Events & Matches
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              View upcoming and past matches across all sports
            </p>
          </motion.div>

          {/* Sport Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-gray-900">Filter by Sport</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {sports.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                      selectedSport === sport
                        ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/30 scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Match Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-gray-600 font-medium">
              Showing {filteredMatches.length} match{filteredMatches.length !== 1 ? "es" : ""}
              {selectedSport !== "All" && ` for ${selectedSport}`}
            </p>
          </motion.div>

          {/* Matches Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSport}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-white" />
                        <span className="text-white font-bold">{match.sport}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          match.status
                        )}`}
                      >
                        {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="p-6">
                    {/* Team 1 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-100 to-green-200 flex items-center justify-center border-2 border-green-300">
                          <Users className="w-6 h-6 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {match.team1.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-gray-900 ml-2">
                        {match.team1.score}
                      </div>
                    </div>

                    {/* VS Divider */}
                    <div className="flex items-center justify-center my-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                      <span className="px-4 text-sm font-bold text-gray-400">VS</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>

                    {/* Team 2 */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center border-2 border-blue-300">
                          <Users className="w-6 h-6 text-blue-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">
                            {match.team2.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-gray-900 ml-2">
                        {match.team2.score}
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>{match.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>{match.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span>{match.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 pb-6">
                    <button className="w-full py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 group-hover:scale-[1.02]">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredMatches.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No matches found
              </h3>
              <p className="text-gray-600">
                There are no matches for {selectedSport} at the moment.
              </p>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
