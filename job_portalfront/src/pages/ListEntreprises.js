import React, { useState } from "react";

export default function ListEntreprises() {
  const [search, setSearch] = useState("");

  const entreprises = [
    { id: 1, nom: "TechCorp", ville: "Paris" },
    { id: 2, nom: "Designify", ville: "Lille" },
    { id: 3, nom: "DataPlus", ville: "Remote" },
    { id: 4, nom: "CloudWave", ville: "Toulouse" },
    { id: 5, nom: "WebFlow", ville: "Marseille" },
  ];

  const filtered = entreprises.filter((e) =>
    e.nom.toLowerCase().includes(search.toLowerCase()) ||
    e.ville.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-slate-200
 px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400 text-center">Entreprises partenaires</h1>
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="🔍 Rechercher une entreprise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl p-3 rounded-xl bg-slate-800 text-slate-200
 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((ent) => (
          <div key={ent.id} className="bg-slate-800 p-6 rounded-xl text-center shadow-md hover:shadow-cyan-500/30 transition">
            <h4 className="text-xl font-bold mb-1">{ent.nom}</h4>
            <p className="text-slate-400">{ent.ville}</p>
            <button className="mt-4 bg-slate-700 hover:bg-slate-600 text-slate-200
 px-4 py-2 rounded">
              Voir profil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
