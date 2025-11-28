"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Trophy,
  Calendar,
  Users,
  Target,
  Play,
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
  Info,
  Sparkles
} from "lucide-react"
import Hero from "../components/Hero";
import Header from "../components/Header";
import Marquee from "../components/Marquee";
import OverallStandings from "../components/OverallStandings";

import Footer from "../components/Footer";

// Custom Button Component
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
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
  const router = useRouter()
  const [isVisible, setIsVisible] = useState<VisibilityState>({
    hero: false,
    features: false,
    sports: false,
    leaderboard: false,
    cta: false
  })

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

    return () => {
      observer.disconnect()
    }
  }, [])

  const sports = [
    { 
      name: "Basketball", 
      teams: 12, 
      matches: 45, 
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      hoverBg: "hover:bg-orange-100",
      svg: (
        <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" xmlSpace="preserve" fill="currentColor">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g>
              <path fill="currentColor" d="M20.161,2.273C16.233,3.835,12.553,6.2,9.375,9.378C9.19,9.562,9.018,9.755,8.838,9.942 c1.386,3.831,3.126,7.562,5.242,11.133C18.139,15.485,20.168,8.879,20.161,2.273z"></path>
              <path fill="currentColor" d="M63.824,28.682c-9.751-1.521-20.067,1.469-27.58,8.981c-1.202,1.202-2.287,2.479-3.258,3.812 c7.363,5.18,15.545,8.678,24.021,10.495C62.398,45.233,64.671,36.827,63.824,28.682z"></path>
              <path fill="currentColor" d="M27.05,63.616c9.75,1.519,20.067-1.471,27.58-8.983c0.308-0.308,0.602-0.624,0.894-0.94 c-8.344-1.927-16.387-5.451-23.659-10.562C27.924,49.32,26.316,56.563,27.05,63.616z"></path>
              <path fill="currentColor" d="M12.771,22.754c-2.172-3.571-3.98-7.297-5.435-11.13c-4.895,5.909-7.34,13.163-7.332,20.416 c3.926-1.562,7.607-3.928,10.785-7.105C11.491,24.232,12.147,23.503,12.771,22.754z"></path>
              <path fill="currentColor" d="M13.881,24.53c-0.535,0.62-1.09,1.231-1.678,1.819c-3.554,3.553-7.701,6.146-12.121,7.798 c0.497,7.462,3.59,14.782,9.293,20.485c0.027,0.028,0.057,0.054,0.085,0.082c2.091-7.833,5.595-15.364,10.528-22.188 C17.73,29.981,15.691,27.309,13.881,24.53z"></path>
              <path fill="currentColor" d="M30.236,41.961c-2.588-1.935-5.074-4.067-7.427-6.42c-0.493-0.493-0.958-1.003-1.433-1.507 c-4.874,6.828-8.298,14.369-10.258,22.207c4.102,3.541,8.884,5.869,13.886,6.984C24.372,55.889,26.117,48.385,30.236,41.961z"></path>
              <path fill="currentColor" d="M22.583,32.401c0.54,0.579,1.076,1.161,1.641,1.726c2.262,2.262,4.653,4.313,7.14,6.18 c1.033-1.42,2.187-2.778,3.467-4.058c7.829-7.829,18.525-11.037,28.708-9.635c-1.062-6.245-3.979-12.235-8.761-17.08 c-9.619,3.111-18.671,8.468-26.311,16.107C26.321,27.787,24.371,30.052,22.583,32.401z"></path>
              <path fill="currentColor" d="M15.215,22.892c1.773,2.78,3.774,5.456,6.007,8.002c1.78-2.312,3.711-4.546,5.831-6.666 c7.594-7.595,16.541-13.007,26.063-16.257c-8.688-7.646-20.523-9.78-30.973-6.405C22.307,9.073,19.998,16.62,15.215,22.892z"></path>
            </g>
          </g>
        </svg>
      )
    },
    { 
      name: "Volleyball", 
      teams: 10, 
      matches: 35, 
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      hoverBg: "hover:bg-blue-100",
      svg: (
        <svg viewBox="0 0 512 512" fill="currentColor">
          <path d="M383.301,168.546c-6.107,8.825-12.711,17.27-19.676,25.413c-25.851,30.156-57.049,55.51-92.144,74.679 c-0.058,2.22-0.058,4.442-0.058,6.604c0,34.227,5.98,68.202,17.455,100.219c5.98-2.591,11.834-5.367,17.698-8.27 c76.344-38.046,139.189-97.131,181.939-171.012c3.75-6.535,7.335-13.139,10.724-19.86c-5.367-16.461-12.584-32.688-21.585-48.292 c-13.081-22.626-29.046-42.487-47.172-59.328c-8.64,31.082-21.722,60.322-38.552,86.961 C389.155,160.043,386.32,164.358,383.301,168.546z"></path>
          <path d="M358.19,148.385h0.068c2.289-3.273,4.442-6.536,6.536-9.867c17.63-27.877,30.78-58.9,38.231-92.076 c-6.78-4.752-13.744-9.194-20.893-13.198C343.638,11.532,299.983,0,255.762,0.059c-43.422,0-87.332,10.986-127.725,34.286 c-11.532,6.662-22.266,14.064-32.318,22.15c86.221,2.834,169.413,29.356,241.443,77.085 C344.32,138.332,351.353,143.261,358.19,148.385z"></path>
          <path d="M110.952,193.404c10.676,0.926,21.283,2.465,31.822,4.5c39.283,7.587,77.095,22.325,111.323,43.666 c32.191-17.269,60.867-40.334,84.488-67.714c-6.224-4.686-12.643-9.185-19.179-13.51c-71.056-47.124-153.692-72.04-239.037-72.04 c-6.048,0-12.155,0.137-18.195,0.439c-11.045,12.828-20.718,26.581-28.929,41.133c-12.458,22.14-21.585,45.955-27.069,70.618 c24.546-5.796,49.452-8.572,74.192-8.572C90.605,191.924,100.773,192.42,110.952,193.404z"></path>
          <path d="M104.601,246.625c0.429-7.149,1.052-14.309,1.782-21.458c-8.63-0.809-17.328-1.179-26.016-1.179 c-26.523,0-53.29,3.585-79.433,10.92C0.311,242.009,0,249.089,0,256.249c0.059,43.422,11.045,87.332,34.354,127.725 c23.748,41.074,57.05,73.013,95.534,94.783c8.873,5.065,18.068,9.506,27.496,13.383c-35.328-66.974-53.708-141.04-53.708-216.528 C103.676,265.931,103.988,256.249,104.601,246.625z"></path>
          <path d="M271.482,416.964c-4.685-9.682-8.814-19.549-12.399-29.601c-13.003-35.835-19.724-73.764-19.724-112.121 c0-1.666,0-3.331,0.059-4.997c-31.024-19.801-65.435-33.487-101.202-40.51c-0.681,6.224-1.237,12.506-1.607,18.867 c-0.556,9-0.867,18.01-0.867,27.01c0,75.799,19.861,149.924,57.975,216.041c2.834,4.928,5.795,9.799,8.873,14.61h0.069 c17.58,3.769,35.523,5.678,53.601,5.678c24.477,0,49.022-3.516,73.071-10.733c-18.555-19.549-34.412-41.075-47.416-64.082 C278.203,430.532,274.686,423.811,271.482,416.964z"></path>
          <path d="M509.848,222.878c-45.576,74.387-110.7,134.086-188.962,172.989c-6.477,3.214-12.956,6.292-19.549,9.136 c2.649,5.542,5.484,10.978,8.503,16.335c13.939,24.672,31.452,47.425,52.423,67.53c7.344-3.39,14.62-7.082,21.712-11.212 c41.133-23.756,73.013-57.049,94.793-95.533C500.477,343.639,512,299.973,512,255.752 C511.941,244.774,511.27,233.807,509.848,222.878z"></path>
        </svg>
      )
    },
    { 
      name: "Badminton", 
      teams: 8, 
      matches: 22, 
      color: "from-teal-400 to-teal-600",
      bgColor: "bg-teal-50",
      hoverBg: "hover:bg-teal-100",
      svg: (
        <svg viewBox="0 0 64 64" fill="currentColor">
          <path d="M55.693 26.207c6.678-6.676 8.35-16.715 3.58-21.48c-4.768-4.77-14.803-3.098-21.48 3.578c-5.478 5.481-6.711 12.556-3.387 17.709l-1.762 1.762a2.523 2.523 0 0 0-.646 2.437L19.982 42.225l-5.145 3.359s-4.477 4.475-9.846 9.846c-.486.484-2.434 1.254-2.434 1.254c-.631.295-.744.939-.252 1.43l3.58 3.58c.492.492 1.135.381 1.43-.25c0 0 .77-1.949 1.254-2.434l9.848-9.846l3.355-5.146l12.016-12.016a2.52 2.52 0 0 0 2.436-.646l1.762-1.761c5.155 3.325 12.229 2.093 17.707-3.388M40.049 9.665l1.326 1.325l-1.791 1.791l-1.264-1.265c.391-.483.803-.96 1.264-1.421c.15-.149.311-.285.465-.43m11.005-5.106l1.06 1.06l-1.79 1.791l-1.791-1.791l.853-.851a14.024 14.024 0 0 1 1.668-.209m-4.308 11.802l-1.791 1.789l-1.791-1.791l1.789-1.787l1.793 1.789m-.896-2.685l1.791-1.791l1.787 1.791l-1.787 1.791l-1.791-1.791m-1.789 5.369l-1.791 1.791l-1.791-1.789l1.791-1.791l1.791 1.789m0 5.371l-1.791 1.789l-1.791-1.787l1.791-1.793l1.791 1.791m-.897-2.686l1.791-1.789l1.791 1.789l-1.791 1.789l-1.791-1.789m4.477.895l1.787 1.793l-1.789 1.789l-1.791-1.789l1.793-1.793m-.002-1.789l-1.789-1.791l1.791-1.789l1.787 1.791l-1.789 1.789m.894-4.475l1.791-1.789l1.789 1.789l-1.789 1.789l-1.791-1.789m2.686-2.685l1.791-1.791l1.789 1.791l-1.789 1.791l-1.791-1.791m4.476.894l1.789 1.791l-1.789 1.789l-1.789-1.791l1.789-1.789m.895-.894l1.791-1.791l1.061 1.061a13.883 13.883 0 0 1-.21 1.67l-.851.851l-1.791-1.791m-.895-.895l-1.789-1.793l1.789-1.789l1.789 1.789l-1.789 1.793m-2.685-2.685l-1.791-1.791l1.791-1.791l1.789 1.791l-1.789 1.791m-.897.894l-1.789 1.791l-1.791-1.791l1.791-1.789l1.789 1.789m-4.472-.894L45.85 8.305l1.791-1.789l1.787 1.789l-1.787 1.791m-.895.894l-1.791 1.791l-1.791-1.793l1.791-1.789l1.791 1.791m-2.685 2.686l-1.791 1.789l-1.789-1.789l1.789-1.791l1.791 1.791m-2.686 2.685l-1.791 1.789l-1.791-1.789l1.791-1.789l1.791 1.789m-2.686 2.684L36.9 20.834l-1.744-1.741l.006-.098l1.738-1.739l1.789 1.789m.895.896l1.791 1.789l-1.791 1.791l-1.791-1.791l1.791-1.789m1.791 7.161l-.945.945a8.987 8.987 0 0 1-2.162-1.417l1.316-1.317l1.791 1.789m.895.896l.791.789a9.26 9.26 0 0 1-1.313-.268l.522-.521m2.638.848l-1.744-1.744l1.791-1.791l1.791 1.791l-1.738 1.738l-.1.006m2.733-.85l.26.26c-.246.083-.493.154-.74.221l.48-.481m.894-.894l1.789-1.789l1.137 1.135c-.747.515-1.51.948-2.281 1.3l-.645-.646m0-5.372l1.789-1.789l1.789 1.789l-1.789 1.791l-1.789-1.791m2.686-2.685l1.789-1.789l1.791 1.789l-1.791 1.791l-1.789-1.791m4.474.896l.989.989c-.45.713-.958 1.404-1.508 2.071l-1.271-1.271l1.79-1.789m.893-.894l1.793-1.791l.086.086c-.307.826-.68 1.651-1.12 2.462l-.759-.757m2.685-8.057l.129-.128c.011.1.031.195.04.296l-.169-.168m-.892-.894L56.59 8.305l1.305-1.306c.548.682.951 1.48 1.211 2.372l-.725.725M55.695 7.41l-1.789-1.791l.725-.725c.891.26 1.689.663 2.37 1.21L55.695 7.41M53.01 4.725l-.167-.167c.101.008.195.029.294.041l-.127.126m-6.264.894L44.955 7.41l-.757-.757c.81-.44 1.636-.813 2.462-1.121l.086.087m-2.685 2.686l-1.791 1.791l-1.271-1.271a20.015 20.015 0 0 1 2.072-1.509l.99.989m-5.372 5.371L36.9 15.467l-.646-.646c.352-.771.784-1.535 1.3-2.282l1.135 1.137m-2.685 2.685l-.479.479c.065-.247.137-.492.22-.739l.259.26m0 5.369l-.521.522a9.345 9.345 0 0 1-.268-1.311l.789.789m.896.895l1.789 1.791l-1.316 1.319a9 9 0 0 1-1.419-2.163l.946-.947m15.586 3.056l-1.266-1.265l1.789-1.791l1.326 1.328c-.144.154-.279.313-.43.463c-.46.461-.936.874-1.419 1.265"></path>
          <path d="M39.344 39.344a4.933 4.933 0 0 0 0 6.973l6.971-6.973a4.931 4.931 0 0 0-6.971 0"></path>
          <path d="M49.801 42.828l-1.742-1.74l-6.973 6.971l1.742 1.742L48.057 62l1.744-1.742l-1.045-2.438l1.744-1.744l1.479 2.004l1.744-1.744l-1.48-2.002l1.744-1.744l1.914 1.568l1.742-1.742l-1.914-1.568l2.092-2.092l2.438 1.045L62 48.059l-12.199-5.231m.699 2.791l-.525.525l-1.918-1.572l2.443 1.047m-4.881 4.883l-1.047-2.443l1.482 2.006l-.435.437m2.613-2.615l-.436.436l-1.482-2.008l1.918 1.572m-.523 7.492l-1.043-2.436l.871-.871l1.479 2l-1.307 1.307m3.051-3.051l-1.479-2l.873-.873l1.912 1.566l-1.306 1.307m3.049-3.049l-1.912-1.566l1.047-1.047l2.434 1.043l-1.569 1.57"></path>
        </svg>
      )
    },
    { 
      name: "Table Tennis", 
      teams: 8, 
      matches: 24, 
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      hoverBg: "hover:bg-orange-100",
      svg: (
        <svg viewBox="0 0 512 512" fill="currentColor">
          <path d="M502.079,430.441l-80.346-80.338c-3.205-3.228-5.027-6.135-6.232-9.147c-1.044-2.642-1.614-5.436-1.767-8.761 c-0.128-2.883,0.096-6.152,0.667-9.797c0.988-6.401,3.076-13.902,5.718-22.277c3.951-12.592,9.123-27.128,12.921-43.542 c3.782-16.407,6.168-34.789,4.328-54.93c-0.995-10.906-4.047-21.409-8.102-31.319c-6.112-14.857-14.536-28.421-22.735-39.72 c-4.095-5.645-8.151-10.712-11.86-15.058c-3.71-4.344-7.067-7.958-9.854-10.736c-0.892-0.892-2.28-2.386-3.975-4.256 c-2.545-2.811-5.822-6.513-9.717-10.761c-3.911-4.24-8.448-9.066-13.588-14.206c-11.821-11.821-26.846-25.361-44.971-37.832 c-18.125-12.456-39.39-23.868-63.658-31.256c-20.96-6.384-41.502-7.677-60.679-5.573c-28.814,3.156-54.544,13.78-75.697,26.059 C91.361,39.311,74.753,53.3,64.025,64.02c-7.164,7.163-15.74,16.921-24.341,28.911c-12.873,17.98-25.811,40.955-33.319,67.561 c-3.742,13.29-6.119,27.504-6.344,42.362c-0.225,14.848,1.702,30.339,6.488,46.039c7.389,24.276,18.792,45.542,31.256,63.674 c12.463,18.118,26.003,33.151,37.824,44.972c6.858,6.85,13.138,12.632,18.262,17.258c2.562,2.322,4.834,4.345,6.705,6.048 c1.872,1.686,3.365,3.075,4.265,3.975c3.702,3.702,8.898,8.448,15.314,13.66c9.621,7.806,21.932,16.624,35.809,23.996 c6.946,3.686,14.278,7.019,21.923,9.629c7.654,2.618,15.611,4.521,23.787,5.268c20.044,1.823,38.338-0.522,54.689-4.28 c12.271-2.819,23.481-6.417,33.632-9.709c7.605-2.465,14.616-4.746,20.944-6.456c4.754-1.286,9.107-2.224,13.018-2.755 c2.931-0.386,5.598-0.538,8.006-0.45c3.63,0.145,6.634,0.763,9.476,1.96c2.843,1.213,5.622,3.003,8.681,6.055L440.363,512 l71.633-71.633L502.079,430.441z M156.666,302.819c-25.834,0-46.77-20.936-46.77-46.77s20.936-46.77,46.77-46.77 s46.77,20.936,46.77,46.77S182.501,302.819,156.666,302.819z M440.371,472.312l-70.429-70.428 c-5.597-5.606-11.926-9.829-18.639-12.472c-5.87-2.337-11.941-3.453-17.868-3.71c-5.204-0.225-10.328,0.185-15.371,0.972 c-8.842,1.38-17.522,3.903-26.372,6.681c-13.267,4.176-26.935,9.01-41.422,12.335c-9.428,2.176-19.177,3.71-29.352,4.119 l188.896-188.888c-0.402,10.095-1.919,19.772-4.072,29.144c-2.481,10.8-5.79,21.177-9.05,31.247 c-2.441,7.556-4.875,14.952-6.866,22.301c-1.478,5.525-2.723,11.026-3.469,16.623c-0.554,4.184-0.835,8.416-0.674,12.72 c0.224,6.425,1.461,13.026,4.144,19.362c2.658,6.329,6.738,12.319,12.062,17.619l70.428,70.429L440.371,472.312z"/>
        </svg>
      )
    },

    { 
      name: "Sepak Takraw", 
      teams: 10, 
      matches: 30, 
      color: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-50",
      hoverBg: "hover:bg-amber-100",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M11.9999 22.9998C18.075 22.9998 22.9999 18.0749 22.9999 11.9998C22.9999 5.92462 18.075 0.999756 11.9999 0.999756C5.92478 0.999756 0.999908 5.92462 0.999908 11.9998C0.999908 18.0749 5.92478 22.9998 11.9999 22.9998ZM3.02676 12.6047C3.08664 13.5062 3.27939 14.3715 3.5856 15.181L7.66338 15.9224L8.78323 14.8025L7.25464 11.7454L5.99999 11.118L3.02676 12.6047ZM4.83959 17.4418C5.74823 18.6355 6.94856 19.5951 8.3343 20.2144L7.30091 17.8893L4.83959 17.4418ZM10.8358 20.9183C11.2168 20.9675 11.6054 20.9929 11.9999 20.9929C12.3945 20.9929 12.7831 20.9675 13.1642 20.9182L14.8072 17.2215L13.5858 16H10.4142L9.19274 17.2215L10.8358 20.9183ZM15.6657 20.2143C17.0514 19.595 18.2516 18.6354 19.1602 17.4418L16.6991 17.8893L15.6657 20.2143ZM3.16748 10.2982L4.86962 9.44715L4.41375 7.16782C3.81434 8.10693 3.38453 9.16479 3.16748 10.2982ZM6.06786 5.24032L6.88466 9.3243L7.89442 9.82918L11 7.5V6.11803L7.35671 4.29639C6.89885 4.57295 6.46765 4.88918 6.06786 5.24032ZM9.79419 3.27906L12 4.38197L14.2057 3.27909C13.4999 3.10112 12.761 3.00659 11.9999 3.00659C11.2389 3.00659 10.5 3.10111 9.79419 3.27906ZM16.6432 4.29644L13 6.11803V7.5L16.1056 9.82918L17.1153 9.3243L17.9321 5.24044C17.5323 4.88928 17.1011 4.57302 16.6432 4.29644ZM19.5862 7.16802L19.1304 9.44715L20.8323 10.2981C20.6153 9.16481 20.1855 8.10706 19.5862 7.16802ZM20.9731 12.6046L18 11.118L16.7453 11.7454L15.2168 14.8025L16.3366 15.9224L20.4142 15.181C20.7204 14.3715 20.9132 13.5062 20.9731 12.6046ZM9.26765 11.2993L12 9.25L14.7323 11.2993L13.382 14H10.618L9.26765 11.2993Z"></path>
        </svg>
      )
    },
    { 
      name: "Long Jump", 
      teams: 12, 
      matches: 36, 
      color: "from-indigo-400 to-indigo-600",
      bgColor: "bg-indigo-50",
      hoverBg: "hover:bg-indigo-100",
      svg: (
        <svg viewBox="0 0 440.151 440.151" fill="currentColor">
          <path d="M47.864,86.749l98.012,37.197L54.36,202.201c-6.005,5.124-7.41,14.035-2.973,20.813 c4.814,7.354,14.68,9.413,22.033,4.599l75.031-49.123c0,0-13.668,41.7-14.765,44.514c-5.019,12.871,1.347,27.374,14.219,32.393 l91.474,35.666l55.544,69.561c6.641,8.295,18.734,9.93,27.327,3.537c8.785-6.535,10.609-18.955,4.074-27.74l-50.64-68.072 l15.581,1.844l69.977,41.217c9.133,5.363,20.985,2.613,26.753-6.381c5.911-9.219,3.228-21.48-5.989-27.391l-72.493-46.479 c-2.043-1.297-4.447-2.285-6.974-2.744l-1.083-0.197l-69.863-12.684c0,0,32.531-96.01-5.286-113.515L60.92,49.315 c-9.956-3.15-20.81,1.974-24.561,11.858C32.473,71.413,37.624,82.863,47.864,86.749z"></path>
          <path d="M225.336,94.43c5.391,3.627,11.495,6.139,17.868,7.384l0.063,0.013c15.79,3.063,32.396-2.02,43.783-13.378 c11.549-11.527,16.62-28.571,13.254-44.541c-3.277-15.555-14.274-28.871-28.958-34.979c-15.025-6.251-32.545-4.517-46.039,4.578 c-13.496,9.094-21.675,24.682-21.523,40.957C203.938,70.365,212.152,85.555,225.336,94.43z"></path>
          <path d="M440.139,410.75c0-3.037-2.462-5.5-5.5-5.5c-4.75,0-6.878-0.747-9.584-1.696c-3.328-1.17-7.099-2.495-14.273-2.495 c-7.176,0-10.948,1.325-14.285,2.498c-2.695,0.946-4.824,1.693-9.575,1.693c-4.752,0-6.88-0.747-9.583-1.696 c-3.328-1.17-7.099-2.495-14.273-2.495s-10.944,1.326-14.279,2.498c-2.695,0.946-4.823,1.693-9.575,1.693 s-6.88-0.747-9.583-1.696c-3.328-1.17-7.099-2.495-14.272-2.495c-7.172,0-10.943,1.325-14.28,2.498 c-2.694,0.946-4.822,1.693-9.574,1.693c-4.75,0-6.879-0.747-9.581-1.696c-3.327-1.169-7.097-2.495-14.271-2.495 s-10.945,1.326-14.279,2.498c-2.694,0.946-4.823,1.693-9.572,1.693s-6.876-0.747-9.579-1.696 c-3.327-1.169-7.097-2.495-14.27-2.495c-7.174,0-10.944,1.326-14.279,2.498c-2.695,0.946-4.823,1.693-9.573,1.693 c-4.749,0-6.876-0.747-9.58-1.696c-3.326-1.169-7.097-2.495-14.27-2.495c-7.174,0-10.944,1.326-14.28,2.498 c-2.694,0.946-4.821,1.693-9.572,1.693c-4.749,0-6.876-0.747-9.58-1.696c-3.326-1.169-7.097-2.495-14.271-2.495 c-7.176,0-10.946,1.326-14.281,2.499c-2.694,0.945-4.822,1.692-9.572,1.692c-4.749,0-6.876-0.747-9.579-1.696 c-3.326-1.169-7.095-2.495-14.27-2.495c-7.173,0-10.945,1.325-14.282,2.498c-2.694,0.946-4.821,1.693-9.572,1.693 c-4.749,0-6.876-0.747-9.579-1.696c-1.736-0.61-3.745-1.316-6.411-1.821v-0.816c0-3.037-2.462-5.5-5.5-5.5h-26 c-3.038,0-5.5,2.463-5.5,5.5v28.514c0,3.038,2.462,5.5,5.5,5.5h429.151c3.038,0,5.5-2.462,5.5-5.5L440.139,410.75z"></path>
        </svg>
      )
    },
    { 
      name: "Javelin Throw", 
      teams: 10, 
      matches: 30, 
      color: "from-rose-400 to-rose-600",
      bgColor: "bg-rose-50",
      hoverBg: "hover:bg-rose-100",
      svg: (
        <svg viewBox="0 0 448.9 448.9" fill="currentColor">
          <path d="M421.973,147.242l-105.182-4.778c-0.68-0.028-1.406-0.06-2.096,0c-53.809,4.717-76.514,14.404-85.105,14.866 l-51.537,2.146l-24.197-45.26c-0.08-0.146-0.172-0.284-0.256-0.429c1.602-1.162,3.205-2.325,4.842-3.516 C294.303,11.566,303.272,2.444,301.741,0.338c-1.527-2.106-11.723,2.693-148.84,102.309c-2.25,1.634-4.459,3.238-6.637,4.824 c-3.217-1.265-6.891-1.408-10.395-0.131c-6.262,2.281-10.021,8.379-9.625,14.71C14.781,203.354,8.176,210.619,9.599,212.58 c1.412,1.941,11.268-2.767,119.463-81.011l20.414,56.015c2.314,6.33,8.26,10.982,15.412,11.295l2.59,0.111l58.762,2.556 l16.119,88.521l-23.115,64.058l-39.957,51.188c-6.986,8.997-5.998,22.061,2.598,29.815c9,8.127,22.889,7.416,31.016-1.588 l46.707-51.743c1.281-1.437,2.428-3.153,3.25-5.009l0.711-1.597l30.537-68.792c0.982,1.304,2.084,2.544,3.32,3.692l47.578,44.158 l-20.27,66.252c-3.268,10.793,2.191,22.564,12.857,26.827c11.266,4.499,24.047-0.986,28.547-12.252l32.031-80.186 c3.369-8.471,1.729-18.514-5.021-25.486l-1.199-1.239l-48.641-50.24l-16.348-89.791l95.012-4.314 c9.326-0.456,17.027-7.944,17.459-17.461C439.891,156.262,432.075,147.701,421.973,147.242z"></path>
          <path d="M274.936,57.283c-23.209-7.761-48.311,4.767-56.064,27.965c-7.76,23.208,4.762,48.308,27.969,56.064 c23.207,7.76,48.305-4.762,56.064-27.965C310.662,90.139,298.139,65.043,274.936,57.283z"></path>
        </svg>
      )
    },
    { 
      name: "Relay", 
      teams: 16, 
      matches: 32, 
      color: "from-cyan-400 to-cyan-600",
      bgColor: "bg-cyan-50",
      hoverBg: "hover:bg-cyan-100",
      svg: (
        <svg viewBox="0 0 59.771 59.771" fill="currentColor">
          <path d="M14.397,31.767c-0.078-0.459-0.212-0.919-0.401-1.366c-0.563-1.33-0.871-2.734-1.011-4.16c1.498,0.876,2.942,1.839,4.268,2.972c2.577,2.2,6.334-1.521,3.739-3.739c-2.799-2.39-5.909-4.21-9.186-5.859c-0.067-0.034-0.133-0.061-0.2-0.088c-0.751-0.657-1.726-1.068-2.707-1.074c-2.338-0.016-3.954,1.838-4.115,4.056c-0.067,0.909-0.07,1.805-0.032,2.694c-0.912,1.108-2.02,2.033-3.407,2.726c-3.05,1.522-0.372,6.083,2.669,4.564c0.633-0.315,1.228-0.69,1.801-1.093c0.317,1.056,0.693,2.102,1.132,3.138c0.012,0.028,0.028,0.054,0.041,0.08c-1.219,2.235-2.123,4.619-2.207,7.212c-0.121,3.68,2.537,6.471,5.637,7.98c3.052,1.483,5.734-3.072,2.669-4.564c-1.831-0.893-3.072-1.814-3.002-3.958c0.044-1.345,0.648-2.716,1.382-3.992c2.18,3.771,4.413,7.511,6.655,11.246c1.751,2.919,6.323,0.263,4.564-2.667C19.88,41.196,17.087,36.512,14.397,31.767z"></path>
          <circle cx="7.77" cy="14.046" r="4.005"></circle>
          <circle cx="35.312" cy="13.673" r="4.005"></circle>
          <path d="M55.141,34.124c-1.076,0.892-2.216,1.701-3.326,2.545c-1.215-1.675-2.51-3.323-3.521-5.104c-0.081-0.415-0.216-0.829-0.401-1.228c-0.787-1.682-1.547-3.375-2.285-5.078c2.168,0.646,4.401,1.087,6.689,1.381c3.375,0.432,3.334-4.859,0-5.288c-3.753-0.482-7.396-1.591-10.681-3.484c-0.009-0.004-0.017-0.008-0.023-0.012c-0.854-0.554-1.897-0.768-3.089-0.449c-0.678,0.181-1.337,0.599-1.873,1.147c-2.729,1.452-5.27,3.191-7.589,5.255c-0.111,0.099-0.206,0.201-0.294,0.304l-5.735-4.064l-0.972,1.373l6.163,4.369c0.158,1.469,1.78,2.759,3.375,2.392l0.067,0.048l0.059-0.082c0.368-0.105,0.73-0.297,1.074-0.602c1.188-1.057,2.457-1.997,3.785-2.848c1.237,2.974,2.512,5.932,3.857,8.859c-1.82,3.951-4.312,7.582-6.359,11.436c-1.601,3.008,2.965,5.68,4.562,2.667c2.02-3.797,4.38-7.388,6.25-11.226c0.124-0.018,0.246-0.037,0.367-0.062c1.244,1.826,2.576,3.604,3.716,5.521c0.892,1.496,2.91,1.705,4.151,0.533c1.787-1.684,3.877-3.002,5.768-4.563C61.509,35.689,57.747,31.971,55.141,34.124z"></path>
        </svg>
      )
    },
    { 
      name: "Chess", 
      teams: 16, 
      matches: 48, 
      color: "from-gray-600 to-gray-800",
      bgColor: "bg-gray-50",
      hoverBg: "hover:bg-gray-100",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M4,22l.811-3.243A1,1,0,0,1,5.781,18H8L9,8H7A1,1,0,0,1,6,7V2H8V4h2V2h4V4h2V2h2V7a1,1,0,0,1-1,1H15l1,10h2.219a1,1,0,0,1,.97.757L20,22Z"></path>
        </svg>
      )
    },
    { 
      name: "Track & Field", 
      teams: 14, 
      matches: 42, 
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      hoverBg: "hover:bg-purple-100",
      svg: (
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="currentColor">
          <circle cx="32" cy="14" r="6"/>
          <path d="M42 24h-6l-2-4h-8l-2 4h-6l4 8v16h4V36h4v12h4V32l4-8z"/>
          <path d="M20 52h24v4H20z"/>
          <path d="M16 48l4-4 4 4-4 4zm32 0l-4-4-4 4 4 4z"/>
        </svg>
      )
    },
    { 
      name: "Running", 
      teams: 10, 
      matches: 25, 
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      hoverBg: "hover:bg-red-100",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.5 6C19.8807 6 21 4.88071 21 3.5C21 2.11929 19.8807 1 18.5 1C17.1193 1 16 2.11929 16 3.5C16 4.88071 17.1193 6 18.5 6Z"></path>
          <path d="M9.49967 3.9377L7.47 5.20625C7.11268 5.42957 7 5.79894 7 6.19575C7 6.98119 7.86395 7.46003 8.53 7.04375L10.4185 5.86341C10.7689 5.64441 11.218 5.66348 11.5485 5.91141L13 7L9.29261 10.7074C9.09787 10.9021 8.91955 11.1126 8.75947 11.3367L6.94614 13.8754C6.683 14.2438 6.20519 14.3894 5.78129 14.2305L3.21008 13.2663C2.7942 13.1103 2.3257 13.2614 2.07933 13.631C1.76802 14.098 1.92419 14.7314 2.41688 15.0001L4.88909 16.3486C6.12269 17.0215 7.65806 16.7479 8.58338 15.6904L10.5 13.5L12.3001 16.0201C12.7307 16.623 12.7928 17.4144 12.4615 18.077L10.7236 21.5528C10.3912 22.2177 10.8746 23 11.618 23C12.0887 23 12.5417 22.9167 12.7764 22.4472L14.7476 18.5049C15.2149 17.5701 15.1622 16.4595 14.6083 15.5732L13 13L16 10L17.3722 10.9148C18.6066 11.7378 19.9731 11.6756 21.3162 11.2279C21.7813 11.0729 22 10.6447 22 10.1805C22 9.56252 21.4451 9.09248 20.8356 9.19407C20.1453 9.30911 19.1462 9.69488 18.6352 9.01366C16.9655 6.78731 14.9948 5.21933 12.5466 3.85922C11.5923 3.32907 10.4254 3.35913 9.49967 3.9377Z"></path>
        </svg>
      )
    },
    { 
      name: "Discus Throw", 
      teams: 12, 
      matches: 24, 
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      hoverBg: "hover:bg-emerald-100",
      svg: (
        <svg viewBox="0 0 61.374 61.374" fill="currentColor">
          <circle cx="21.995" cy="15.397" r="3.174"></circle>
          <path d="M60.892,43.769c-0.107-0.03-8.844-2.63-20.781-3.665c-2.303-3.913-4.604-7.823-6.906-11.735 c-0.062-0.105-0.129-0.198-0.201-0.285c-0.047-0.12-0.103-0.24-0.164-0.36c-0.912-1.779-1.857-3.543-2.835-5.288 c3.097,0.095,6.195,0.19,9.292,0.286c2.523,0.076,2.517-3.837,0-3.914c-4.256-0.13-8.513-0.26-12.771-0.391 c-0.487-0.015-0.878,0.121-1.177,0.349c-0.324,0.073-0.639,0.192-0.935,0.351c-0.297,0.072-0.591,0.221-0.867,0.469 c-2.416,2.17-4.83,4.342-7.246,6.514c-1.879,1.689,0.896,4.447,2.766,2.766c1.531-1.376,3.062-2.752,4.594-4.129 c1.137,1.986,2.227,4,3.278,6.035c-1.774,0.906-3.417,2.035-4.945,3.365c-0.629,0.548-0.746,1.216-0.553,1.805 c-0.043,0.184-0.07,0.379-0.055,0.6c0.073,1.11,0.146,2.22,0.218,3.33c-4.563,0.193-8.747,0.535-12.229,1.006 C0,42.147,0,43.738,0,44.418c0,0.679,0,2.271,9.375,3.537c5.698,0.771,13.267,1.196,21.312,1.196 c16.484,0,30.071-4.048,30.207-4.09c0.284-0.084,0.48-0.346,0.48-0.646C61.373,44.118,61.176,43.856,60.892,43.769z M30.781,33.338c0.238-0.083,0.44-0.197,0.612-0.333c1.331,2.261,2.662,4.523,3.993,6.785c-1.533-0.069-3.104-0.107-4.701-0.107 c-1.754,0-3.483,0.021-5.178,0.062c-0.07-1.069-0.14-2.136-0.21-3.203c-0.001-0.028-0.01-0.051-0.013-0.077 C26.928,35.123,28.775,34.036,30.781,33.338z M30.685,47.802c-18.537,0-28.724-2.155-29.328-3.386 c0.498-1.014,7.509-2.653,20.334-3.198c0.052,0.792,0.103,1.584,0.156,2.376c0.163,2.506,4.077,2.52,3.912,0 c-0.055-0.835-0.109-1.669-0.164-2.506c1.619-0.035,3.315-0.057,5.089-0.057c1.884,0,3.729,0.055,5.521,0.149 c0.336,0.569,0.672,1.142,1.008,1.713c1.16,1.968,4.049,0.535,3.623-1.371c7.719,0.724,13.99,2.087,17.24,2.894 C53.488,45.555,42.893,47.802,30.685,47.802z"></path>
        </svg>
      )
    },
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

      {/* Sports Section */}
      <section
        id="sports"
        data-animate
        className={`py-24 px-4 bg-gradient-to-br from-green-600 via-green-700 to-emerald-900 relative transition-all duration-1000 delay-300 overflow-hidden ${
          isVisible.sports ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-20 bg-white opacity-5 transform -skew-y-3"></div>
          <div className="absolute bottom-0 right-0 w-full h-20 bg-white opacity-5 transform skew-y-3"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-[0.05]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge 
              variant="success" 
              className="mb-4 px-4 py-2 text-sm font-semibold shadow-md bg-white/10 text-white border-white/20"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Explore Sports
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose Your Sport
            </h2>
            <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto">
              Select a sport to view standings, schedules, and results
            </p>
          </div>

          {/* Ultra Compact Sports Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {sports.map((sport, index) => (
              <div
                key={index}
                onClick={() => router.push(`/sports/${sport.name.toLowerCase().replace(/\s+/g, '-')}`)}
                className={`group relative bg-white rounded-lg border border-gray-200 hover:border-green-400 shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer overflow-hidden ${
                  sport.bgColor
                } bg-opacity-0 hover:bg-opacity-100`}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r ${sport.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Card Content */}
                <div className="relative flex items-center p-2 gap-2.5">
                  {/* Icon Container - Left Side */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-md bg-gradient-to-br ${sport.color} p-1.5 shadow-sm transform group-hover:scale-105 transition-all duration-150`}>
                    <div className="text-white w-full h-full">
                      {sport.svg}
                    </div>
                  </div>
                  
                  {/* Text Content - Right Side */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-150 leading-tight">
                      {sport.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Users className="w-2.5 h-2.5" />
                        {sport.teams}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-0.5">
                        <Target className="w-2.5 h-2.5" />
                        {sport.matches}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${sport.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-150 origin-left`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section id="leaderboard" className="py-24 px-4">
        <OverallStandings />
      </section>

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
              onClick={() => router.push('/user/signup')}
            >
              Sign Up Now
            </Button>
            
          </div>
        </div>
      </section>
      
      <Footer/>

      

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
