import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-gradient-to-r from-green-500 to-green-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">IntraTrack</h2>
            <p className="text-sm opacity-80">Track your intramural sports activities</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            <div>
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li><Link href="/" className="hover:underline">Home</Link></li>
                <li><Link href="/leaderboard" className="hover:underline">Leaderboard</Link></li>
                <li><Link href="/add-score" className="hover:underline">Add Score</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <ul className="space-y-1">
                <li>Email: info@intratrack.com</li>
                <li>Phone: (123) 456-7890</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-green-400 text-center text-sm opacity-80">
          <p>© {new Date().getFullYear()} IntraTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
