import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Star, 
  Bell, 
  Activity, 
  Mail, 
  Trash2, 
  Edit,
  ShieldCheck,
  Check,
  Send,
  MessageCircle,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { UserProfile, UserRole, CommunityTestimony } from '../types';
import { 
  getMessagingConfig, 
  saveMessagingConfig, 
  sendTelegramNotification, 
  generateWhatsAppLink,
  MessagingConfig 
} from '../utils/messagingChannels';

interface AdminUserPanelProps {
  currentUser: UserProfile;
  users: UserProfile[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onAddUser: (user: Omit<UserProfile, 'id' | 'activeSince'>) => void;
  testimonies: CommunityTestimony[];
  onUpdateTestimonyStatus: (testimonyId: string, status: 'aprobado' | 'destacado' | 'pendiente') => void;
  onDeleteTestimony: (testimonyId: string) => void;
}

export const AdminUserPanel: React.FC<AdminUserPanelProps> = ({
  currentUser,
  users,
  onUpdateUserRole,
  onAddUser,
  testimonies,
  onUpdateTestimonyStatus,
  onDeleteTestimony
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'moderation' | 'channels'>('users');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('editor');
  const [newUserOrg, setNewUserOrg] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Configuración de Canales Telegram & WhatsApp
  const [msgConfig, setMsgConfig] = useState<MessagingConfig>(getMessagingConfig());
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const canManageUsers = currentUser.role === 'super_admin' || currentUser.role === 'admin';

  const roleLabels: Record<UserRole, string> = {
    super_admin: 'Super Administrador',
    admin: 'Administrador',
    editor: 'Editor / Gestor',
    field_agent: 'Comunicador de Campo',
    citizen: 'Ciudadano / Visitante'
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    onAddUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      organization: newUserOrg.trim() || 'Colectivo CComuSoc'
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserOrg('');
    setShowAddUserModal(false);
  };

  const handleSaveChannels = (e: React.FormEvent) => {
    e.preventDefault();
    saveMessagingConfig(msgConfig);
    setTestResult('Configuración de Telegram y WhatsApp guardada exitosamente.');
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTestTelegram = async () => {
    setIsTesting(true);
    const testMsg = `🚨 <b>CCOMUSOC PRUEBA DE CONEXIÓN</b>\nCanal verificado exitosamente desde el panel territorial.\nFecha: ${new Date().toLocaleString()}`;
    const res = await sendTelegramNotification(testMsg, msgConfig);
    setIsTesting(false);
    setTestResult(res.message);
  };

  const handleTestWhatsApp = () => {
    const text = `🚨 *CCOMUSOC ALERTA TERRITORIAL DE PRUEBA*\nCanal de administración verificado.\nFecha: ${new Date().toLocaleString()}`;
    const url = generateWhatsAppLink(msgConfig.whatsappAdminPhone, text);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Encabezado del Panel */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0e98d6] mb-1">
            Gobernanza Territorial y Canales Comunitarios
          </div>
          <h1 className="font-anton text-3xl sm:text-4xl text-[#1a1a1a] dark:text-[#e0e0e0] leading-tight">
            PANEL DE ADMINISTRACIÓN Y CANALES DE ALERTA
          </h1>
          <p className="text-sm text-slate-600 dark:text-neutral-400 mt-1 max-w-2xl font-sans">
            Asignación de roles de administrador y editor, moderación de relatos orales/videos y canales de Telegram y WhatsApp de bajo consumo para alertas en territorio.
          </p>
        </div>

        {/* Pestañas de control */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f4f6f9] dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-neutral-800">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'users'
                ? 'bg-[#0e98d6] text-white shadow-xs'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
            }`}
          >
            Usuarios & Roles ({users.length})
          </button>
          <button
            onClick={() => setActiveSubTab('moderation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'moderation'
                ? 'bg-[#0e98d6] text-white shadow-xs'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
            }`}
          >
            Moderación ({testimonies.length})
          </button>
          <button
            onClick={() => setActiveSubTab('channels')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'channels'
                ? 'bg-[#e65c00] text-white shadow-xs'
                : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900'
            }`}
          >
            Telegram / WhatsApp
          </button>
        </div>
      </div>

      {/* Subtab 1: Usuarios & Roles */}
      {activeSubTab === 'users' && (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-anton text-xl text-[#1a1a1a] dark:text-[#e0e0e0]">
                EQUIPO Y ROLES AUTORIZADOS
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Control de acceso RBAC para garantizar la seguridad de la información territorial
              </p>
            </div>

            {canManageUsers && (
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#0e98d6] hover:bg-[#0b80b5] text-white rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Agregar Colaborador</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#f4f6f9] dark:bg-[#121212] text-slate-700 dark:text-neutral-300 font-semibold border-b border-slate-200 dark:border-neutral-700">
                <tr>
                  <th className="py-3 px-4">Usuario</th>
                  <th className="py-3 px-4">Correo Oficial</th>
                  <th className="py-3 px-4">Organización / Nodo</th>
                  <th className="py-3 px-4">Rol Asignado</th>
                  <th className="py-3 px-4">Acción de Asignación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800 text-slate-600 dark:text-neutral-400">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-[#121212]/50">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#0e98d6]/10 text-[#0e98d6] font-bold flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{user.email}</td>
                    <td className="py-3 px-4">{user.organization}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold ${
                        user.role === 'super_admin' ? 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300' :
                        user.role === 'admin' ? 'bg-blue-100 dark:bg-blue-950/50 text-[#0e98d6]' :
                        user.role === 'editor' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700' :
                        'bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300'
                      }`}>
                        {roleLabels[user.role]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {canManageUsers ? (
                        <select
                          value={user.role}
                          disabled={user.role === 'super_admin' && currentUser.role !== 'super_admin'}
                          onChange={(e) => onUpdateUserRole(user.id, e.target.value as UserRole)}
                          className="text-xs bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-md px-2 py-1 outline-none text-[#1a1a1a] dark:text-[#e0e0e0] cursor-pointer"
                        >
                          <option value="super_admin">Super Administrador</option>
                          <option value="admin">Administrador</option>
                          <option value="editor">Editor</option>
                          <option value="field_agent">Comunicador de Campo</option>
                          <option value="citizen">Ciudadano / Visitante</option>
                        </select>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Solo lectura</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Moderación */}
      {activeSubTab === 'moderation' && (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 shadow-xs">
          <div className="mb-6">
            <h2 className="font-anton text-xl text-[#1a1a1a] dark:text-[#e0e0e0]">
              BANDEJA DE VALIDACIÓN TERRITORIAL
            </h2>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Revisa y aprueba testimonios escritos, notas de voz de audio y videos de hasta 30s.
            </p>
          </div>

          <div className="space-y-4">
            {testimonies.map((t) => (
              <div 
                key={t.id} 
                className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#1a1a1a] dark:text-[#e0e0e0] text-sm">
                      {t.isAnonymous ? 'Testimonio Anónimo' : t.authorName}
                    </span>
                    <span className="text-[11px] text-slate-400">· {t.communityRole} ·</span>
                    <span className="text-[11px] text-[#0e98d6] font-medium">{t.neighborhood}</span>
                    <span className="text-amber-500 font-bold ml-1 text-xs">{'★'.repeat(t.rating)}</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-neutral-300 italic mb-1.5">
                    "{t.storyText}"
                  </p>

                  {/* Reproductor si tiene nota de voz */}
                  {t.mediaType === 'audio' && t.mediaUrl && (
                    <div className="my-2 flex items-center gap-2">
                      <Volume2 className="w-3.5 h-3.5 text-[#0e98d6]" />
                      <audio src={t.mediaUrl} controls className="h-7 w-60" />
                    </div>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Proyecto: <strong>{t.projectName}</strong></span>
                    {t.mediaType !== 'none' && (
                      <span className="text-[#0e98d6]">
                        Formato: {t.mediaType} {t.videoDurationSeconds ? `(${t.videoDurationSeconds}s)` : ''}
                      </span>
                    )}
                    <span>Fecha: {t.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onUpdateTestimonyStatus(t.id, 'destacado')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                      t.status === 'destacado'
                        ? 'bg-amber-500 text-white'
                        : 'bg-white dark:bg-[#1e1e1e] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Destacar</span>
                  </button>

                  <button
                    onClick={() => onUpdateTestimonyStatus(t.id, 'aprobado')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer ${
                      t.status === 'aprobado'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-[#1e1e1e] text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Aprobar</span>
                  </button>

                  <button
                    onClick={() => onDeleteTestimony(t.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    title="Eliminar testimonio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Canales Telegram y WhatsApp (Reemplazo de Push) */}
      {activeSubTab === 'channels' && (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-slate-200 dark:border-neutral-800 p-6 shadow-xs max-w-3xl">
          <div className="flex items-center gap-2.5 mb-3">
            <Send className="w-5 h-5 text-[#e65c00]" />
            <h2 className="font-anton text-2xl text-[#1a1a1a] dark:text-[#e0e0e0]">
              CANALES DE TELEGRAM Y WHATSAPP DE ADMINISTRACIÓN
            </h2>
          </div>

          <p className="text-xs text-slate-600 dark:text-neutral-400 mb-6 leading-relaxed">
            Reemplaza las notificaciones push pesadas por <strong>canales de Telegram y WhatsApp</strong>. Son ligeros, consumen casi cero batería y recursos de servidor, y permiten a los coordinadores territoriales recibir novedades en cualquier celular con baja conectividad.
          </p>

          <form onSubmit={handleSaveChannels} className="space-y-6">
            
            {/* Telegram Channel Config */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs text-[#0e98d6] flex items-center gap-1.5">
                  <Send className="w-4 h-4" />
                  <span>Canal o Bot de Telegram</span>
                </span>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={msgConfig.telegramEnabled}
                    onChange={(e) => setMsgConfig({ ...msgConfig, telegramEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#0e98d6] rounded"
                  />
                  <span>Activo</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
                    Canal o Chat ID:
                  </label>
                  <input
                    type="text"
                    placeholder="@canal_ccomusoc o -100123456789"
                    value={msgConfig.telegramChatId}
                    onChange={(e) => setMsgConfig({ ...msgConfig, telegramChatId: e.target.value })}
                    className="w-full text-xs p-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-700 rounded-lg font-mono text-[#1a1a1a] dark:text-[#e0e0e0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
                    Bot Token (Opcional para bot propio):
                  </label>
                  <input
                    type="password"
                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                    value={msgConfig.telegramBotToken}
                    onChange={(e) => setMsgConfig({ ...msgConfig, telegramBotToken: e.target.value })}
                    className="w-full text-xs p-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-700 rounded-lg font-mono text-[#1a1a1a] dark:text-[#e0e0e0]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestTelegram}
                disabled={isTesting}
                className="px-3 py-1.5 bg-[#0e98d6] hover:bg-[#0b80b5] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isTesting ? 'Enviando...' : 'Probar Envío a Telegram'}</span>
              </button>
            </div>

            {/* WhatsApp Admin Channel Config */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-neutral-800 bg-[#f4f6f9] dark:bg-[#121212]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span>Alertas por WhatsApp de Coordinación</span>
                </span>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={msgConfig.whatsappEnabled}
                    onChange={(e) => setMsgConfig({ ...msgConfig, whatsappEnabled: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>Activo</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
                    Número de WhatsApp Administrador (con código país):
                  </label>
                  <input
                    type="text"
                    placeholder="+5491123456789"
                    value={msgConfig.whatsappAdminPhone}
                    onChange={(e) => setMsgConfig({ ...msgConfig, whatsappAdminPhone: e.target.value })}
                    className="w-full text-xs p-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-700 rounded-lg font-mono text-[#1a1a1a] dark:text-[#e0e0e0]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-neutral-400 mb-1">
                    Nombre del Grupo Territorial:
                  </label>
                  <input
                    type="text"
                    placeholder="CComuSoc - Red de Alertas"
                    value={msgConfig.whatsappGroupName || ''}
                    onChange={(e) => setMsgConfig({ ...msgConfig, whatsappGroupName: e.target.value })}
                    className="w-full text-xs p-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestWhatsApp}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Mensaje de Prueba en WhatsApp</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-neutral-800">
              <span className="text-xs text-slate-500">
                Notificaciones automáticas ante cada nuevo punto sugerido o testimonio oral.
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#e65c00] hover:bg-[#cf5300] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Guardar Configuración de Canales
              </button>
            </div>

            {testResult && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{testResult}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Modal para Crear Usuario */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-2xl">
            <h3 className="font-anton text-xl text-[#1a1a1a] dark:text-[#e0e0e0] mb-4">
              NUEVO COLABORADOR TERRITORIAL
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">Organización / Colectivo:</label>
                <input
                  type="text"
                  value={newUserOrg}
                  onChange={(e) => setNewUserOrg(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">Rol de Acceso:</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full text-xs p-2.5 bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0]"
                >
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                  <option value="field_agent">Comunicador de Campo</option>
                  <option value="citizen">Ciudadano / Visitante</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0e98d6] text-white text-xs font-bold rounded-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
