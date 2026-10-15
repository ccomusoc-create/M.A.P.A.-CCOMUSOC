import React, { useState } from 'react';
import { 
  MapPin, 
  BarChart3, 
  FileText, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Sun, 
  Moon, 
  Bell, 
  RefreshCw, 
  Layers, 
  Share2, 
  MessageSquare,
  CheckCircle2,
  Code2,
  HeartHandshake,
  Send,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserRole, NotificationItem } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'map' | 'public_impact' | 'projects' | 'testimonies' | 'analytics' | 'sheets' | 'admin';
  setActiveTab: (tab: 'map' | 'public_impact' | 'projects' | 'testimonies' | 'analytics' | 'sheets' | 'admin') => void;
  isOnline: boolean;
  offlineQueueCount: number;
  isSyncing: boolean;
  onManualSync: () => void;
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  onSwitchUser: (user: UserProfile) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  onOpenTestimonyModal: () => void;
  onOpenCrowdmapping: () => void;
  onOpenWordPressModal: () => void;
  onOpenReportModal: () => void;
  onOpenUnitTests: () => void;
  onOpenDevProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
  offlineQueueCount,
  isSyncing,
  onManualSync,
  currentUser,
  availableUsers,
  onSwitchUser,
  isDarkMode,
  onToggleDarkMode,
  notifications,
  onMarkNotificationsRead,
  onOpenTestimonyModal,
  onOpenCrowdmapping,
  onOpenWordPressModal,
  onOpenReportModal,
  onOpenUnitTests,
  onOpenDevProfile
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, string> = {
    super_admin: 'Super Administrador',
    admin: 'Administrador',
    editor: 'Editor / Gestor',
    field_agent: 'Comunicador de Campo',
    citizen: 'Ciudadano / Vecina'
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 transition-colors">
      {/* Barra de Notificación y Estado de Red Superior */}
      <div className="bg-[#f4f6f9] dark:bg-[#1e1e1e] px-4 py-1.5 text-xs border-b border-slate-200/60 dark:border-neutral-800/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Indicador Online/Offline */}
            <div 
              className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded text-[11px] ${
                isOnline 
                  ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' 
                  : 'text-amber-800 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300'
              }`}
              title={isOnline ? 'Conexión activa con el servidor' : 'Modo offline activado. Los datos se guardan en el dispositivo.'}
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3 animate-pulse" />}
              <span>{isOnline ? 'En línea' : 'Sin conexión (Modo Offline PWA)'}</span>
            </div>

            {offlineQueueCount > 0 && (
              <button 
                onClick={onManualSync}
                disabled={isSyncing || !isOnline}
                className="flex items-center gap-1 text-[11px] text-[#0e98d6] hover:underline font-semibold cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{offlineQueueCount} en cola local (Sincronizar)</span>
              </button>
            )}

            <span className="hidden sm:inline text-slate-400 dark:text-neutral-600">|</span>
            <span className="hidden sm:inline text-slate-500 dark:text-neutral-400 text-[11px]">
              Portal: <a href="https://ccomusoc.com.ar" target="_blank" rel="noreferrer" className="text-[#0e98d6] hover:underline font-semibold">ccomusoc.com.ar</a>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PWAInstallButton />

            <button
              onClick={onOpenUnitTests}
              className="text-[11px] text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6] flex items-center gap-1 font-medium transition-colors"
              title="Ejecutar pruebas unitarias del sistema"
            >
              <Code2 className="w-3 h-3" />
              <span className="hidden md:inline">Pruebas</span>
            </button>
            <span className="text-slate-300 dark:text-neutral-700">·</span>
            <button
              onClick={onOpenWordPressModal}
              className="text-[11px] text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6] flex items-center gap-1 font-medium transition-colors"
            >
              <Share2 className="w-3 h-3" />
              <span>Plugin WP</span>
            </button>
            <span className="text-slate-300 dark:text-neutral-700">·</span>
            <button
              onClick={onOpenDevProfile}
              className="text-[11px] text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6] font-medium"
            >
              Equipo & Código Abierto
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar Principal (Contrato de 3 Zonas) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-6">
        
        {/* Zona 1: Marca con tipografía oficial Anton y color #0e98d6 */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('map')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0e98d6] flex items-center justify-center text-white shadow-sm shadow-[#0e98d6]/30">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-anton tracking-wide text-[#1a1a1a] dark:text-[#e0e0e0] leading-none block">
                CCOMUSOC
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#0e98d6] block -mt-0.5">
                Comunicación para el Desarrollo
              </span>
            </div>
          </button>
        </div>

        {/* Zona 2: Navegación de Enlaces Limpios */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-[#0e98d6] text-white'
                : 'text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Mapa Territorial</span>
          </button>

          <button
            onClick={() => setActiveTab('public_impact')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'public_impact'
                ? 'bg-[#0e98d6] text-white'
                : 'text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6]'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#e65c00]" />
            <span>Tablero Abierto</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'bg-[#0e98d6] text-white'
                : 'text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Proyectos</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonies')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'testimonies'
                ? 'bg-[#0e98d6] text-white'
                : 'text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Testimonios</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-[#0e98d6] text-white'
                : 'text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analítica</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'sheets'
                ? 'bg-[#0e98d6] text-white'
                : 'text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Google Sheets</span>
          </button>

          {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'editor') && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-[#0e98d6] text-white'
                  : 'text-slate-600 dark:text-neutral-300 hover:text-[#0e98d6]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gestión</span>
            </button>
          )}
        </nav>

        {/* Zona 3: Acciones, Modo Oscuro y CTA con Acento #e65c00 */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Alternar Modo Oscuro / Claro */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-500 dark:text-neutral-400 hover:bg-[#f4f6f9] dark:hover:bg-[#1e1e1e] transition-colors cursor-pointer"
            title={isDarkMode ? 'Cambiar a fondo blanco (#ffffff)' : 'Cambiar a negro mate (#121212)'}
            aria-label="Cambiar tema de color"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Selector de Usuario / Rol RBAC */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-[#f4f6f9] dark:bg-[#1e1e1e] text-xs text-[#1a1a1a] dark:text-[#e0e0e0] hover:border-[#0e98d6] transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#0e98d6]" />
              <span className="font-semibold max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
              <span className="text-[10px] text-slate-400">({roleLabels[currentUser.role].split(' ')[0]})</span>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-800 rounded-xl shadow-xl p-2 z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Cambiar Rol de Sesión
                </div>
                {availableUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSwitchUser(user);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentUser.id === user.id
                        ? 'bg-[#0e98d6]/10 text-[#0e98d6] font-semibold'
                        : 'text-slate-700 dark:text-neutral-300 hover:bg-slate-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-[10px] text-slate-400">{roleLabels[user.role]}</div>
                    </div>
                    {currentUser.id === user.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#0e98d6]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botón Mapeo Participativo: Sugerir Punto */}
          <button
            onClick={onOpenCrowdmapping}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#e65c00] bg-[#e65c00]/10 hover:bg-[#e65c00]/20 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Sugerir una huerta, comedor o iniciativa vecinal"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Sugerir Punto</span>
          </button>

          {/* Botón CTA Primario: Añadir Testimonio Aquí con color de acento #e65c00 */}
          <button
            onClick={onOpenTestimonyModal}
            className="px-4 py-2 text-xs font-bold text-white bg-[#e65c00] hover:bg-[#cf5300] rounded-lg shadow-sm transition-all transform active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Añadir Testimonio Aquí</span>
          </button>
        </div>
      </div>

      {/* Navegación móvil horizontal en pantallas pequeñas */}
      <div className="xl:hidden flex items-center gap-2 px-4 py-1.5 overflow-x-auto border-t border-slate-100 dark:border-neutral-800 scrollbar-none text-xs">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'map' ? 'bg-[#0e98d6] text-white font-bold' : 'text-slate-600 dark:text-neutral-300'}`}
        >
          Mapa
        </button>
        <button
          onClick={() => setActiveTab('public_impact')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'public_impact' ? 'bg-[#0e98d6] text-white font-bold' : 'text-slate-600 dark:text-neutral-300'}`}
        >
          Tablero Abierto
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'projects' ? 'bg-[#0e98d6] text-white font-bold' : 'text-slate-600 dark:text-neutral-300'}`}
        >
          Proyectos
        </button>
        <button
          onClick={() => setActiveTab('testimonies')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'testimonies' ? 'bg-[#0e98d6] text-white font-bold' : 'text-slate-600 dark:text-neutral-300'}`}
        >
          Testimonios
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'analytics' ? 'bg-[#0e98d6] text-white font-bold' : 'text-slate-600 dark:text-neutral-300'}`}
        >
          Analítica
        </button>
        <button
          onClick={() => setActiveTab('sheets')}
          className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'sheets' ? 'bg-[#0e98d6] text-white font-bold' : 'text-slate-600 dark:text-neutral-300'}`}
        >
          Google Sheets
        </button>
        {(currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'editor') && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${activeTab === 'admin' ? 'bg-[#0e98d6] text-white font-bold' : 'text-slate-600 dark:text-neutral-300'}`}
          >
            Gestión
          </button>
        )}
      </div>
    </header>
  );
};
