import { SocialProject, CommunityTestimony, UserProfile, ProjectCategory } from '../types';

export const CATEGORY_DETAILS: Record<ProjectCategory, { label: string; color: string; bgLight: string; icon: string }> = {
  radios_comunitarias: {
    label: 'Radios y Medios Comunitarios',
    color: '#0e98d6',
    bgLight: '#e3f5fc',
    icon: 'Radio'
  },
  soberania_alimentaria: {
    label: 'Soberanía Alimentaria y Huertas',
    color: '#10b981',
    bgLight: '#ecfdf5',
    icon: 'Sprout'
  },
  educacion_popular: {
    label: 'Educación Popular y Alfabetización',
    color: '#f59e0b',
    bgLight: '#fffbeb',
    icon: 'GraduationCap'
  },
  salud_comunitaria: {
    label: 'Salud Comunitaria y Cuidado',
    color: '#ec4899',
    bgLight: '#fdf2f8',
    icon: 'HeartHandshake'
  },
  habitat_ambiente: {
    label: 'Hábitat, Agua y Medio Ambiente',
    color: '#06b6d4',
    bgLight: '#ecfeff',
    icon: 'Droplets'
  },
  genero_ddhh: {
    label: 'Género y Derechos Humanos',
    color: '#8b5cf6',
    bgLight: '#f5f3ff',
    icon: 'Shield'
  },
  juventud_cultura: {
    label: 'Juventud, Arte y Cultura',
    color: '#f97316',
    bgLight: '#fff7ed',
    icon: 'Sparkles'
  }
};

export const INITIAL_PROJECTS: SocialProject[] = [
  {
    id: 'proj-001',
    title: 'Radio Comunitaria Voces del Valle',
    summary: 'Emisora comunitaria que fortalece la comunicación indígena y campesina en la Quebrada.',
    description: 'Espacio de formación periodística popular, transmisión bilingüe (quechua y español) y alertas comunitarias ante contingencias climáticas y defensa territorial.',
    category: 'radios_comunitarias',
    coordinates: [-23.5775, -65.3508], // Tilcara, Jujuy
    locationName: 'Tilcara',
    province: 'Jujuy',
    country: 'Argentina',
    impactRadiusKm: 18.0,
    directBeneficiaries: 4200,
    indirectBeneficiaries: 18500,
    status: 'activo',
    startDate: '2023-04-10',
    organizationLeader: 'Colectivo Comunicacional Quebrada',
    contactEmail: 'ccomusoc@gmail.com',
    odsGoals: [10, 11, 16],
    updatedAt: '2026-09-12',
    syncedWithSheet: true
  },
  {
    id: 'proj-002',
    title: 'Red de Soberanía Alimentaria y Huertas Escolares',
    summary: 'Producción agroecológica colectiva para abastecer 14 comedores comunitarios y escuelas.',
    description: 'Talleres de biofertilizantes, banco de semillas nativas y capacitación a familias productoras periurbanas para reducir el costo de acceso a alimentos frescos y nutritivos.',
    category: 'soberania_alimentaria',
    coordinates: [-31.3204, -64.4839], // Valle de Punilla, Córdoba
    locationName: 'Cosquín / Punilla',
    province: 'Córdoba',
    country: 'Argentina',
    impactRadiusKm: 12.0,
    directBeneficiaries: 3100,
    indirectBeneficiaries: 11200,
    status: 'en_ejecucion',
    startDate: '2024-02-15',
    organizationLeader: 'Asociación Semillas Vivas',
    contactEmail: 'huertas.punilla@ccomusoc.com.ar',
    odsGoals: [2, 3, 12, 13],
    updatedAt: '2026-10-01',
    syncedWithSheet: true
  },
  {
    id: 'proj-003',
    title: 'Observatorio Barrial de Hábitat y Agua Segura',
    summary: 'Mapeo participativo de puntos de agua potable, zanjas a cielo abierto y microbasurales.',
    description: 'La propia vecindad releva datos geoespaciales con teléfonos móviles para exigir obras de saneamiento a las autoridades y prevenir enfermedades de origen hídrico.',
    category: 'habitat_ambiente',
    coordinates: [-34.6508, -58.7892], // Moreno, Buenos Aires
    locationName: 'Cuartel V, Moreno',
    province: 'Buenos Aires',
    country: 'Argentina',
    impactRadiusKm: 5.5,
    directBeneficiaries: 7800,
    indirectBeneficiaries: 24000,
    status: 'activo',
    startDate: '2023-08-20',
    organizationLeader: 'Mesa de Integración Socio-Urbana Moreno',
    contactEmail: 'habitat.moreno@ccomusoc.com.ar',
    odsGoals: [6, 11, 3],
    updatedAt: '2026-09-28',
    syncedWithSheet: true
  },
  {
    id: 'proj-004',
    title: 'Laboratorio de Comunicación Popular Juvenil',
    summary: 'Espacio de creación audiovisual comunitaria, podcast y streaming con enfoque en DDHH.',
    description: 'Jóvenes de barrios populares aprenden narrativa transmedia, edición de audio/video y coberturas de problemáticas barriales, produciendo contenido crítico para redes.',
    category: 'juventud_cultura',
    coordinates: [-32.9468, -60.6393], // Rosario, Santa Fe
    locationName: 'Barrio Tablada, Rosario',
    province: 'Santa Fe',
    country: 'Argentina',
    impactRadiusKm: 7.0,
    directBeneficiaries: 1950,
    indirectBeneficiaries: 15400,
    status: 'activo',
    startDate: '2024-05-18',
    organizationLeader: 'Frente Cultural Tablada',
    contactEmail: 'ccomusoc@gmail.com',
    odsGoals: [4, 8, 10],
    updatedAt: '2026-10-05',
    syncedWithSheet: true
  },
  {
    id: 'proj-005',
    title: 'Centro de Salud Comunitaria y Telemedicina Rural',
    summary: 'Punto de atención primaria y enlace digital para colonias agrícolas aisladas.',
    description: 'Articulación entre agentes sanitarios rurales, conectividad satelital y promotores de salud para seguimiento de mujeres embarazadas y personas mayores.',
    category: 'salud_comunitaria',
    coordinates: [-26.6214, -54.1082], // San Pedro, Misiones
    locationName: 'San Pedro',
    province: 'Misiones',
    country: 'Argentina',
    impactRadiusKm: 25.0,
    directBeneficiaries: 2850,
    indirectBeneficiaries: 9800,
    status: 'en_ejecucion',
    startDate: '2024-09-01',
    organizationLeader: 'Red Sanitaria de la Selva',
    contactEmail: 'salud.rural@ccomusoc.com.ar',
    odsGoals: [3, 10],
    updatedAt: '2026-10-10',
    syncedWithSheet: true
  },
  {
    id: 'proj-006',
    title: 'Archivo Oral de Memorias y Derechos Humanos',
    summary: 'Rescate de testimonios orales de luchas comunitarias, huelgas rurales y género.',
    description: 'Digitalización participativa de relatos orales de pobladoras históricas, memoria barrial y creación de cápsulas sonoras para escuelas y radios locales.',
    category: 'genero_ddhh',
    coordinates: [-32.8895, -68.8458], // Guaymallén, Mendoza
    locationName: 'Guaymallén',
    province: 'Mendoza',
    country: 'Argentina',
    impactRadiusKm: 10.0,
    directBeneficiaries: 1400,
    indirectBeneficiaries: 8700,
    status: 'activo',
    startDate: '2023-11-03',
    organizationLeader: 'Asamblea de la Memoria Colectiva',
    contactEmail: 'memoria.mendoza@ccomusoc.com.ar',
    odsGoals: [5, 10, 16],
    updatedAt: '2026-08-25',
    syncedWithSheet: true
  }
];

export const INITIAL_TESTIMONIES: CommunityTestimony[] = [
  {
    id: 'test-001',
    projectId: 'proj-001',
    projectName: 'Radio Comunitaria Voces del Valle',
    authorName: 'Eulalia Quispe',
    isAnonymous: false,
    communityRole: 'Locutora y Comunicadora Originaria',
    neighborhood: 'Tilcara, Jujuy',
    coordinates: [-23.5780, -65.3490],
    date: '2026-09-14',
    rating: 5,
    storyText: 'Por primera vez en nuestra comunidad pudimos transmitir las alertas de lluvia en nuestra lengua quechua. Salvó los cultivos de 30 familias antes de que bajara la creciente del río.',
    quoteHighlight: 'La radio no es solo un micrófono, es el escudo de nuestro territorio.',
    mediaType: 'photo',
    status: 'destacado',
    syncedWithSheet: true
  },
  {
    id: 'test-002',
    projectId: 'proj-002',
    projectName: 'Red de Soberanía Alimentaria y Huertas Escolares',
    authorName: 'Mario Benítez',
    isAnonymous: false,
    communityRole: 'Referente de Huerta Familiar',
    neighborhood: 'Cosquín, Córdoba',
    coordinates: [-31.3180, -64.4810],
    date: '2026-09-22',
    rating: 5,
    storyText: 'Aprendimos a hacer compostaje comunitario y hoy cosechamos acelga, tomate y aromáticas sin químicos. Las familias del comedor ahora comen verduras frescas cosechadas el mismo día.',
    quoteHighlight: 'Recuperar la tierra nos devolvió la dignidad alimentaria.',
    mediaType: 'video',
    videoDurationSeconds: 24, // <= 30 seg
    status: 'aprobado',
    syncedWithSheet: true
  },
  {
    id: 'test-003',
    projectId: 'proj-003',
    projectName: 'Observatorio Barrial de Hábitat y Agua Segura',
    authorName: 'Vecina de Cuartel V',
    isAnonymous: true,
    communityRole: 'Madre y Promotora Barrial',
    neighborhood: 'Moreno, Buenos Aires',
    coordinates: [-34.6520, -58.7880],
    date: '2026-10-02',
    rating: 4,
    storyText: 'Con el mapa en el celular marcamos la zanja desbordada frente a la escuela. Cuando presentamos el informe con las coordenadas en el municipio, vinieron a hacer el entubado en dos semanas.',
    quoteHighlight: 'El mapa nos dio pruebas reales que nadie pudo ignorar.',
    mediaType: 'photo',
    status: 'aprobado',
    syncedWithSheet: true
  },
  {
    id: 'test-004',
    projectId: 'proj-004',
    projectName: 'Laboratorio de Comunicación Popular Juvenil',
    authorName: 'Lucas Argañaraz',
    isAnonymous: false,
    communityRole: 'Estudiante de Taller Audiovisual',
    neighborhood: 'Barrio Tablada, Rosario',
    coordinates: [-32.9490, -60.6370],
    date: '2026-10-08',
    rating: 5,
    storyText: 'Antes solo salíamos en los noticieros cuando había violencia. Hoy producimos nuestros propios minidocumentales contando cómo organizamos el club barrial y los talleres de música.',
    quoteHighlight: 'Contamos nuestra propia historia con nuestras propias voces.',
    mediaType: 'video',
    videoDurationSeconds: 28, // <= 30 seg
    status: 'destacado',
    syncedWithSheet: true
  },
  {
    id: 'test-005',
    projectId: 'proj-005',
    projectName: 'Centro de Salud Comunitaria y Telemedicina Rural',
    authorName: 'Silvia Duarte',
    isAnonymous: false,
    communityRole: 'Agente Sanitaria',
    neighborhood: 'Picada Guaraní, San Pedro',
    coordinates: [-26.6250, -54.1050],
    date: '2026-10-11',
    rating: 5,
    storyText: 'Tener conexión y registro digital permitió que el pediatra de la capital revisara los análisis de un bebé en menos de una hora sin que la familia tuviera que viajar 180 km en camino de tierra.',
    quoteHighlight: 'La comunicación oportuna salva vidas en la selva profunda.',
    mediaType: 'audio',
    status: 'aprobado',
    syncedWithSheet: true
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-001',
    name: 'Lic. Claudia Morales',
    email: 'ccomusoc@gmail.com',
    role: 'super_admin',
    organization: 'CComuSoc - Red Central',
    activeSince: '2022-01-15'
  },
  {
    id: 'user-002',
    name: 'Rodrigo Santillán',
    email: 'rodrigo.santillan@ccomusoc.com.ar',
    role: 'admin',
    organization: 'Coordinación Territorial NOA',
    activeSince: '2023-03-01'
  },
  {
    id: 'user-003',
    name: 'Florencia Benítez',
    email: 'florencia.editora@ccomusoc.com.ar',
    role: 'editor',
    organization: 'Área de Contenidos y Redacción',
    activeSince: '2023-07-10'
  },
  {
    id: 'user-004',
    name: 'Mateo Roldán',
    email: 'campo.tablada@ccomusoc.com.ar',
    role: 'field_agent',
    organization: 'Promotor Comunitario Rosario',
    activeSince: '2024-02-01'
  },
  {
    id: 'user-005',
    name: 'Visitante Comunitario',
    email: 'vecino@comunidad.org',
    role: 'citizen',
    organization: 'Comunidad Local',
    activeSince: '2026-10-15'
  }
];
