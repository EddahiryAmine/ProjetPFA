import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Nom / Logo */}
        <div className="text-xl font-bold text-cyan-400">JobHub</div>

        {/* Liens classiques */}
        <div className="flex gap-6 text-sm text-gray-300">
          <Link to="/about" className="hover:text-white">À propos</Link>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <Link to="/legal" className="hover:text-white">Mentions légales</Link>
        </div>

        {/* Icônes sociales */}
        <div className="flex gap-4 text-xl text-cyan-400">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FaLinkedin />
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white">
            <FaGithub />
          </a>
          <a href="mailto:support@jobhub.com" className="hover:text-white">
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
}
