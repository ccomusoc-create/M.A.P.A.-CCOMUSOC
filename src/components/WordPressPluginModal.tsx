import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Code, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  FileArchive,
  ArrowRight
} from 'lucide-react';
import { 
  getWordPressPluginPHPCode, 
  downloadWordPressPluginZip, 
  downloadWordPressPluginFile 
} from '../utils/wordPressPlugin';

interface WordPressPluginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordPressPluginModal: React.FC<WordPressPluginModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedShortcode, setCopiedShortcode] = useState(false);
  const pluginCode = getWordPressPluginPHPCode();

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pluginCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyShortcode = () => {
    navigator.clipboard.writeText('[ccomusoc_mapa altura="750px"]');
    setCopiedShortcode(true);
    setTimeout(() => setCopiedShortcode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden my-6">
        
        {/* Cabecera */}
        <div className="bg-[#0e98d6] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-anton text-xl tracking-wide leading-none">
                INSTALACIÓN DEL PLUGIN EN CCOMUSOC.COM.AR (WORDPRESS)
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                Solución al error "No se encontraron plugins" y paquete .ZIP listo para subir
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-[#1a1a1a] dark:text-[#e0e0e0]">
          
          {/* Explicación del Error de WordPress */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 dark:text-amber-200 text-sm block mb-1">
                  ¿Por qué falló con <code>M.A.P.A.-CCOMUSOC-main.zip</code>?
                </strong>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                  El archivo <code>M.A.P.A.-CCOMUSOC-main.zip</code> es el repositorio completo de código fuente en React y Vite (Node.js). WordPress no lo reconoce como plugin porque espera un archivo comprimido específico que contenga la cabecera de plugin de WordPress (<code>ccomusoc-mapa.php</code>).
                </p>
                <p className="text-amber-800 dark:text-amber-300 font-semibold mt-2">
                  👉 Para solucionarlo: Descarga a continuación el archivo <code>ccomusoc-mapa.zip</code>, que ya está empaquetado y listo para ser instalado en WordPress en 1 clic.
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta de Descarga Principal: ccomusoc-mapa.zip */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <FileArchive className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-anton text-lg text-[#1a1a1a] dark:text-[#e0e0e0] leading-none mb-1">
                    PAQUETE PLUGIN WORDPRESS (ZIP LISTO)
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-neutral-400">
                    Archivo: <strong className="text-emerald-700 dark:text-emerald-400 font-mono">ccomusoc-mapa.zip</strong> · Versión 2.4.0 (100% compatible con WordPress 5.6+)
                  </div>
                </div>
              </div>

              <button
                onClick={downloadWordPressPluginZip}
                className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" />
                <span>Descargar ccomusoc-mapa.zip</span>
              </button>
            </div>
          </div>

          {/* Pasos de Instalación en ccomusoc.com.ar */}
          <div>
            <h4 className="font-anton text-base text-[#1a1a1a] dark:text-[#e0e0e0] mb-3">
              PASO A PASO PARA SUBIRLO A TU WORDPRESS:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-800">
                <span className="w-5 h-5 rounded-full bg-[#0e98d6] text-white font-bold flex items-center justify-center text-[10px] mb-2">1</span>
                <strong className="block mb-1 text-[#1a1a1a] dark:text-[#e0e0e0]">Descargar ZIP</strong>
                <span className="text-slate-500 dark:text-neutral-400">Descarga el archivo <code>ccomusoc-mapa.zip</code> con el botón verde superior.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-800">
                <span className="w-5 h-5 rounded-full bg-[#0e98d6] text-white font-bold flex items-center justify-center text-[10px] mb-2">2</span>
                <strong className="block mb-1 text-[#1a1a1a] dark:text-[#e0e0e0]">Ir a Plugins</strong>
                <span className="text-slate-500 dark:text-neutral-400">En tu panel de WordPress, ve a <strong>Plugins &gt; Añadir nuevo plugin &gt; Subir plugin</strong>.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-800">
                <span className="w-5 h-5 rounded-full bg-[#0e98d6] text-white font-bold flex items-center justify-center text-[10px] mb-2">3</span>
                <strong className="block mb-1 text-[#1a1a1a] dark:text-[#e0e0e0]">Instalar y Activar</strong>
                <span className="text-slate-500 dark:text-neutral-400">Selecciona <code>ccomusoc-mapa.zip</code> y haz clic en <strong>Instalar ahora</strong> y luego <strong>Activar</strong>.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-800">
                <span className="w-5 h-5 rounded-full bg-[#0e98d6] text-white font-bold flex items-center justify-center text-[10px] mb-2">4</span>
                <strong className="block mb-1 text-[#1a1a1a] dark:text-[#e0e0e0]">Pegar Shortcode</strong>
                <span className="text-slate-500 dark:text-neutral-400">Pega <code>[ccomusoc_mapa]</code> en la página donde quieras ver el mapa interactivo.</span>
              </div>
            </div>
          </div>

          {/* Shortcode para copiar */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212]">
            <div className="text-xs font-bold text-slate-700 dark:text-neutral-300 mb-2">
              Shortcode listo para pegar en cualquier página de ccomusoc.com.ar:
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2.5 bg-white dark:bg-[#1e1e1e] rounded-lg text-xs font-mono font-bold text-[#0e98d6] border border-slate-200 dark:border-neutral-700">
                [ccomusoc_mapa altura="750px"]
              </code>
              <button
                onClick={handleCopyShortcode}
                className="px-3.5 py-2.5 bg-[#0e98d6] hover:bg-[#0b80b5] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {copiedShortcode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShortcode ? '¡Copiado!' : 'Copiar Shortcode'}</span>
              </button>
            </div>
          </div>

          {/* Opción adicional: Descargar solo el archivo PHP */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-neutral-800 text-slate-500 dark:text-neutral-400">
            <span>¿Prefieres subirlo por FTP o File Manager?</span>
            <button
              onClick={downloadWordPressPluginFile}
              className="text-[#0e98d6] hover:underline font-semibold cursor-pointer"
            >
              Descargar solo archivo ccomusoc-mapa.php
            </button>
          </div>

        </div>

        <div className="p-4 bg-[#f4f6f9] dark:bg-[#121212] border-t border-slate-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-neutral-800 hover:bg-slate-300 text-xs font-semibold rounded-lg text-slate-700 dark:text-neutral-300 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
