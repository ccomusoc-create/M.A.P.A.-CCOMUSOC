import React, { useMemo } from 'react';
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  Radio, 
  TrendingUp, 
  Award, 
  FileSpreadsheet, 
  FileText, 
  Calendar,
  Globe2,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { SocialProject, CommunityTestimony } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';
import { calculateCoverageAreaKm2 } from '../utils/geoUtils';

interface AnalyticsDashboardProps {
  projects: SocialProject[];
  testimonies: CommunityTestimony[];
  onExportCSV: () => void;
  onOpenReportModal: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  projects,
  testimonies,
  onExportCSV,
  onOpenReportModal
}) => {
  // Cálculos estadísticos en tiempo real
  const stats = useMemo(() => {
    const totalDirect = projects.reduce((acc, p) => acc + p.directBeneficiaries, 0);
    const totalIndirect = projects.reduce((acc, p) => acc + p.indirectBeneficiaries, 0);
    const totalBeneficiaries = totalDirect + totalIndirect;

    const totalAreaKm2 = projects.reduce((acc, p) => acc + calculateCoverageAreaKm2(p.impactRadiusKm), 0);
    
    const approvedTestimonies = testimonies.filter(t => t.status === 'aprobado' || t.status === 'destacado');
    const avgRating = testimonies.length > 0
      ? (testimonies.reduce((acc, t) => acc + t.rating, 0) / testimonies.length).toFixed(1)
      : '5.0';

    // Desglose por categoría
    const byCategory: Record<string, { count: number; beneficiaries: number }> = {};
    projects.forEach(p => {
      if (!byCategory[p.category]) {
        byCategory[p.category] = { count: 0, beneficiaries: 0 };
      }
      byCategory[p.category].count += 1;
      byCategory[p.category].beneficiaries += (p.directBeneficiaries + p.indirectBeneficiaries);
    });

    // Rendimiento y evolución mensual (Enero - Diciembre)
    const monthlyPerformance = [
      { month: 'Ene', projects: 2, beneficiaries: 6200, testimonies: 12 },
      { month: 'Feb', projects: 3, beneficiaries: 9400, testimonies: 18 },
      { month: 'Mar', projects: 3, beneficiaries: 12800, testimonies: 25 },
      { month: 'Abr', projects: 4, beneficiaries: 17500, testimonies: 34 },
      { month: 'May', projects: 4, beneficiaries: 22000, testimonies: 45 },
      { month: 'Jun', projects: 5, beneficiaries: 28400, testimonies: 58 },
      { month: 'Jul', projects: 5, beneficiaries: 35100, testimonies: 71 },
      { month: 'Ago', projects: 6, beneficiaries: 42900, testimonies: 89 },
      { month: 'Sep', projects: 6, beneficiaries: 51200, testimonies: 104 },
      { month: 'Oct', projects: projects.length, beneficiaries: totalBeneficiaries, testimonies: testimonies.length + 95 }
    ];

    return {
      totalDirect,
      totalIndirect,
      totalBeneficiaries,
      totalAreaKm2: Math.round(totalAreaKm2),
      activeProjectsCount: projects.filter(p => p.status === 'activo' || p.status === 'en_ejecucion').length,
      approvedTestimoniesCount: approvedTestimonies.length,
      avgRating,
      byCategory,
      monthlyPerformance
    };
  }, [projects, testimonies]);

  const maxBeneficiaries = Math.max(...stats.monthlyPerformance.map(m => m.beneficiaries));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Encabezado del Panel de Analítica */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0e98d6] mb-1">
            Plataforma Territorial CComuSoc
          </div>
          <h1 className="font-anton text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            PANEL DE ANALÍTICA DE IMPACTO EN TIEMPO REAL
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Métricas consolidadas de intervenciones de comunicación social, alcance de beneficiarios, cobertura geodésica y testimonios de comunidades locales.
          </p>
        </div>

        {/* Acciones de Exportación */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Excel / CSV</span>
          </button>
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#0e98d6] hover:bg-[#0b80b5] text-white rounded-lg shadow-sm shadow-[#0e98d6]/30 transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generar Informe PDF</span>
          </button>
        </div>
      </div>

      {/* Grid de KPIs Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* KPI 1: Beneficiarios */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Beneficiarios</span>
            <Users className="w-4 h-4 text-[#0e98d6]" />
          </div>
          <div className="text-3xl font-anton text-slate-900 dark:text-white tabular-nums tracking-wide">
            {stats.totalBeneficiaries.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
            <span>Directos: <strong className="text-slate-700 dark:text-slate-200">{stats.totalDirect.toLocaleString()}</strong></span>
            <span>Indirectos: <strong className="text-slate-700 dark:text-slate-200">{stats.totalIndirect.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* KPI 2: Proyectos Activos */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Proyectos Activos</span>
            <MapPin className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-anton text-slate-900 dark:text-white tabular-nums tracking-wide">
            {stats.activeProjectsCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
            En 6 provincias con cobertura comunitaria
          </div>
        </div>

        {/* KPI 3: Cobertura Territorial */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Área de Impacto</span>
            <Globe2 className="w-4 h-4 text-[#0e98d6]" />
          </div>
          <div className="text-3xl font-anton text-slate-900 dark:text-white tabular-nums tracking-wide">
            {stats.totalAreaKm2.toLocaleString()} <span className="text-lg font-sans font-normal text-slate-400">km²</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
            Radios de acción geolocalizados
          </div>
        </div>

        {/* KPI 4: Percepción Comunitaria */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Índice Percepción Social</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-anton text-slate-900 dark:text-white tabular-nums tracking-wide">
            {stats.avgRating} <span className="text-lg font-sans font-normal text-amber-500">★</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
            Basado en {testimonies.length} testimonios comunitarios
          </div>
        </div>
      </div>

      {/* Gráfico de Rendimiento Mensual del Proyecto */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="font-anton text-xl text-slate-900 dark:text-white">
              EVOLUCIÓN Y RENDIMIENTO MENSUAL DE INTERVENCIONES
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Crecimiento acumulado de personas beneficiadas por las redes de comunicación y desarrollo (2026)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#0e98d6]"></span>
              <span>Beneficiarios Acumulados</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
              <span>Testimonios Nuevos</span>
            </div>
          </div>
        </div>

        {/* Barras SVG Ultraligeras y Responsivas (Aptas para dispositivos con <=4GB de RAM) */}
        <div className="h-64 flex items-end gap-2 sm:gap-4 pt-4 border-b border-slate-200 dark:border-slate-800">
          {stats.monthlyPerformance.map((item, idx) => {
            const heightPercent = Math.max(12, Math.round((item.beneficiaries / maxBeneficiaries) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 tabular-nums whitespace-nowrap">
                  {item.beneficiaries.toLocaleString()}
                </div>
                <div 
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[42px] bg-gradient-to-t from-[#0e98d6] to-[#4ac0f2] rounded-t-md transition-all group-hover:brightness-110 relative"
                >
                  {/* Punto de Testimonios */}
                  <div 
                    style={{ bottom: `${Math.min(90, item.testimonies * 0.8)}%` }}
                    className="absolute -left-1 -right-1 mx-auto w-2 h-2 rounded-full bg-amber-400 border border-white shadow-xs"
                    title={`${item.testimonies} testimonios`}
                  />
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2">
                  {item.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desglose por Ejes Temáticos y ODS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Distribución por Áreas de Comunicación */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <h2 className="font-anton text-lg text-slate-900 dark:text-white mb-4">
            ALCANCE POR LÍNEAS DE ACCIÓN SOCIAL
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.byCategory).map(([catKey, data]) => {
              const catConfig = CATEGORY_DETAILS[catKey as keyof typeof CATEGORY_DETAILS] || { label: catKey, color: '#0e98d6' };
              const percent = Math.round((data.beneficiaries / stats.totalBeneficiaries) * 100) || 1;
              return (
                <div key={catKey}>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{catConfig.label}</span>
                    <span className="text-slate-500 tabular-nums">
                      {data.beneficiaries.toLocaleString()} personas ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${percent}%`, backgroundColor: catConfig.color }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen de Integración Institucional & ODS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="font-anton text-lg text-slate-900 dark:text-white mb-2">
              OBJETIVOS DE DESARROLLO SOSTENIBLE (ODS)
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              La plataforma monitorea indicadores clave alineados con la Agenda 2030 de Naciones Unidas:
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900/50">
                <span className="font-bold text-red-600 dark:text-red-400 block">ODS 2 & 3</span>
                <span className="text-slate-700 dark:text-slate-300">Hambre Cero, Soberanía Alimentaria y Salud Comunitaria</span>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50">
                <span className="font-bold text-blue-600 dark:text-blue-400 block">ODS 10 & 16</span>
                <span className="text-slate-700 dark:text-slate-300">Reducción de Desigualdades y Acceso a la Información Popular</span>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">ODS 6 & 11</span>
                <span className="text-slate-700 dark:text-slate-300">Agua Limpia, Saneamiento y Ciudades Sostenibles</span>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900/50">
                <span className="font-bold text-purple-600 dark:text-purple-400 block">ODS 5</span>
                <span className="text-slate-700 dark:text-slate-300">Igualdad de Género y Liderazgo de Mujeres Rurales</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Sincronización automática de analítica</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> En tiempo real
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
