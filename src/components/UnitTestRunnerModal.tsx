import React, { useState } from 'react';
import { X, Play, CheckCircle2, XCircle, Code2, RefreshCw } from 'lucide-react';
import { UnitTestResult } from '../types';
import { runAllUnitTests } from '../utils/unitTests';

interface UnitTestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitTestRunnerModal: React.FC<UnitTestRunnerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [results, setResults] = useState<UnitTestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executed, setExecuted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRunTests = async () => {
    setIsRunning(true);
    setExecuted(false);
    try {
      const testResults = await runAllUnitTests();
      setResults(testResults);
      setExecuted(true);
    } catch (err) {
      console.error('Error al ejecutar pruebas:', err);
    } finally {
      setIsRunning(false);
    }
  };

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden my-6">
        
        <div className="bg-[#0e98d6] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5" />
            <div>
              <h2 className="font-anton text-xl tracking-wide leading-none">
                SUITE DE PRUEBAS UNITARIAS EXHAUSTIVAS
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                Verificación de geolocalización, límites de video, RBAC y sincronización offline
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-[#1a1a1a] dark:text-[#e0e0e0]">
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 dark:text-neutral-400">
              Ejecuta pruebas en tiempo real directamente en el entorno de ejecución para certificar la fiabilidad del software libre.
            </p>
            <button
              onClick={handleRunTests}
              disabled={isRunning}
              className="px-4 py-2 bg-[#0e98d6] hover:bg-[#0b80b5] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Ejecutando Pruebas...' : 'Ejecutar Pruebas Ahora'}</span>
            </button>
          </div>

          {executed && (
            <div className="p-3 rounded-xl bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-neutral-400">
                Resultado Total: {results.length} pruebas completadas
              </span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {passedCount} Exitosas
                </span>
                {failedCount > 0 && (
                  <span className="text-red-500 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> {failedCount} Fallidas
                  </span>
                )}
              </div>
            </div>
          )}

          {results.length > 0 ? (
            <div className="space-y-2.5">
              {results.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212] flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    {r.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-[#1a1a1a] dark:text-[#e0e0e0]">
                        {r.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">
                        {r.message}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0 tabular-nums">
                    {r.durationMs} ms
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 dark:text-neutral-500 text-xs">
              Haz clic en "Ejecutar Pruebas Ahora" para verificar los 8 módulos críticos del sistema.
            </div>
          )}

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
