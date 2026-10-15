import React from 'react';
import { Mail, Globe, Code, Github } from 'lucide-react';

interface FooterProps {
  onOpenDevProfile: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDevProfile
}) => {
  return (
    <footer className="bg-white dark:bg-[#121212] border-t border-slate-200 dark:border-neutral-800 transition-colors py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Contenido Principal del Pie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600 dark:text-neutral-400 mb-6">
          <div>
            <h4 className="font-anton text-base text-[#1a1a1a] dark:text-[#e0e0e0] mb-2 tracking-wide">
              CCOMUSOC · COMUNICACIÓN PARA EL DESARROLLO
            </h4>
            <p className="leading-relaxed mb-3">
              Plataforma comunitaria de geolocalización de impacto social, analítica en tiempo real y recolección de testimonios orales y vivencias territoriales sin censura.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="mailto:ccomusoc@gmail.com" 
                className="flex items-center gap-1.5 text-[#0e98d6] hover:underline font-semibold"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ccomusoc@gmail.com</span>
              </a>
              <span className="text-slate-300 dark:text-neutral-700">·</span>
              <a 
                href="https://ccomusoc.com.ar" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1.5 text-[#0e98d6] hover:underline font-semibold"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>ccomusoc.com.ar</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-anton text-base text-[#1a1a1a] dark:text-[#e0e0e0] mb-2 tracking-wide">
              CÓDIGO ABIERTO & REPOSITORIO GITHUB
            </h4>
            <p className="leading-relaxed mb-3">
              Proyecto de código abierto desarrollado para ser inyectado y sincronizado directamente mediante GitHub. Cartografía libre basada en OpenStreetMap y Leaflet.js, optimizada para dispositivos de bajos recursos.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDevProfile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f4f6f9] dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 text-[11px] font-semibold text-[#1a1a1a] dark:text-[#e0e0e0] hover:border-[#0e98d6] transition-colors cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-[#0e98d6]" />
                <span>Equipo de Desarrollo & Licencia GPL-3.0</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="pt-6 border-t border-slate-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-neutral-500">
          <div>
            © 2026 CComuSoc (ccomusoc.com.ar) · Comunicación Social para el Desarrollo Comunitario
          </div>
          <div className="flex items-center gap-3">
            <span>Para envíos de video extenso: <a href="mailto:ccomusoc@gmail.com" className="text-[#0e98d6] hover:underline font-medium">ccomusoc@gmail.com</a></span>
          </div>
        </div>

      </div>
    </footer>
  );
};
