import Link from 'next/link';
import { TreeLogo } from './icons/TreeLogo';

export default function Footer() {
  return (
    <footer className="bg-sage-800 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <TreeLogo size={36} className="text-peach-400" />
            <div>
              <h3 className="text-xl font-semibold font-heading">KitaWorksHub</h3>
              <p className="text-[10px] uppercase tracking-[0.15em] text-sage-300">Where Leaders Grow Deep</p>
            </div>
          </div>
          <p className="text-sage-200 text-sm leading-relaxed max-w-xs">
            Consultancy-first platform focused on delivery excellence, capability building, and community.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-semibold mb-4 text-peach-400 font-heading">Services</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/services" className="text-sage-200 hover:text-white transition-colors text-sm">
                PMO Setup
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-sage-200 hover:text-white transition-colors text-sm">
                Leadership Coaching
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-sage-200 hover:text-white transition-colors text-sm">
                Organization Design
              </Link>
            </li>
          </ul>
        </div>

        {/* Learning */}
        <div>
          <h4 className="font-semibold mb-4 text-peach-400 font-heading">Learning</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/courses" className="text-sage-200 hover:text-white transition-colors text-sm">
                Courses
              </Link>
            </li>
            <li>
              <Link href="/events" className="text-sage-200 hover:text-white transition-colors text-sm">
                Events
              </Link>
            </li>
            <li>
              <Link href="/community" className="text-sage-200 hover:text-white transition-colors text-sm">
                Community
              </Link>
            </li>
          </ul>
        </div>

        {/* Portal & Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-peach-400 font-heading">Access</h4>
          <ul className="space-y-3">
            <li>
              <Link href="/portal" className="text-sage-200 hover:text-white transition-colors text-sm">
                Client Portal
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-sage-200 hover:text-white transition-colors text-sm">
                Admin Portal
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sage-200 hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sage-300 text-sm">
          © 2025 KitaWorksHub. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <Link href="/privacy" className="text-sage-300 hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sage-300 hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
