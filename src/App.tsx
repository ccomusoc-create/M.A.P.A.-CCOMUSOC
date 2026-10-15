import React, { useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_PROJECTS, 
  INITIAL_TESTIMONIES, 
  INITIAL_USERS 
} from './data/initialData';
import { 
  SocialProject, 
  CommunityTestimony, 
  UserProfile, 
  UserRole, 
  GoogleSheetConfig, 
  NotificationItem 
} from './types';
import { 
  getOfflineQueue, 
  addToOfflineQueue, 
  processOfflineQueue, 
  clearSyncedQueue 
} from './utils/offlineSync';
import { 
  syncToGoogleSheetsWebhook, 
  exportToCSV 
} from './utils/googleSheetsSync';
import { notifyCommunityEvent } from './utils/messagingChannels';

// Componentes
import { Header } from './components/Header';
import { InteractiveMap } from './components/InteractiveMap';
import { PublicImpactBoard } from './components/PublicImpactBoard';
import { ProjectsList } from './components/ProjectsList';
import { TestimoniesList } from './components/TestimoniesList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { GoogleSheetSyncPanel } from './components/GoogleSheetSyncPanel';
import { AdminUserPanel } from './components/AdminUserPanel';
import { Footer } from './components/Footer';

// Modales
import { TestimonyModal } from './components/TestimonyModal';
import { CrowdmappingModal } from './components/CrowdmappingModal';
import { NewProjectModal } from './components/NewProjectModal';
import { WordPressPluginModal } from './components/WordPressPluginModal';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';
import { UnitTestRunnerModal } from './components/UnitTestRunnerModal';
import { DevProfileModal } from './components/DevProfileModal';

const STORAGE_KEY_PROJECTS = 'ccomusoc_projects_v2';
const STORAGE_KEY_TESTIMONIES = 'ccomusoc_testimonies_v2';
const STORAGE_KEY_THEME = 'ccomusoc_dark_mode_v2';
const STORAGE_KEY_SHEET = 'ccomusoc_sheet_config_v2';

export default function App() {
  // Proyectos
  const [projects, setProjects] = useState<SocialProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Testimonios
  const [testimonies, setTestimonies] = useState<CommunityTestimony[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TESTIMONIES);
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIES;
    } catch {
      return INITIAL_TESTIMONIES;
    }
  });

  // Usuarios y Roles
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Super Admin

  // Navegación
  const [activeTab, setActiveTab] = useState<'map' | 'public_impact' | 'projects' | 'testimonies' | 'analytics' | 'sheets' | 'admin'>('map');
  const [selectedProject, setSelectedProject] = useState<SocialProject | null>(null);

  // Modo Oscuro (Fondo Blanco vs Negro Mate #121212)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Red y Sincronización Offline
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineQueue, setOfflineQueue] = useState(() => getOfflineQueue());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Configuración de Google Sheets
  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHEET);
      return saved ? JSON.parse(saved) : {
        webhookUrl: '',
        sheetId: 'CComuSoc_Territorial_2026',
        autoSyncEnabled: true,
        lastSyncTimestamp: null,
        syncedCount: 0,
        isSyncing: false
      };
    } catch {
      return {
        webhookUrl: '',
        sheetId: 'CComuSoc_Territorial_2026',
        autoSyncEnabled: true,
        lastSyncTimestamp: null,
        syncedCount: 0,
        isSyncing: false
      };
    }
  });

  // Notificaciones de Eventos
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Sistema en funcionamiento',
      message: 'Base de datos territorial lista y vinculada a ccomusoc.com.ar',
      timestamp: new Date().toISOString(),
      read: false,
      level: 'info'
    }
  ]);

  // Estados de Modales
  const [isTestimonyModalOpen, setIsTestimonyModalOpen] = useState(false);
  const [testimonyTargetProject, setTestimonyTargetProject] = useState<SocialProject | null>(null);
  const [isCrowdmappingModalOpen, setIsCrowdmappingModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isWordPressModalOpen, setIsWordPressModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isUnitTestsModalOpen, setIsUnitTestsModalOpen] = useState(false);
  const [isDevProfileModalOpen, setIsDevProfileModalOpen] = useState(false);

  // Persistencia de datos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('Error al guardar proyectos:', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TESTIMONIES, JSON.stringify(testimonies));
    } catch (e) {
      console.warn('Error al guardar testimonios:', e);
    }
  }, [testimonies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SHEET, JSON.stringify(sheetConfig));
    } catch (e) {
      console.warn('Error al guardar sheetConfig:', e);
    }
  }, [sheetConfig]);

  // Aplicar tema en el elemento raíz HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Manejo de eventos online/offline con sincronización automática
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerBackgroundSync();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Función de sincronización en segundo plano
  const triggerBackgroundSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      await processOfflineQueue(async (item) => {
        // Enviar al webhook de Google Sheets si está configurado
        if (sheetConfig.webhookUrl) {
          const res = await syncToGoogleSheetsWebhook(sheetConfig.webhookUrl, 'batch_sync', item.payload);
          return res.success;
        }
        return true;
      });

      setOfflineQueue(getOfflineQueue());
      setSheetConfig(prev => ({
        ...prev,
        lastSyncTimestamp: new Date().toISOString(),
        syncedCount: prev.syncedCount + 1
      }));

      // Agregar notificación de sincronización
      setNotifications(prev => [
        {
          id: `sync-${Date.now()}`,
          title: 'Sincronización Exitosa',
          message: 'Los datos territoriales se sincronizaron con Google Sheets.',
          timestamp: new Date().toISOString(),
          read: false,
          level: 'success'
        },
        ...prev
      ]);

    } catch (err) {
      console.error('Error en sincronización automática:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [sheetConfig.webhookUrl, isSyncing]);

  // Agregar Nuevo Testimonio (Oral, Foto o Texto)
  const handleAddTestimony = async (newTestimonyData: Omit<CommunityTestimony, 'id' | 'status' | 'date'>) => {
    const newTestimony: CommunityTestimony = {
      ...newTestimonyData,
      id: `test-${Date.now()}`,
      status: 'aprobado',
      date: new Date().toISOString().slice(0, 10),
      syncedWithSheet: isOnline
    };

    setTestimonies(prev => [newTestimony, ...prev]);

    // Enviar notificación a Telegram y WhatsApp de administración
    notifyCommunityEvent(
      'nuevo_testimonio',
      newTestimony.projectName,
      newTestimony.neighborhood,
      `De: ${newTestimony.authorName} (${newTestimony.communityRole}) - "${newTestimony.quoteHighlight}"`
    );

    // Si está offline o habilitado Google Sheets
    if (!isOnline) {
      addToOfflineQueue({
        type: 'new_testimony',
        payload: newTestimony
      });
      setOfflineQueue(getOfflineQueue());
    } else if (sheetConfig.autoSyncEnabled && sheetConfig.webhookUrl) {
      syncToGoogleSheetsWebhook(sheetConfig.webhookUrl, 'testimony', newTestimony);
    }

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Nuevo Testimonio Comunitario',
        message: `${newTestimony.authorName} compartió su experiencia en ${newTestimony.neighborhood}`,
        timestamp: new Date().toISOString(),
        read: false,
        level: 'info'
      },
      ...prev
    ]);
  };

  // Mapeo Participativo: Sugerir Punto Comunitario por Vecinos
  const handleCrowdmappingSuggestion = async (suggestion: Omit<SocialProject, 'id' | 'updatedAt' | 'syncedWithSheet'>) => {
    const newProject: SocialProject = {
      ...suggestion,
      id: `proj-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10),
      syncedWithSheet: isOnline
    };

    setProjects(prev => [newProject, ...prev]);

    // Alerta prioritaria a Telegram / WhatsApp de Coordinación
    notifyCommunityEvent(
      'punto_sugerido',
      newProject.title,
      `${newProject.locationName}, ${newProject.province}`,
      `Sugerido por: ${newProject.organizationLeader}. Requiere validación territorial.`
    );

    if (!isOnline) {
      addToOfflineQueue({
        type: 'new_project',
        payload: newProject
      });
      setOfflineQueue(getOfflineQueue());
    } else if (sheetConfig.autoSyncEnabled && sheetConfig.webhookUrl) {
      syncToGoogleSheetsWebhook(sheetConfig.webhookUrl, 'project', newProject);
    }

    setNotifications(prev => [
      {
        id: `crowd-${Date.now()}`,
        title: 'Punto Sugerido por la Vecindad',
        message: `Se reportó una iniciativa en ${newProject.locationName}: "${newProject.title}"`,
        timestamp: new Date().toISOString(),
        read: false,
        level: 'warning'
      },
      ...prev
    ]);
  };

  // Agregar Nuevo Proyecto Oficial por Editor/Admin
  const handleAddProject = (projectData: Omit<SocialProject, 'id' | 'updatedAt' | 'syncedWithSheet'>) => {
    const project: SocialProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10),
      syncedWithSheet: isOnline
    };

    setProjects(prev => [project, ...prev]);

    if (!isOnline) {
      addToOfflineQueue({
        type: 'new_project',
        payload: project
      });
      setOfflineQueue(getOfflineQueue());
    } else if (sheetConfig.autoSyncEnabled && sheetConfig.webhookUrl) {
      syncToGoogleSheetsWebhook(sheetConfig.webhookUrl, 'project', project);
    }
  };

  // Moderación de Testimonios
  const handleUpdateTestimonyStatus = (testimonyId: string, status: 'aprobado' | 'destacado' | 'pendiente') => {
    setTestimonies(prev => prev.map(t => t.id === testimonyId ? { ...t, status } : t));
  };

  const handleDeleteTestimony = (testimonyId: string) => {
    if (confirm('¿Deseas eliminar este testimonio?')) {
      setTestimonies(prev => prev.filter(t => t.id !== testimonyId));
    }
  };

  // RBAC: Asignación de Roles
  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
  };

  const handleAddUser = (newUserData: Omit<UserProfile, 'id' | 'activeSince'>) => {
    const newUser: UserProfile = {
      ...newUserData,
      id: `user-${Date.now()}`,
      activeSince: new Date().toISOString().slice(0, 10)
    };
    setUsers(prev => [...prev, newUser]);
  };

  const canCreateProject = currentUser.role === 'super_admin' || currentUser.role === 'admin' || currentUser.role === 'editor';

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a1a1a] dark:bg-[#121212] dark:text-[#e0e0e0] font-sans antialiased transition-colors">
      
      {/* Barra de Navegación y Encabezado Superior */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOnline={isOnline}
        offlineQueueCount={offlineQueue.filter(i => i.status === 'pending').length}
        isSyncing={isSyncing}
        onManualSync={triggerBackgroundSync}
        currentUser={currentUser}
        availableUsers={users}
        onSwitchUser={setCurrentUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        notifications={notifications}
        onMarkNotificationsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onOpenTestimonyModal={() => {
          setTestimonyTargetProject(null);
          setIsTestimonyModalOpen(true);
        }}
        onOpenCrowdmapping={() => setIsCrowdmappingModalOpen(true)}
        onOpenWordPressModal={() => setIsWordPressModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenUnitTests={() => setIsUnitTestsModalOpen(true)}
        onOpenDevProfile={() => setIsDevProfileModalOpen(true)}
      />

      {/* Vistas Principales según Tab */}
      <main className="flex-1">
        {activeTab === 'map' && (
          <InteractiveMap
            projects={projects}
            testimonies={testimonies}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onOpenTestimonyForProject={(p) => {
              setTestimonyTargetProject(p);
              setIsTestimonyModalOpen(true);
            }}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            canCreateProject={canCreateProject}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'public_impact' && (
          <PublicImpactBoard
            projects={projects}
            testimonies={testimonies}
            onOpenCrowdmapping={() => setIsCrowdmappingModalOpen(true)}
            onOpenTestimony={() => {
              setTestimonyTargetProject(null);
              setIsTestimonyModalOpen(true);
            }}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsList
            projects={projects}
            onSelectProjectOnMap={(p) => {
              setSelectedProject(p);
              setActiveTab('map');
            }}
            onOpenTestimonyForProject={(p) => {
              setTestimonyTargetProject(p);
              setIsTestimonyModalOpen(true);
            }}
            onOpenNewProject={() => setIsNewProjectModalOpen(true)}
            onOpenCrowdmapping={() => setIsCrowdmappingModalOpen(true)}
            canCreateProject={canCreateProject}
          />
        )}

        {activeTab === 'testimonies' && (
          <TestimoniesList
            testimonies={testimonies}
            onOpenNewTestimony={() => {
              setTestimonyTargetProject(null);
              setIsTestimonyModalOpen(true);
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            projects={projects}
            testimonies={testimonies}
            onExportCSV={() => exportToCSV(projects, testimonies, 'all')}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'sheets' && (
          <GoogleSheetSyncPanel
            config={sheetConfig}
            onUpdateConfig={(newConf) => setSheetConfig(prev => ({ ...prev, ...newConf }))}
            onTriggerSync={triggerBackgroundSync}
            projects={projects}
            testimonies={testimonies}
          />
        )}

        {activeTab === 'admin' && (
          <AdminUserPanel
            currentUser={currentUser}
            users={users}
            onUpdateUserRole={handleUpdateUserRole}
            onAddUser={handleAddUser}
            testimonies={testimonies}
            onUpdateTestimonyStatus={handleUpdateTestimonyStatus}
            onDeleteTestimony={handleDeleteTestimony}
          />
        )}
      </main>

      {/* Pie de Página */}
      <Footer
        onOpenDevProfile={() => setIsDevProfileModalOpen(true)}
      />

      {/* Modales y Flujos de Acción */}
      <TestimonyModal
        isOpen={isTestimonyModalOpen}
        onClose={() => setIsTestimonyModalOpen(false)}
        projects={projects}
        defaultProject={testimonyTargetProject}
        onSubmitTestimony={handleAddTestimony}
        isOnline={isOnline}
      />

      <CrowdmappingModal
        isOpen={isCrowdmappingModalOpen}
        onClose={() => setIsCrowdmappingModalOpen(false)}
        onSubmitSuggestion={handleCrowdmappingSuggestion}
        isOnline={isOnline}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onAddProject={handleAddProject}
      />

      <WordPressPluginModal
        isOpen={isWordPressModalOpen}
        onClose={() => setIsWordPressModalOpen(false)}
      />

      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        projects={projects}
        testimonies={testimonies}
      />

      <UnitTestRunnerModal
        isOpen={isUnitTestsModalOpen}
        onClose={() => setIsUnitTestsModalOpen(false)}
      />

      <DevProfileModal
        isOpen={isDevProfileModalOpen}
        onClose={() => setIsDevProfileModalOpen(false)}
      />

    </div>
  );
}
