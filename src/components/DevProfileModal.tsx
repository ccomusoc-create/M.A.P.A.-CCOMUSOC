import React from 'react';
import { X, Github, Mail, Globe, Code, Shield, Heart, Users } from 'lucide-react';

interface DevProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevProfileModal: React.FC<DevProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden my-6">
        
        <div className="bg-[#0e98d6] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-white" />
            <div>
              <h2 className="font-anton text-xl tracking-wide leading-none">
                DESARROLLADOR PRINCIPAL & EQUIPO COLABORATIVO
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                CComuSoc · Código Abierto y Transparencia Tecnológica
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-[#1a1a1a] dark:text-[#e0e0e0]">
          
          {/* Perfil del Desarrollador Principal */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-800">
            <div className="w-16 h-16 rounded-full bg-[#0e98d6] text-white flex items-center justify-center font-anton text-2xl shadow-md shrink-0">
              CC
            </div>
            <div>
              <h3 className="font-anton text-xl text-[#1a1a1a] dark:text-[#e0e0e0]">
                DESARROLLADOR PRINCIPAL & ARQUITECTURA
              </h3>
              <p className="text-xs text-[#0e98d6] font-semibold mb-2">
                Colectivo Tecnológico CComuSoc (ccomusoc.com.ar)
              </p>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
                Ingeniería de software orientada a la soberanía tecnológica popular, optimización para teléfonos de gama baja con memoria limitada (&le;4GB RAM), soporte offline mediante Service Workers y sincronización bidireccional con Google Sheets y WordPress.
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <a 
                  href="mailto:ccomusoc@gmail.com" 
                  className="flex items-center gap-1.5 text-[#0e98d6] hover:underline font-semibold"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>ccomusoc@gmail.com</span>
                </a>
                <span className="text-slate-400">·</span>
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
          </div>

          {/* Equipo de Colaboradores de Campo */}
          <div>
            <h4 className="font-anton text-base text-[#1a1a1a] dark:text-[#e0e0e0] mb-3">
              EQUIPO DE CO-CREADORES Y COMUNICADORES TERRITORIALES
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212]">
                <div className="font-bold text-[#1a1a1a] dark:text-[#e0e0e0]">Nodo NOA & Quebrada</div>
                <div className="text-[11px] text-slate-500 dark:text-neutral-400">Relevamiento de radios indígenas y campesinas bilingües.</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212]">
                <div className="font-bold text-[#1a1a1a] dark:text-[#e0e0e0]">Nodo Centro & Punilla</div>
                <div className="text-[11px] text-slate-500 dark:text-neutral-400">Mapeo agroecológico y soberanía alimentaria en comedores.</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212]">
                <div className="font-bold text-[#1a1a1a] dark:text-[#e0e0e0]">Nodo Conurbano Moreno</div>
                <div className="text-[11px] text-slate-500 dark:text-neutral-400">Mapeo barrial de agua potable y saneamiento socio-urbano.</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212]">
                <div className="font-bold text-[#1a1a1a] dark:text-[#e0e0e0]">Nodo Rosario & Juventud</div>
                <div className="text-[11px] text-slate-500 dark:text-neutral-400">Laboratorio audiovisual y producción de microformatos comunitarios.</div>
              </div>
            </div>
          </div>

          {/* Licencia de Código Abierto */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212]">
            <div className="flex items-center gap-2 mb-2 font-bold text-xs text-[#0e98d6]">
              <Code className="w-4 h-4" />
              <span>Compromiso con el Software Libre (Licencia GPL-3.0)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
              Este proyecto es de código abierto para asegurar transparencia pública, auditoría comunitaria y permitir que cualquier organización social de América Latina pueda replicar la plataforma de mapeo sin costo de licencias privativas.
            </p>
          </div>

        </div>

        <div className="p-4 bg-[#f4f6f9] dark:bg-[#121212] border-t border-slate-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-neutral-800 hover:bg-slate-300 text-xs font-semibold rounded-lg text-slate-700 dark:text-neutral-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
