import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  HeartHandshake, 
  Crosshair, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Send
} from 'lucide-react';
import { ProjectCategory, SocialProject } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';

interface CrowdmappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuggestion: (suggestion: Omit<SocialProject, 'id' | 'updatedAt' | 'syncedWithSheet'>) => void;
  isOnline: boolean;
}

export const CrowdmappingModal: React.FC<CrowdmappingModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuggestion,
  isOnline
}) => {
  const [initiativeName, setInitiativeName] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('soberania_alimentaria');
  const [neighborhood, setNeighborhood] = useState('');
  const [province, setProvince] = useState('');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhoneOrEmail, setContactPhoneOrEmail] = useState('');
  const [coords, setCoords] = useState<[number, number]>([-34.6037, -58.3816]);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Error GPS:', err);
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!initiativeName.trim() || !neighborhood.trim()) {
      alert('Por favor completa el nombre de la iniciativa y el barrio.');
      return;
    }

    onSubmitSuggestion({
      title: initiativeName.trim(),
      summary: `Iniciativa sugerida por vecinos: ${description.slice(0, 100)}`,
      description: description.trim() || `Punto de apoyo comunitario propuesto en ${neighborhood}.`,
      category,
      status: 'planificacion',
      coordinates: coords,
      locationName: neighborhood.trim(),
      province: province.trim() || 'Territorio Local',
      country: 'Argentina',
      impactRadiusKm: 3.0,
      directBeneficiaries: 150,
      indirectBeneficiaries: 600,
      startDate: new Date().toISOString().slice(0, 10),
      organizationLeader: contactPerson.trim() || 'Vecindad Organizada',
      contactEmail: contactPhoneOrEmail.trim() || 'ccomusoc@gmail.com',
      odsGoals: [2, 10]
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden my-6">
        
        {/* Cabecera con Naranja de Acento #e65c00 */}
        <div className="bg-[#e65c00] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-anton text-xl tracking-wide leading-none">
                MAPEO PARTICIPATIVO COMUNITARIO
              </h2>
              <p className="text-xs text-white/90 mt-0.5">
                Sugiere una huerta, comedor, radio o iniciativa de tu barrio
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-anton text-slate-900 dark:text-white mb-2">
              ¡INICIATIVA COMUNITARIA ENVIADA!
            </h3>
            <p className="text-sm text-slate-600 dark:text-neutral-300 max-w-md mx-auto">
              Gracias por sumar tu territorio. Los coordinadores de CComuSoc recibirán la alerta en Telegram / WhatsApp para verificarla y sumarla al mapa oficial.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            <div className="p-3 bg-[#e65c00]/10 border border-[#e65c00]/30 rounded-xl text-xs text-[#1a1a1a] dark:text-[#e0e0e0]">
              <strong>Mapeo Popular:</strong> Cualquier vecina, vecino o colectivo puede georreferenciar una iniciativa solidaria o comunicacional. Tras una breve revisión de moderación, aparecerá visible en el mapa para toda la comunidad.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Nombre del Comedor, Huerta, Radio o Iniciativa: *
              </label>
              <input
                type="text"
                required
                placeholder="ej. Comedor Los Pibes del Ceibo / Huerta Comunitaria Sol de Mayo"
                value={initiativeName}
                onChange={(e) => setInitiativeName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#e65c00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Tipo de Espacio / Categoría:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full text-xs p-2.5 rounded-lg bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#e65c00]"
              >
                {Object.entries(CATEGORY_DETAILS).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Barrio o Paraje: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Barrio La Tablada"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#e65c00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Provincia / Ciudad:
                </label>
                <input
                  type="text"
                  placeholder="ej. Santa Fe / Rosario"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#e65c00]"
                />
              </div>
            </div>

            {/* Captura de Coordenadas GPS */}
            <div className="p-3 bg-slate-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#e65c00]" />
                  <span>Geolocalización del Punto</span>
                </span>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="text-xs text-[#0e98d6] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Obteniendo GPS...' : 'Usar mi ubicación GPS'}</span>
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-neutral-400">
                Coordenadas: Lat: {coords[0].toFixed(4)}, Lng: {coords[1].toFixed(4)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                ¿Qué actividades o apoyo realizan?
              </label>
              <textarea
                rows={3}
                placeholder="ej. Asistimos a 80 familias los martes y jueves, tenemos taller de apoyo escolar y una radio comunitaria los fines de semana..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#e65c00]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Nombre o Referente de Contacto:
                </label>
                <input
                  type="text"
                  placeholder="ej. Mariela / Colectivo Vecinal"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#e65c00]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Teléfono / WhatsApp de Contacto:
                </label>
                <input
                  type="text"
                  placeholder="ej. +54 9 11 1234-5678"
                  value={contactPhoneOrEmail}
                  onChange={(e) => setContactPhoneOrEmail(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#e65c00]"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#e65c00] hover:bg-[#cf5300] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Sugerencia para Moderación</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
