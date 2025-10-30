import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { ChevronRight, Play, Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-16 px-4 relative overflow-hidden border-t border-gray-200">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjEuOSAyLjEgMi4xdjE5LjhjMCAxLjItLjkgMi4xLTIuMSAyLjFIMTYuMmMtMS4yIDAtMi4xLS45LTIuMS0yLjFWMjAuMWMwLTEuMi45LTIuMSAyLjEtMi4xaDE5Ljh6TTAgMGg2MHY2MEgweiIvPjwvZz48L3N2Zz4=')] opacity-[0.02]"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green-50/40 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-green-400 to-green-600 rounded-xl mr-3 shadow-lg shadow-green-900/20">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-700">Intramurals</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                The ultimate platform for school sports competition tracking and team management excellence.
              </p>
              
              <div className="mt-6 flex space-x-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="bg-green-100 p-2 rounded-full hover:bg-green-200 transition-colors duration-300 hover:scale-110 transform text-green-700"
                    aria-label={`Social media link ${index + 1}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-xl relative inline-block text-green-700">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-green-500"></div>
              </h4>
              <ul className="space-y-3 text-gray-600">
                {["Leaderboard", "Teams", "Schedule", "Results"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-green-700 transition-colors duration-300 flex items-center group">
                      <div className="bg-green-100 p-1 rounded-md mr-2.5 group-hover:bg-green-200 transition-colors duration-300">
                        <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-xl relative inline-block text-green-700">
                Sports
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-green-500"></div>
              </h4>
              <ul className="space-y-3 text-gray-600">
                {["Basketball", "Football", "Volleyball", "Tennis"].map((sport) => (
                  <li key={sport}>
                    <a href="#" className="hover:text-green-700 transition-colors duration-300 flex items-center group">
                      <div className="bg-green-100 p-1 rounded-md mr-2.5 group-hover:bg-green-200 transition-colors duration-300">
                        <Play className="w-3 h-3 transform group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      {sport}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-xl relative inline-block text-green-700">
                Contact
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-green-500"></div>
              </h4>
              <ul className="space-y-4 text-gray-600">
                {[
                  { icon: <Mail className="w-4 h-4" />, text: "info@intramurals.edu" },
                  { icon: <Phone className="w-4 h-4" />, text: "(555) 123-4567" },
                  { icon: <MapPin className="w-4 h-4" />, text: "123 Campus Drive" }
                ].map((item, index) => (
                  <li key={index} className="flex items-center group">
                    <div className="bg-green-100 p-2 rounded-full mr-3 group-hover:bg-green-200 transition-colors duration-300 text-green-700">
                      {item.icon}
                    </div>
                    <span className="group-hover:text-green-700 transition-colors duration-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-300 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Intramurals. All rights reserved.</p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="#" className="hover:text-green-700 transition-colors duration-300">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-green-700 transition-colors duration-300">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-green-700 transition-colors duration-300">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
  );
}
