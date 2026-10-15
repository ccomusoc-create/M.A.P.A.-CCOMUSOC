import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Radio, 
  Users, 
  Globe2, 
  MessageSquare, 
  ExternalLink,
  Plus,
  HeartHandshake
} from 'lucide-react';
import { SocialProject, ProjectCategory } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';
import { calculateCoverageAreaKm2 } from '../utils/geoUtils';

interface ProjectsListProps {
  projects: SocialProject[];
  onSelectProjectOnMap: (project: SocialProject) => void;
  onOpenTestimonyForProject: (project: SocialProject) => void;
  onOpenNewProject: () => void;
  onOpenCrowdmapping: () => void;
  canCreateProject: boolean;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onSelectProjectOnMap,
  onOpenTestimonyForProject,
  onOpenNewProject,
  onOpenCrowdmapping,
  canCreateProject
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = projects.filter(p => {
    const matchSearch = search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.locationName.toLowerCase().includes(search.toLowerCase()) ||
      p.province.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0e98d6] mb-1">
            Directorio Territorial
          </div>
          <h1 className="font-anton text-3xl sm:text-4xl text-[#1a1a1a] dark:text-[#e0e0e0] leading-tight">
            PROYECTOS Y EXPERIENCIAS SOCIALES EN TERRITORIO
          </h1>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-1 max-w-2xl font-sans">
            Iniciativas de comunicación popular, soberanía alimentaria, salud comunitaria y derechos humanos georreferenciadas en el mapa.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCrowdmapping}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#e65c00] hover:bg-[#cf5300] text-white rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Sugerir un Punto Comunitario</span>
          </button>

          {canCreateProject && (
            <button
              onClick={onOpenNewProject}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#0e98d6] hover:bg-[#0b80b5] text-white rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Proyecto</span>
            </button>
          )}
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f6f9] dark:bg-[#121212] rounded-xl text-xs flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, localidad, provincia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[#1a1a1a] dark:text-[#e0e0e0] w-full text-xs"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 text-[#1a1a1a] dark:text-[#e0e0e0] rounded-xl px-3 py-2 outline-none cursor-pointer"
        >
          <option value="all">Todas las Categorías ({projects.length})</option>
          {Object.entries(CATEGORY_DETAILS).map(([key, item]) => (
            <option key={key} value={key}>{item.label}</option>
          ))}
        </select>
      </div>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => {
          const config = CATEGORY_DETAILS[p.category] || { label: p.category, color: '#0e98d6' };
          const coverage = calculateCoverageAreaKm2(p.impactRadiusKm);

          return (
            <div 
              key={p.id}
              className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span 
                    style={{ color: config.color }} 
                    className="text-[11px] font-bold uppercase tracking-wider"
                  >
                    {config.label}
                  </span>
                  <span className="text-[11px] font-semibold capitalize px-2 py-0.5 rounded bg-[#f4f6f9] dark:bg-[#121212] text-slate-600 dark:text-neutral-400">
                    {p.status}
                  </span>
                </div>

                <h3 className="font-anton text-xl text-[#1a1a1a] dark:text-[#e0e0e0] mb-2 leading-snug">
                  {p.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-neutral-400 mb-4 line-clamp-3 leading-relaxed">
                  {p.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#f4f6f9] dark:bg-[#121212] p-2.5 rounded-xl mb-4">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Beneficiarios</span>
                    <strong className="text-[#1a1a1a] dark:text-[#e0e0e0] tabular-nums">
                      {(p.directBeneficiaries + p.indirectBeneficiaries).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Cobertura</span>
                    <strong className="text-[#0e98d6] tabular-nums">
                      {p.impactRadiusKm} km (~{coverage} km²)
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1.5 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-[#0e98d6]" />
                  <span>{p.locationName}, {p.province}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center gap-2">
                <button
                  onClick={() => onSelectProjectOnMap(p)}
                  className="flex-1 py-2 px-3 text-xs font-semibold text-[#0e98d6] bg-[#0e98d6]/10 hover:bg-[#0e98d6]/20 rounded-lg text-center transition-colors cursor-pointer"
                >
                  Ver en Mapa
                </button>
                <button
                  onClick={() => onOpenTestimonyForProject(p)}
                  className="py-2 px-3 text-xs font-semibold text-white bg-[#e65c00] hover:bg-[#cf5300] rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Testimonio</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
