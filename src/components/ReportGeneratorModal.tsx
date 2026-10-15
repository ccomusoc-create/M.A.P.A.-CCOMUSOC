import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { SocialProject, CommunityTestimony } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';
import { calculateCoverageAreaKm2 } from '../utils/geoUtils';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SocialProject[];
  testimonies: CommunityTestimony[];
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  projects,
  testimonies
}) => {
  if (!isOpen) return null;

  const totalDirect = projects.reduce((acc, p) => acc + p.directBeneficiaries, 0);
  const totalIndirect = projects.reduce((acc, p) => acc + p.indirectBeneficiaries, 0);
  const totalArea = Math.round(projects.reduce((acc, p) => acc + calculateCoverageAreaKm2(p.impactRadiusKm), 0));
  const currentDate = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto no-print">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden my-6">
        
        {/* Cabecera del Modal */}
        <div className="bg-[#0e98d6] px-6 py-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5" />
            <div>
              <h2 className="font-anton text-xl tracking-wide leading-none">
                INFORME MENSUAL DE RENDIMIENTO Y COBERTURA (PDF)
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                Generador automático de reportes institucionales
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-white text-[#0e98d6] hover:bg-slate-100 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vista Previa del Informe (Optimizada para Impresión y PDF) */}
        <div id="printable-report" className="p-8 max-h-[80vh] overflow-y-auto bg-white text-slate-900 font-sans print:p-0 print:max-h-none">
          
          {/* Encabezado del Documento Oficial */}
          <div className="border-b-2 border-[#0e98d6] pb-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-anton text-[#0e98d6] tracking-wide">
                CCOMUSOC
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Comunicación para el Desarrollo Comunitario · ccomusoc.com.ar
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Contacto Oficial: ccomusoc@gmail.com
              </div>
            </div>
            <div className="text-left sm:text-right text-xs">
              <div className="font-bold text-slate-900 text-sm">INFORME DE IMPACTO TERRITORIAL</div>
              <div className="text-slate-500">Fecha de Emisión: {currentDate}</div>
              <div className="text-slate-500">Período: Octubre 2026</div>
              <div className="text-emerald-700 font-semibold mt-1">Estado: Verificado y Certificado</div>
            </div>
          </div>

          {/* Resumen Ejecutivo */}
          <div className="mb-6">
            <h3 className="font-anton text-lg text-slate-900 border-b border-slate-200 pb-1 mb-2">
              1. RESUMEN EJECUTIVO DE GESTIÓN TERRITORIAL
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              Durante el presente ciclo de monitoreo, la plataforma CComuSoc ha articulado <strong>{projects.length} iniciativas sociales activas</strong> en territorio, alcanzando a una población estimada de <strong>{(totalDirect + totalIndirect).toLocaleString()} personas</strong> de forma directa e indirecta. La cobertura territorial geodésica acumulada abarca <strong>{totalArea.toLocaleString()} km²</strong> a través de radios de comunicación popular, huertas agroecológicas, observatorios de agua y centros comunitarios de salud.
            </p>
          </div>

          {/* Indicadores de Rendimiento */}
          <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-center">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Proyectos</div>
              <div className="font-anton text-xl text-slate-900">{projects.length}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Beneficiarios Directos</div>
              <div className="font-anton text-xl text-[#0e98d6]">{totalDirect.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Cobertura (km²)</div>
              <div className="font-anton text-xl text-slate-900">{totalArea.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Testimonios Locales</div>
              <div className="font-anton text-xl text-[#e65c00]">{testimonies.length}</div>
            </div>
          </div>

          {/* Tabla de Intervenciones Mapeadas */}
          <div className="mb-6">
            <h3 className="font-anton text-lg text-slate-900 border-b border-slate-200 pb-1 mb-2">
              2. DETALLE DE PROYECTOS SOCIALES E IMPACTO
            </h3>
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                  <th className="py-2 px-2.5">Proyecto</th>
                  <th className="py-2 px-2.5">Eje Temático</th>
                  <th className="py-2 px-2.5">Localidad</th>
                  <th className="py-2 px-2.5">Radio</th>
                  <th className="py-2 px-2.5 text-right">Beneficiarios</th>
                  <th className="py-2 px-2.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 px-2.5 font-bold text-slate-900">{p.title}</td>
                    <td className="py-2 px-2.5">{CATEGORY_DETAILS[p.category]?.label || p.category}</td>
                    <td className="py-2 px-2.5">{p.locationName}, {p.province}</td>
                    <td className="py-2 px-2.5">{p.impactRadiusKm} km</td>
                    <td className="py-2 px-2.5 text-right font-mono font-bold">
                      {(p.directBeneficiaries + p.indirectBeneficiaries).toLocaleString()}
                    </td>
                    <td className="py-2 px-2.5 capitalize">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Testimonios Comunitarios Relevantes */}
          <div className="mb-8">
            <h3 className="font-anton text-lg text-slate-900 border-b border-slate-200 pb-1 mb-2">
              3. TESTIMONIOS VECINALES Y PERCEPCIÓN DE IMPACTO
            </h3>
            <div className="space-y-2">
              {testimonies.slice(0, 3).map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 border-l-2 border-[#0e98d6] rounded text-xs">
                  <blockquote className="italic text-slate-800">
                    "{t.quoteHighlight || t.storyText}"
                  </blockquote>
                  <div className="text-[10px] text-slate-500 mt-1">
                    — {t.isAnonymous ? 'Vecina / Ciudadano' : t.authorName} ({t.communityRole}), {t.neighborhood} · Calificación: {'★'.repeat(t.rating)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bloque de Firmas Institucionales */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="h-12 border-b border-slate-400 mx-auto w-48 mb-2"></div>
              <div className="font-bold text-slate-900">Coordinación Territorial CComuSoc</div>
              <div className="text-slate-500 text-[11px]">Red de Comunicación para el Desarrollo</div>
            </div>
            <div>
              <div className="h-12 border-b border-slate-400 mx-auto w-48 mb-2"></div>
              <div className="font-bold text-slate-900">Validación de Datos Comunitarios</div>
              <div className="text-slate-500 text-[11px]">ccomusoc@gmail.com · ccomusoc.com.ar</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
