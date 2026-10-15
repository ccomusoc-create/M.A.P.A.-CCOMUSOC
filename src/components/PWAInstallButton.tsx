import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Si ya está ejecutándose como aplicación instalada, no mostrar
  if (isInstalled) {
    return null;
  }

  // Flujo Android / Chrome / Edge / Escritorio
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#e65c00] hover:bg-[#cf5300] rounded-lg shadow-sm transition-all transform active:scale-95 whitespace-nowrap cursor-pointer"
        title="Instalar la aplicación en tu celular para mapear sin señal"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span>Instalar en Celular (PWA)</span>
      </button>
    );
  }

  // Flujo iOS Safari (Guía visual para agregar a Inicio)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-neutral-200 border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          title="Instalar en iPhone o iPad"
        >
          <Smartphone className="w-3 h-3 text-[#0e98d6]" />
          <span>Instalar PWA en iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1e1e1e] p-6 shadow-2xl border border-slate-200 dark:border-neutral-800 text-[#1a1a1a] dark:text-[#e0e0e0]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-anton text-lg text-[#0e98d6]">
                  INSTALAR EN IPHONE O IPAD
                </h3>
                <button 
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-neutral-400 mb-4 leading-relaxed">
                Para usar CComuSoc en el territorio sin conexión a internet desde Safari:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-xs font-medium mb-5">
                <li>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en la barra inferior de Safari.</li>
                <li>Desplázate hacia abajo y selecciona <strong>"Agregar a Inicio"</strong>.</li>
                <li>Confirma tocando <strong>"Agregar"</strong> en la esquina superior derecha.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 bg-[#0e98d6] hover:bg-[#0b80b5] text-white text-xs font-bold rounded-xl"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
