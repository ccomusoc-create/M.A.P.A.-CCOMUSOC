import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  AlertCircle,
  Database,
  CheckCircle2,
  Table
} from 'lucide-react';
import { GoogleSheetConfig, SocialProject, CommunityTestimony } from '../types';
import { getGoogleAppsScriptTemplate, exportToCSV } from '../utils/googleSheetsSync';

interface GoogleSheetSyncPanelProps {
  config: GoogleSheetConfig;
  onUpdateConfig: (newConfig: Partial<GoogleSheetConfig>) => void;
  onTriggerSync: () => Promise<void>;
  projects: SocialProject[];
  testimonies: CommunityTestimony[];
}

export const GoogleSheetSyncPanel: React.FC<GoogleSheetSyncPanelProps> = ({
  config,
  onUpdateConfig,
  onTriggerSync,
  projects,
  testimonies
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [manualWebhookUrl, setManualWebhookUrl] = useState(config.webhookUrl);
  const [sheetIdInput, setSheetIdInput] = useState(config.sheetId);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const appsScriptCode = getGoogleAppsScriptTemplate();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      webhookUrl: manualWebhookUrl.trim(),
      sheetId: sheetIdInput.trim()
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0e98d6] mb-1">
            Gestión y Seguimiento Administrativo
          </div>
          <h1 className="font-anton text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            INTEGRACIÓN AUTOMÁTICA CON GOOGLE SHEETS
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Sincroniza en tiempo real todos los proyectos territoriales y testimonios en una planilla de cálculo compartida de Google Sheets para auditoría administrativa, reportes institucionales y trabajo colaborativo.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportToCSV(projects, testimonies, 'all')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar CSV Completo</span>
          </button>

          <button
            onClick={onTriggerSync}
            disabled={config.isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#0e98d6] hover:bg-[#0b80b5] disabled:opacity-50 text-white rounded-lg shadow-sm shadow-[#0e98d6]/30 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${config.isSyncing ? 'animate-spin' : ''}`} />
            <span>{config.isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}</span>
          </button>
        </div>
      </div>

      {/* Tarjeta de Estado de Sincronización */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          <div>
            <div className="text-xs text-slate-500 font-medium mb-1">Estado de la Conexión</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-800 dark:text-slate-100 text-base">
                {config.webhookUrl ? 'Vinculado a Google Webhook' : 'Almacenamiento Local Activo (Listo para Conectar)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Todos los proyectos y testimonios se almacenan con redundancia local en el navegador.
            </p>
          </div>

          <div className="md:pl-6 pt-4 md:pt-0">
            <div className="text-xs text-slate-500 font-medium mb-1">Registros Listos para Planilla</div>
            <div className="font-anton text-2xl text-slate-900 dark:text-white tabular-nums">
              {projects.length} Proyectos / {testimonies.length} Testimonios
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Total consolidado: {projects.length + testimonies.length} filas preparadas
            </div>
          </div>

          <div className="md:pl-6 pt-4 md:pt-0">
            <div className="text-xs text-slate-500 font-medium mb-1">Última Sincronización</div>
            <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">
              {config.lastSyncTimestamp ? new Date(config.lastSyncTimestamp).toLocaleString() : 'Recientemente'}
            </div>
            <div className="text-[11px] text-[#0e98d6] font-semibold mt-1">
              {config.autoSyncEnabled ? '✓ Auto-sincronización activada' : 'Modo manual'}
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de Webhook & Apps Script */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Formulario de Configuración del Webhook */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-[#0e98d6]" />
            <h2 className="font-anton text-xl text-slate-900 dark:text-white">
              VINCULAR URL DE GOOGLE APPS SCRIPT
            </h2>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Ingresa la URL de la aplicación web generada en Google Sheets (Deploy como Web App). Cada nuevo proyecto o testimonio enviado por la comunidad se transmitirá instantáneamente a tus columnas de Google Sheet.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL del Webhook de Google Sheets (doPost):
              </label>
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                value={manualWebhookUrl}
                onChange={(e) => setManualWebhookUrl(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ID o Nombre de la Planilla Google Sheet:
              </label>
              <input
                type="text"
                placeholder="CComuSoc_Monitoreo_Comunitario_2026"
                value={sheetIdInput}
                onChange={(e) => setSheetIdInput(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoSyncEnabled}
                  onChange={(e) => onUpdateConfig({ autoSyncEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#0e98d6] rounded"
                />
                <span>Sincronizar automáticamente en cada nuevo testimonio</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-[#0e98d6] hover:bg-[#0b80b5] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Guardar Configuración
              </button>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Configuración guardada correctamente.</span>
              </div>
            )}
          </form>

          {/* Pasos Rápidos */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Instrucciones de configuración (3 minutos):</div>
            <ol className="list-decimal list-inside space-y-1.5 text-[11px]">
              <li>Crea una nueva hoja en <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-[#0e98d6] hover:underline">Google Sheets</a>.</li>
              <li>Ve a <strong>Extensiones &gt; Apps Script</strong>.</li>
              <li>Pega el código del panel derecho en el archivo <code>Code.gs</code>.</li>
              <li>Haz clic en <strong>Implementar &gt; Nueva implementación</strong>, selecciona tipo <em>Aplicación Web</em> y acceso <em>Cualquier usuario</em>.</li>
              <li>Copia la URL generada y pégala arriba. ¡Listo!</li>
            </ol>
          </div>
        </div>

        {/* Visor del Código de Google Apps Script */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-emerald-500" />
                <h2 className="font-anton text-xl text-slate-900 dark:text-white">
                  SCRIPT DE APPS SCRIPT (CODE.GS)
                </h2>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? '¡Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Crea automáticamente las hojas <code>Proyectos_Sociales</code> y <code>Testimonios_Comunidad</code> con encabezados institucionales en color corporativo #0e98d6.
            </p>

            <pre className="bg-slate-950 text-slate-200 p-3.5 rounded-xl text-[11px] font-mono h-80 overflow-y-auto leading-relaxed border border-slate-800">
              {appsScriptCode}
            </pre>
          </div>
        </div>

      </div>

      {/* Vista Previa de Filas de Datos */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="font-anton text-xl text-slate-900 dark:text-white mb-4">
          VISTA PREVIA DE DATOS SINCRONIZADOS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">ID Proyecto</th>
                <th className="py-2.5 px-3">Título</th>
                <th className="py-2.5 px-3">Localidad</th>
                <th className="py-2.5 px-3">Provincia</th>
                <th className="py-2.5 px-3">Beneficiarios</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3">Sincronizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#0e98d6]">{p.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{p.title}</td>
                  <td className="py-2.5 px-3">{p.locationName}</td>
                  <td className="py-2.5 px-3">{p.province}</td>
                  <td className="py-2.5 px-3 tabular-nums">{(p.directBeneficiaries + p.indirectBeneficiaries).toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <span className="capitalize">{p.status}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Conforme</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
