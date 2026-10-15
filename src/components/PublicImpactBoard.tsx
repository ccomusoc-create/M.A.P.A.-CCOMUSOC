import React from 'react';
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  Sparkles, 
  Volume2, 
  HeartHandshake, 
  Globe2, 
  CheckCircle,
  Share2
} from 'lucide-react';
import { SocialProject, CommunityTestimony } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';

interface PublicImpactBoardProps {
  projects: SocialProject[];
  testimonies: CommunityTestimony[];
  onOpenCrowdmapping: () => void;
  onOpenTestimony: () => void;
}

export const PublicImpactBoard: React.FC<PublicImpactBoardProps> = ({
  projects,
  testimonies,
  onOpenCrowdmapping,
  onOpenTestimony
}) => {
  const totalBeneficiaries = projects.reduce((acc, p) => acc + p.directBeneficiaries + p.indirectBeneficiaries, 0);
  const audioTestimonies = testimonies.filter(t => t.mediaType === 'audio' || t.storyText.includes('audio'));
  const approvedTestimonies = testimonies.filter(t => t.status === 'aprobado' || t.status === 'destacado');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Banner de Devolución Comunitaria */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0e98d6] to-[#075982] text-white p-6 sm:p-10 shadow-xl overflow-hidden mb-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-white" />
            <span>Devolución del Conocimiento Popular</span>
          </div>
          <h1 className="font-anton text-3xl sm:text-5xl tracking-wide leading-tight mb-3">
            TABLERO DE IMPACTO ABIERTO PARA LA COMUNIDAD
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 font-sans">
            La información territorial no pertenece a los escritorios: pertenece a los barrios que la construyen día a día. Aquí puedes consultar qué iniciativas solidarias, huertas, radios y testimonios hemos mapeado juntos en todo el territorio.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCrowdmapping}
              className="px-5 py-2.5 bg-[#e65c00] hover:bg-[#cf5300] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Sugerir un Punto Comunitario</span>
            </button>
            <button
              onClick={onOpenTestimony}
              className="px-5 py-2.5 bg-white text-[#0e98d6] hover:bg-slate-100 text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Sumar mi Nota de Voz o Relato</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de Logros Colectivos (Lenguaje Sencillo y Democratizado) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs font-bold text-[#0e98d6] uppercase tracking-wider mb-1">
            Espacios Mapeados
          </div>
          <div className="text-4xl font-anton text-[#1a1a1a] dark:text-[#e0e0e0] tabular-nums">
            {projects.length} Puntos
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2">
            Radios populares, huertas agroecológicas, comedores y centros culturales en actividad.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs font-bold text-[#e65c00] uppercase tracking-wider mb-1">
            Vecinas y Vecinos Apoyados
          </div>
          <div className="text-4xl font-anton text-[#1a1a1a] dark:text-[#e0e0e0] tabular-nums">
            {totalBeneficiaries.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2">
            Personas que acceden a alimentos frescos, salud comunitaria y comunicación libre.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">
            Voces y Relatos Recogidos
          </div>
          <div className="text-4xl font-anton text-[#1a1a1a] dark:text-[#e0e0e0] tabular-nums">
            {testimonies.length} Testimonios
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2">
            Historias orales y vivencias de transformación barrial sin censura.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 shadow-xs">
          <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">
            Valoración Colectiva
          </div>
          <div className="text-4xl font-anton text-[#1a1a1a] dark:text-[#e0e0e0] tabular-nums">
            4.9 / 5.0 ★
          </div>
          <p className="text-xs text-slate-500 dark:text-neutral-400 mt-2">
            Calificación otorgada por la propia comunidad sobre el beneficio de las intervenciones.
          </p>
        </div>
      </div>

      {/* ¿Qué se hace en cada barrio? Desglose amigable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 shadow-xs">
          <h2 className="font-anton text-2xl text-[#1a1a1a] dark:text-[#e0e0e0] mb-4">
            ¿EN QUÉ ESTAMOS TRABAJANDO JUNTOS?
          </h2>
          <div className="space-y-3">
            {Object.entries(CATEGORY_DETAILS).map(([key, config]) => {
              const count = projects.filter(p => p.category === key).length;
              if (count === 0) return null;
              return (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-[#f4f6f9] dark:bg-[#121212]">
                  <div className="flex items-center gap-2.5">
                    <span 
                      style={{ backgroundColor: config.color }} 
                      className="w-3.5 h-3.5 rounded-full shrink-0" 
                    />
                    <span className="text-xs font-semibold text-[#1a1a1a] dark:text-[#e0e0e0]">
                      {config.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#0e98d6] tabular-nums">
                    {count} {count === 1 ? 'punto activo' : 'puntos activos'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Muro de Voces Comunitarias */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-anton text-2xl text-[#1a1a1a] dark:text-[#e0e0e0] mb-4">
              VOCES DESTACADAS DE LA VECINDAD
            </h2>
            <div className="space-y-3">
              {approvedTestimonies.slice(0, 3).map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-[#f4f6f9] dark:bg-[#121212] border-l-3 border-[#0e98d6]">
                  <p className="text-xs italic text-[#1a1a1a] dark:text-[#e0e0e0] mb-1.5">
                    "{t.quoteHighlight || t.storyText}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400">
                    <span className="font-semibold text-slate-700 dark:text-neutral-200">
                      {t.isAnonymous ? 'Vecina del barrio' : t.authorName} ({t.communityRole})
                    </span>
                    <span className="text-[#0e98d6]">{t.neighborhood}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 text-center">
            <span className="text-xs text-slate-500 dark:text-neutral-400">
              Datos abiertos y transparentes bajo licencia libre GPLv3 · ccomusoc.com.ar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
