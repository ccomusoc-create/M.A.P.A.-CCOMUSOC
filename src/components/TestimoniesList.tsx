import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Volume2, 
  Video, 
  Camera, 
  Star, 
  Plus, 
  Heart,
  Quote
} from 'lucide-react';
import { CommunityTestimony } from '../types';

interface TestimoniesListProps {
  testimonies: CommunityTestimony[];
  onOpenNewTestimony: () => void;
}

export const TestimoniesList: React.FC<TestimoniesListProps> = ({
  testimonies,
  onOpenNewTestimony
}) => {
  const [search, setSearch] = useState('');
  const [filterFormat, setFilterFormat] = useState<string>('all');

  const filtered = testimonies.filter(t => {
    const matchSearch = search === '' ||
      t.storyText.toLowerCase().includes(search.toLowerCase()) ||
      t.authorName.toLowerCase().includes(search.toLowerCase()) ||
      t.neighborhood.toLowerCase().includes(search.toLowerCase()) ||
      t.projectName.toLowerCase().includes(search.toLowerCase());
    
    const matchFormat = filterFormat === 'all' || 
      (filterFormat === 'audio' && (t.mediaType === 'audio' || t.storyText.includes('audio'))) ||
      (filterFormat === 'video' && t.mediaType === 'video') ||
      (filterFormat === 'photo' && t.mediaType === 'photo');

    return matchSearch && matchFormat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0e98d6] mb-1">
            Voces y Relatos Populares
          </div>
          <h1 className="font-anton text-3xl sm:text-4xl text-[#1a1a1a] dark:text-[#e0e0e0] leading-tight">
            TESTIMONIOS DE LA COMUNIDAD LOCAL
          </h1>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-1 max-w-2xl font-sans">
            Historias de transformación territorial compartidas en viva voz, video corto y texto por vecinas, productores y comunicadores.
          </p>
        </div>

        <button
          onClick={onOpenNewTestimony}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-[#e65c00] hover:bg-[#cf5300] text-white rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Sumar Mi Relato / Nota de Voz</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-xs mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f6f9] dark:bg-[#121212] rounded-xl text-xs flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por barrio, relator, proyecto o palabras clave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[#1a1a1a] dark:text-[#e0e0e0] w-full text-xs"
          />
        </div>

        <select
          value={filterFormat}
          onChange={(e) => setFilterFormat(e.target.value)}
          className="text-xs bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 text-[#1a1a1a] dark:text-[#e0e0e0] rounded-xl px-3 py-2 outline-none cursor-pointer"
        >
          <option value="all">Todos los Formatos ({testimonies.length})</option>
          <option value="audio">Notas de Voz (Audio)</option>
          <option value="video">Videos de 30s</option>
          <option value="photo">Fotografías de Territorio</option>
        </select>
      </div>

      {/* Grid de Testimonios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div 
            key={t.id}
            className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-neutral-800 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0e98d6]/10 text-[#0e98d6] font-bold flex items-center justify-center text-xs">
                    {t.isAnonymous ? 'V' : t.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#1a1a1a] dark:text-[#e0e0e0]">
                      {t.isAnonymous ? 'Vecina del barrio' : t.authorName}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {t.communityRole} · {t.neighborhood}
                    </div>
                  </div>
                </div>

                <div className="flex text-amber-400 text-xs">
                  {'★'.repeat(t.rating)}
                </div>
              </div>

              {/* Cita / Frase Destacada */}
              {t.quoteHighlight && (
                <div className="p-3 bg-[#0e98d6]/5 dark:bg-[#0e98d6]/10 border-l-2 border-[#0e98d6] rounded-r-lg mb-3 text-xs italic font-semibold text-[#0e98d6]">
                  "{t.quoteHighlight}"
                </div>
              )}

              <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed mb-4">
                {t.storyText}
              </p>

              {/* Reproductor de Audio si existe nota de voz */}
              {t.mediaType === 'audio' && t.mediaUrl && (
                <div className="my-3 p-2 bg-[#f4f6f9] dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-neutral-800 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#0e98d6]" />
                  <audio src={t.mediaUrl} controls className="h-7 w-full" />
                </div>
              )}

              {/* Video o Foto preview si existe */}
              {t.mediaType === 'video' && t.mediaUrl && (
                <div className="my-3 rounded-xl overflow-hidden bg-black max-h-40 flex items-center justify-center">
                  <video src={t.mediaUrl} controls className="max-h-40 w-auto" />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[180px]">Proyecto: <strong>{t.projectName}</strong></span>
              <span>{t.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
