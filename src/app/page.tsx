"use client"

import { useState, useEffect } from "react"
import {
  Trophy,
  Calendar,
  Users,
  Target,
  Play,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  MapPin,
  ArrowRight,
  Zap,
  UserPlus,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  Medal,
  Award,
  Info,
  Sparkles
} from "lucide-react"
import Image from 'next/image';
import Hero from "./component/Hero";
import Header from "./component/Header";
import Marquee from "./component/Marquee";
import OverallStandings from "./component/OverallStandings";

// Custom Button Component
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = "", 
  icon,
  iconPosition = 'left',
  ...props 
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500";
  
  const variantStyles = {
    primary: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-green-500/25 border-0",
    secondary: "bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-green-500/15 border-0",
    outline: "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white bg-transparent",
    ghost: "text-green-600 hover:bg-green-50 border-0"
  };
  
  const sizeStyles = {
    sm: "text-sm px-4 py-2",
    md: "text-base px-6 py-3",
    lg: "text-lg px-8 py-4",
    xl: "text-xl px-10 py-5 font-bold"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  )
}

// Custom Card Components
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
}

const Card = ({ children, className = "", variant = 'default', ...props }: CardProps) => {
  const variantStyles = {
    default: "rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm",
    elevated: "rounded-xl border-0 bg-white text-gray-950 shadow-xl hover:shadow-2xl transition-shadow duration-300",
    bordered: "rounded-xl border-2 border-green-100 bg-white text-gray-950",
    glass: "rounded-xl border border-white/20 bg-white/80 backdrop-blur-lg text-gray-950 shadow-lg"
  };

  return (
    <div
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}

const CardHeader = ({ children, className = "", withBorder = false, ...props }: CardHeaderProps) => {
  return (
    <div
      className={`flex flex-col space-y-1.5 p-6 ${withBorder ? 'border-b border-gray-100' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  withGradient?: boolean;
}

const CardTitle = ({ children, className = "", withGradient = false, ...props }: CardTitleProps) => {
  return (
    <h3
      className={`text-2xl font-bold leading-none tracking-tight ${withGradient ? 'bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent' : ''} ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const CardContent = ({ children, className = "", noPadding = false, ...props }: CardContentProps) => {
  return (
    <div className={`${noPadding ? '' : 'p-6 pt-0'} ${className}`} {...props}>
      {children}
    </div>
  )
}

// Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
  icon?: React.ReactNode;
}

const Badge = ({ children, variant = 'default', className = "", icon, ...props }: BadgeProps) => {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </div>
  )
}

interface VisibilityState {
  [key: string]: boolean;
}

export default function IntramuralLeaderboard() {
  const [isVisible, setIsVisible] = useState<VisibilityState>({
    hero: false,
    features: false,
    sports: false,
    leaderboard: false,
    cta: false
  })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const sections = document.querySelectorAll("[data-animate]")
    sections.forEach((section) => observer.observe(section))

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      observer.disconnect()
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const sports = [
    { name: "Basketball", icon: "🏀", teams: 12, matches: 45, color: "from-orange-400 to-orange-600" },
    { name: "Football", icon: "⚽", teams: 8, matches: 28, color: "from-green-400 to-green-600" },
    { name: "Volleyball", icon: "🏐", teams: 10, matches: 35, color: "from-blue-400 to-blue-600" },
    { name: "Tennis", icon: "🎾", teams: 16, matches: 52, color: "from-yellow-400 to-yellow-600" },
    { name: "Swimming", icon: "🏊", teams: 6, matches: 18, color: "from-cyan-400 to-cyan-600" },
    { name: "Track & Field", icon: "🏃", teams: 14, matches: 42, color: "from-purple-400 to-purple-600" },
  ]

  const leaderboardData = [
    { rank: 1, team: "Green Eagles", points: 2450, wins: 28, badge: "🥇", change: "+2", trend: "up", winRate: "93%" },
    {
      rank: 2,
      team: "Thunder Wolves",
      points: 2380,
      wins: 26,
      badge: "🥈",
      change: "0",
      trend: "same",
      winRate: "87%",
    },
    {
      rank: 3,
      team: "Lightning Bolts",
      points: 2290,
      wins: 24,
      badge: "🥉",
      change: "+1",
      trend: "up",
      winRate: "82%",
    },
    { rank: 4, team: "Fire Dragons", points: 2180, wins: 22, badge: "🏆", change: "-1", trend: "down", winRate: "79%" },
    { rank: 5, team: "Storm Hawks", points: 2050, wins: 20, badge: "⭐", change: "+3", trend: "up", winRate: "74%" },
  ]

  const stats = [
    { label: "Active Teams", value: "48", icon: <Users className="w-8 h-8" />, color: "text-blue-600" },
    { label: "Games Played", value: "234", icon: <Play className="w-8 h-8" />, color: "text-green-600" },
    { label: "Total Points", value: "12.5K", icon: <Trophy className="w-8 h-8" />, color: "text-yellow-600" },
    { label: "Championships", value: "6", icon: <Award className="w-8 h-8" />, color: "text-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden">
      {/* Hero Section */}
      <Header />
      <section id="hero">
        <Hero />
      </section>
      <section id="marquee">
        <Marquee />
      </section>

      {/* Features Section */}
      <section
        id="features"
        data-animate
        className={`py-24 px-4 relative transition-all duration-1000 delay-200 ${
          isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-100/50 rounded-bl-[100px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-green-100/30 rounded-tr-[80px] -z-10"></div>
          <div className="absolute top-1/4 left-10 w-24 h-24 border border-green-200 rounded-full -z-10"></div>
          <div className="absolute bottom-1/4 right-10 w-32 h-32 border border-green-200 rounded-full -z-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <Badge 
              variant="success" 
              className="mb-6 px-6 py-3 text-base shadow-lg" 
              icon={<Sparkles className="w-5 h-5" />}
            >
              Platform Features
            </Badge>
            
            <h2 className="text-5xl md:text-6xl font-black text-green-800 mb-8 tracking-tight relative inline-block">
              Why Choose Our Platform?
              <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-green-300/0 via-green-500/50 to-green-300/0"></div>
            </h2>
            
            <p className="text-xl md:text-2xl text-green-600/90 max-w-4xl mx-auto font-medium leading-relaxed">
              Experience the most comprehensive and engaging way to track school sports competitions with cutting-edge
              technology and professional design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                icon: <Target className="w-14 h-14 text-white" />,
                title: "Real-Time Updates",
                description:
                  "Get instant updates on scores, rankings, and match results as they happen with live notifications and dynamic leaderboards.",
                gradient: "from-blue-500 to-blue-700",
                delay: "delay-100",
                accent: "border-blue-200"
              },
              {
                icon: <Users className="w-14 h-14 text-white" />,
                title: "Team Management",
                description:
                  "Comprehensive team profiles with detailed player statistics, performance analytics, and historical data tracking.",
                gradient: "from-green-500 to-green-700",
                delay: "delay-200",
                accent: "border-green-200"
              },
              {
                icon: <Medal className="w-14 h-14 text-white" />,
                title: "Achievement System",
                description:
                  "Celebrate victories with dynamic badges, trophies, and recognition systems that motivate teams to excel.",
                gradient: "from-purple-500 to-purple-700",
                delay: "delay-300",
                accent: "border-purple-200"
              },
            ].map((feature, index) => (
              <Card
                key={index}
                variant="elevated"
                className={`transform hover:scale-105 transition-all duration-500 ${feature.delay} hover:-translate-y-2 relative overflow-hidden group border-t-4 ${feature.accent}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="mb-6 flex justify-center relative">
                    <div
                      className={`p-5 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-xl transform group-hover:scale-110 transition-transform duration-300 ring-4 ring-white`}
                    >
                      {feature.icon}
                    </div>
                    <div className="absolute -bottom-3 w-3/4 h-1.5 bg-gradient-to-r ${feature.gradient} blur-sm opacity-70"></div>
                  </div>
                  <CardTitle withGradient className="text-2xl font-bold mb-2">{feature.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 px-8 pb-8">
                  <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                  
                  <div className="mt-6 flex justify-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium"
                      icon={<Info className="w-4 h-4" />}
                    >
                      Learn more
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="font-bold"
              icon={<ChevronDown className="w-5 h-5" />}
            >
              Explore All Features
            </Button>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section
        id="sports"
        data-animate
        className={`py-24 px-4 bg-gradient-to-br from-green-50 to-green-100 relative transition-all duration-1000 delay-300 ${
          isVisible.sports ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-[0.04]"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <Badge 
              variant="default" 
              className="mb-6 px-6 py-3 text-base shadow-lg bg-white" 
              icon={<Calendar className="w-5 h-5" />}
            >
              Sports & Activities
            </Badge>
            
            <h2 className="text-5xl md:text-6xl font-black text-green-800 mb-8 tracking-tight relative inline-block">
              Sports & Games
              <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-green-300/0 via-green-500/50 to-green-300/0"></div>
            </h2>
            
            <p className="text-xl md:text-2xl text-green-600/90 max-w-4xl mx-auto font-medium leading-relaxed">
              Covering all major sports and activities in our comprehensive leaderboard ecosystem
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
            {sports.map((sport, index) => (
              <Card
                key={index}
                variant="glass"
                className="transform hover:scale-110 transition-all duration-500 hover:-translate-y-3 cursor-pointer group relative overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${sport.color} opacity-0 group-hover:opacity-15 transition-opacity duration-300`}
                ></div>
                <CardContent className="p-6 md:p-8 text-center relative z-10">
                  <div className="relative mb-6">
                    <div className="text-5xl transform group-hover:scale-125 transition-transform duration-300 relative z-10">
                      {sport.icon}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gradient-to-r ${sport.color} blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                  </div>
                  
                  <h3 className="font-bold text-green-800 mb-4 text-lg group-hover:bg-gradient-to-r from-green-600 to-green-800 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{sport.name}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-sm text-green-600">
                      <div className="p-1 bg-green-100 rounded-full mr-2 group-hover:bg-green-200 transition-colors duration-300">
                        <Users className="w-3 h-3" />
                      </div>
                      {sport.teams} Teams
                    </div>
                    <div className="flex items-center justify-center text-sm text-green-600">
                      <div className="p-1 bg-green-100 rounded-full mr-2 group-hover:bg-green-200 transition-colors duration-300">
                        <Play className="w-3 h-3" />
                      </div>
                      {sport.matches} Matches
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="font-bold"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              View All Sports
            </Button>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <OverallStandings />

      {/* CTA Section */}
      <section
        id="cta"
        data-animate
        className={`py-24 px-4 bg-gradient-to-br from-green-600 to-green-800 text-white relative transition-all duration-1000 delay-500 overflow-hidden ${
          isVisible.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-20 bg-white opacity-5 transform -skew-y-3"></div>
          <div className="absolute bottom-0 right-0 w-full h-20 bg-white opacity-5 transform skew-y-3"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green-400/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-[0.05]"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <Badge 
            variant="default" 
            className="mb-6 px-6 py-3 text-base shadow-lg bg-white/10 backdrop-blur-sm border border-white/20" 
            icon={<Zap className="w-5 h-5" />}
          >
            Get Started Today
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
            Ready to Transform Your Intramurals?
          </h2>
          
          <p className="text-xl md:text-2xl text-green-100/90 max-w-4xl mx-auto font-medium leading-relaxed mb-12">
            Join our platform today and take your school&apos;s intramural program to the next level with comprehensive
            tracking, engaging leaderboards, and powerful management tools.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Button
              variant="primary"
              size="xl"
              className="bg-white text-green-700 hover:bg-green-100 shadow-xl shadow-green-900/20"
              icon={<UserPlus className="w-5 h-5" />}
            >
              Sign Up Now
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              className="border-2 border-white text-white hover:bg-white/10"
              icon={<Calendar className="w-5 h-5" />}
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white py-16 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-[0.03]"></div>
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-green-800/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-20 bg-gradient-to-t from-green-950/30 to-transparent"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-green-400 to-green-600 rounded-xl mr-3 shadow-lg shadow-green-900/20">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">Intramurals</h3>
              </div>
              <p className="text-green-200/90 leading-relaxed">
                The ultimate platform for school sports competition tracking and team management excellence.
              </p>
              
              <div className="mt-6 flex space-x-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="bg-green-800/50 p-2 rounded-full hover:bg-green-700 transition-colors duration-300 hover:scale-110 transform"
                    aria-label={`Social media link ${index + 1}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-xl relative inline-block">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-green-500/50"></div>
              </h4>
              <ul className="space-y-3 text-green-200/90">
                {["Leaderboard", "Teams", "Schedule", "Results"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                      <div className="bg-green-800/50 p-1 rounded-md mr-2.5 group-hover:bg-green-700/70 transition-colors duration-300">
                        <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-xl relative inline-block">
                Sports
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-green-500/50"></div>
              </h4>
              <ul className="space-y-3 text-green-200/90">
                {["Basketball", "Football", "Volleyball", "Tennis"].map((sport) => (
                  <li key={sport}>
                    <a href="#" className="hover:text-white transition-colors duration-300 flex items-center group">
                      <div className="bg-green-800/50 p-1 rounded-md mr-2.5 group-hover:bg-green-700/70 transition-colors duration-300">
                        <Play className="w-3 h-3 transform group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      {sport}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-xl relative inline-block">
                Contact
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-green-500/50"></div>
              </h4>
              <ul className="space-y-4 text-green-200/90">
                {[
                  { icon: <Mail className="w-4 h-4" />, text: "info@intramurals.edu" },
                  { icon: <Phone className="w-4 h-4" />, text: "(555) 123-4567" },
                  { icon: <MapPin className="w-4 h-4" />, text: "123 Campus Drive" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center group">
                    <div className="bg-green-800/50 p-2 rounded-full mr-3 group-hover:bg-green-700/70 transition-colors duration-300">
                      {item.icon}
                    </div>
                    <span className="group-hover:text-white transition-colors duration-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-700/30 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-300/80 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Intramurals. All rights reserved.</p>
            <div className="flex items-center space-x-2 text-sm text-green-300/70">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors duration-300">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
