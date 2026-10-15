import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  Mic, 
  Square, 
  Play, 
  RotateCcw, 
  Camera, 
  MapPin, 
  Star, 
  AlertCircle, 
  CheckCircle2, 
  Mail, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { SocialProject, CommunityTestimony, MediaType } from '../types';

interface TestimonyModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: SocialProject[];
  defaultProject?: SocialProject | null;
  onSubmitTestimony: (testimony: Omit<CommunityTestimony, 'id' | 'status' | 'date'>) => void;
  isOnline: boolean;
}

export const TestimonyModal: React.FC<TestimonyModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultProject,
  onSubmitTestimony,
  isOnline
}) => {
  const [projectId, setProjectId] = useState<string>(defaultProject ? defaultProject.id : (projects[0]?.id || ''));
  const [authorName, setAuthorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [communityRole, setCommunityRole] = useState<string>('Vecina / Vecino');
  const [neighborhood, setNeighborhood] = useState<string>(defaultProject ? `${defaultProject.locationName}, ${defaultProject.province}` : '');
  const [rating, setRating] = useState<number>(5);
  const [storyText, setStoryText] = useState<string>('');
  const [quoteHighlight, setQuoteHighlight] = useState<string>('');
  
  // Manejo de Multimedia (Audio nativo, Foto, Video <= 30s)
  const [mediaType, setMediaType] = useState<MediaType>('none');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [videoExceededError, setVideoExceededError] = useState<boolean>(false);
  
  // Grabador de Audio Nativo (Oralidad comunitaria)
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Iniciar Grabación de Nota de Voz
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setMediaType('audio');
        setMediaPreviewUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingAudio(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 60) {
            stopRecordingAudio();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      alert('No se pudo acceder al micrófono. Por favor permite los permisos en tu navegador.');
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const resetRecording = () => {
    setRecordedAudioUrl(null);
    setRecordingSeconds(0);
    if (mediaType === 'audio') {
      setMediaType('none');
      setMediaPreviewUrl(null);
    }
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoExceededError(false);
    setMediaFile(file);

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (isVideo) {
      setMediaType('video');
      const url = URL.createObjectURL(file);
      setMediaPreviewUrl(url);

      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        const dur = Math.round(tempVideo.duration);
        setVideoDuration(dur);
        if (dur > 30) {
          setVideoExceededError(true);
        } else {
          setVideoExceededError(false);
        }
      };
    } else if (isImage) {
      setMediaType('photo');
      const url = URL.createObjectURL(file);
      setMediaPreviewUrl(url);
      setVideoDuration(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mediaType === 'video' && videoDuration && videoDuration > 30) {
      setVideoExceededError(true);
      return;
    }

    if (!storyText.trim() && !recordedAudioUrl) {
      alert('Por favor comparte un relato por escrito o graba una nota de voz.');
      return;
    }

    setIsSubmitting(true);

    const selectedProj = projects.find(p => p.id === projectId);
    const projectName = selectedProj ? selectedProj.title : 'Intervención Social Comunitaria';

    const newTestimony: Omit<CommunityTestimony, 'id' | 'status' | 'date'> = {
      projectId,
      projectName,
      authorName: isAnonymous ? 'Vecina / Ciudadano' : (authorName.trim() || 'Participante Territorial'),
      isAnonymous,
      communityRole: communityRole.trim() || 'Vecina del barrio',
      neighborhood: neighborhood.trim() || (selectedProj ? selectedProj.locationName : 'Territorio Local'),
      coordinates: selectedProj ? selectedProj.coordinates : [-34.6037, -58.3816],
      rating,
      storyText: storyText.trim() || (recordedAudioUrl ? '[Nota de voz comunitaria grabada]' : 'Testimonio registrado'),
      quoteHighlight: quoteHighlight.trim() || (storyText.length > 80 ? `"${storyText.slice(0, 80)}..."` : storyText),
      mediaType: recordedAudioUrl ? 'audio' : mediaType,
      mediaUrl: recordedAudioUrl || mediaPreviewUrl || undefined,
      videoDurationSeconds: videoDuration || undefined,
      offlineQueued: !isOnline
    };

    onSubmitTestimony(newTestimony);

    setSuccessMessage(
      isOnline
        ? '¡Gracias por sumar tu voz a CComuSoc! Testimonio registrado y notificado al equipo territorial.'
        : '¡Testimonio guardado sin señal! La PWA lo sincronizará apenas recuperes conexión.'
    );

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden my-6">
        
        {/* Cabecera con Botón de Acción Naranja #e65c00 */}
        <div className="bg-[#0e98d6] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-anton text-xl tracking-wide leading-none">
                RECOGER TESTIMONIO COMUNITARIO
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                Oralidad, fotos o texto · CComuSoc (ccomusoc.com.ar)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mensaje de Éxito */}
        {successMessage ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-anton text-slate-900 dark:text-white mb-2">
              ¡TESTIMONIO REGISTRADO!
            </h3>
            <p className="text-sm text-slate-600 dark:text-neutral-300 max-w-md mx-auto">
              {successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            
            {/* Aviso de Modo Offline si aplica */}
            {!isOnline && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Estás sin conexión. El audio y testimonio se guardarán en tu teléfono y se enviarán automáticamente con señal.</span>
              </div>
            )}

            {/* SECCIÓN 1: Grabación de Nota de Voz (Oralidad Comunitaria) */}
            <div className="p-4 rounded-xl border border-dashed border-[#0e98d6]/50 bg-[#0e98d6]/5 dark:bg-[#0e98d6]/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0e98d6] flex items-center gap-1.5">
                  <Mic className="w-4 h-4" />
                  <span>Grabar Nota de Voz (Oralidad Comunitaria)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-neutral-400">Para facilitar a quienes prefieren hablar</span>
              </div>

              {!recordedAudioUrl ? (
                <div className="flex items-center gap-3">
                  {!isRecordingAudio ? (
                    <button
                      type="button"
                      onClick={startRecordingAudio}
                      className="px-4 py-2.5 bg-[#e65c00] hover:bg-[#cf5300] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Grabar Mi Relato</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 w-full">
                      <button
                        type="button"
                        onClick={stopRecordingAudio}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 animate-pulse cursor-pointer"
                      >
                        <Square className="w-4 h-4" />
                        <span>Detener ({recordingSeconds}s)</span>
                      </button>

                      {/* Visualizador de ondas */}
                      <div className="flex items-center gap-1 h-6 flex-1 px-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                        {[1, 2, 3, 4, 5, 6, 8, 5, 3, 7, 4, 2].map((val, i) => (
                          <div 
                            key={i} 
                            style={{ height: `${val * 3}px`, animationDelay: `${i * 0.1}s` }} 
                            className="w-1.5 bg-red-500 rounded-full recording-bar"
                          />
                        ))}
                        <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 ml-auto">
                          00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-white dark:bg-[#121212] p-2.5 rounded-lg border border-slate-200 dark:border-neutral-700">
                  <Volume2 className="w-4 h-4 text-[#0e98d6]" />
                  <audio src={recordedAudioUrl} controls className="h-8 flex-1" />
                  <button
                    type="button"
                    onClick={resetRecording}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-md"
                    title="Volver a grabar"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Proyecto Social Vinculado */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Proyecto Comunitario Vinculado:
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#0e98d6]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.locationName}, {p.province})
                  </option>
                ))}
              </select>
            </div>

            {/* Datos del Participante */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Tu Nombre o Apodo:
                </label>
                <input
                  type="text"
                  placeholder="ej. Doña Rosa, Pedro..."
                  disabled={isAnonymous}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className={`w-full text-xs p-2.5 bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#0e98d6] ${isAnonymous ? 'opacity-50' : ''}`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Rol en la Comunidad:
                </label>
                <input
                  type="text"
                  placeholder="ej. Vecina, Comunicador, Promotora..."
                  value={communityRole}
                  onChange={(e) => setCommunityRole(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#0e98d6]"
                />
              </div>
            </div>

            {/* Anonimato */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous-check"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 accent-[#e65c00] rounded"
              />
              <label htmlFor="anonymous-check" className="text-xs text-slate-600 dark:text-neutral-400 cursor-pointer">
                Prefiero mantener mi testimonio anónimo (protección comunitaria)
              </label>
            </div>

            {/* Barrio / Localidad */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Barrio o Paraje:
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="ej. Barrio Esperanza, Moreno, Buenos Aires..."
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full text-xs pl-8 p-2.5 bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#0e98d6]"
                />
              </div>
            </div>

            {/* Percepción de Impacto (Estrellas 1 a 5) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                ¿Cómo valoras el impacto de esta iniciativa en tu comunidad?
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 dark:text-neutral-400 ml-2">
                  {rating === 5 ? 'Excelente impacto' : rating === 4 ? 'Muy positivo' : rating === 3 ? 'Moderado' : 'Bajo'}
                </span>
              </div>
            </div>

            {/* Relato Escrito (Opcional si grabó audio) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                Relato Escrito {recordedAudioUrl ? '(Opcional ya que grabaste audio)' : '(O escribe aquí)'}:
              </label>
              <textarea
                rows={3}
                placeholder="¿Qué cambió en tu vida cotidiana o en el barrio a partir de esta intervención social? ¿Qué necesidades siguen pendientes?"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#f4f6f9] dark:bg-[#121212] border border-slate-200 dark:border-neutral-700 rounded-lg text-[#1a1a1a] dark:text-[#e0e0e0] outline-none focus:border-[#0e98d6]"
              />
            </div>

            {/* Subir Fotos o Video hasta 30s */}
            <div className="border border-dashed border-slate-300 dark:border-neutral-700 rounded-xl p-4 bg-[#f4f6f9] dark:bg-[#121212]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#0e98d6]" />
                  <span>Foto o Video Corto desde el Celular (máx. 30 segundos)</span>
                </span>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-neutral-700 rounded-lg text-xs font-medium text-slate-700 dark:text-neutral-200 hover:border-[#0e98d6] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#0e98d6]" />
                  <span>Subir Foto / Video</span>
                </button>

                {mediaPreviewUrl && mediaType !== 'audio' && (
                  <span className="text-xs text-slate-500 truncate max-w-[200px]">
                    {mediaFile?.name} {videoDuration ? `(${videoDuration}s)` : ''}
                  </span>
                )}
              </div>

              {/* Alerta de video mayor a 30s */}
              {videoExceededError && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-800 dark:text-red-300">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">El video supera los 30 segundos ({videoDuration}s).</div>
                      <p className="mt-1">
                        Para optimizar la carga comunitaria, el mapa acepta videos de hasta 30 segundos. Para videos más extensos, por favor envíalos a:
                      </p>
                      <a 
                        href="mailto:ccomusoc@gmail.com?subject=Video%20Extenso%20de%20Testimonio"
                        className="inline-flex items-center gap-1 mt-1 font-bold text-[#0e98d6] hover:underline"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>ccomusoc@gmail.com</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
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
                disabled={isSubmitting || videoExceededError}
                className="px-5 py-2.5 bg-[#e65c00] hover:bg-[#cf5300] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Guardando...' : 'Añadir Testimonio Aquí'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
