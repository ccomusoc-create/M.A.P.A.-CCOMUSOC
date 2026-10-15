import React, { useState } from 'react';
import { X, MapPin, Layers, Radio, Users, Sparkles, Mail, Globe } from 'lucide-react';
import { SocialProject, ProjectCategory, ProjectStatus } from '../types';
import { CATEGORY_DETAILS } from '../data/initialData';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Omit<SocialProject, 'id' | 'updatedAt' | 'syncedWithSheet'>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('radios_comunitarias');
  const [status, setStatus] = useState<ProjectStatus>('activo');
  const [lat, setLat] = useState('-34.6037');
  const [lng, setLng] = useState('-58.3816');
  const [locationName, setLocationName] = useState('');
  const [province, setProvince] = useState('Buenos Aires');
  const [impactRadiusKm, setImpactRadiusKm] = useState('8.0');
  const [directBeneficiaries, setDirectBeneficiaries] = useState('1500');
  const [indirectBeneficiaries, setIndirectBeneficiaries] = useState('5000');
  const [organizationLeader, setOrganizationLeader] = useState('');
  const [contactEmail, setContactEmail] = useState('ccomusoc@gmail.com');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim()) {
      alert('Por favor completa el título y la localidad del proyecto.');
      return;
    }

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const radius = parseFloat(impactRadiusKm) || 5;
    const direct = parseInt(directBeneficiaries) || 100;
    const indirect = parseInt(indirectBeneficiaries) || 500;

    onAddProject({
      title: title.trim(),
      summary: summary.trim() || title.trim(),
      description: description.trim() || summary.trim(),
      category,
      status,
      coordinates: [parsedLat, parsedLng],
      locationName: locationName.trim(),
      province: province.trim(),
      country: 'Argentina',
      impactRadiusKm: radius,
      directBeneficiaries: direct,
      indirectBeneficiaries: indirect,
      startDate: new Date().toISOString().slice(0, 10),
      organizationLeader: organizationLeader.trim() || 'Colectivo Territorial CComuSoc',
      contactEmail: contactEmail.trim() || 'ccomusoc@gmail.com',
      odsGoals: [10, 11]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        <div className="bg-[#0e98d6] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-anton text-xl tracking-wide leading-none">
                REGISTRAR NUEVO PROYECTO SOCIAL
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                Geolocalización de intervenciones para el desarrollo
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombre o Título del Proyecto: *
            </label>
            <input
              type="text"
              required
              placeholder="ej. Centro Comunitario y Radio Popular El Ceibo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Eje Temático / Categoría:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6]"
              >
                {Object.entries(CATEGORY_DETAILS).map(([key, item]) => (
                  <option key={key} value={key}>{item.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estado de la Intervención:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6]"
              >
                <option value="activo">Activo y en marcha</option>
                <option value="en_ejecucion">En Ejecución Territorial</option>
                <option value="planificacion">Planificación / Diseño</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Localidad o Barrio: *
              </label>
              <input
                type="text"
                required
                placeholder="ej. Moreno, Cosquín, Tilcara..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Provincia / Región:
              </label>
              <input
                type="text"
                placeholder="ej. Buenos Aires, Córdoba, Jujuy..."
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Latitud GPS:
              </label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Longitud GPS:
              </label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Radio Impacto (km):
              </label>
              <input
                type="number"
                step="0.5"
                value={impactRadiusKm}
                onChange={(e) => setImpactRadiusKm(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Beneficiarios Directos:
              </label>
              <input
                type="number"
                value={directBeneficiaries}
                onChange={(e) => setDirectBeneficiaries(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Indirectos:
              </label>
              <input
                type="number"
                value={indirectBeneficiaries}
                onChange={(e) => setIndirectBeneficiaries(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descripción y Objetivos de la Intervención:
            </label>
            <textarea
              rows={3}
              placeholder="Describe las metas de comunicación, impacto comunitario y actores territoriales involucrados..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organización Responsable:
              </label>
              <input
                type="text"
                placeholder="ej. Colectivo de Comunicación Barrial"
                value={organizationLeader}
                onChange={(e) => setOrganizationLeader(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email de Contacto:
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 outline-none focus:border-[#0e98d6]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0e98d6] hover:bg-[#0b80b5] text-white text-xs font-bold rounded-lg shadow-sm shadow-[#0e98d6]/30 transition-all cursor-pointer"
            >
              Guardar y Publicar en Mapa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
