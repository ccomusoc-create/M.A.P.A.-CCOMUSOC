/**
 * Utilidades geoespaciales avanzadas para el Mapa de Comunicación para el Desarrollo
 * Plataforma: CComuSoc
 */

/**
 * Calcula la distancia ortodrómica en kilómetros entre dos coordenadas usando la fórmula de Haversine
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(2));
}

/**
 * Determina si una coordenada está dentro del radio de impacto de una intervención
 */
export function isPointInsideRadius(
  pointLat: number,
  pointLng: number,
  centerLat: number,
  centerLng: number,
  radiusKm: number
): boolean {
  const distance = calculateHaversineDistanceKm(pointLat, pointLng, centerLat, centerLng);
  return distance <= radiusKm;
}

/**
 * Calcula el área de cobertura territorial en km² para un radio dado
 */
export function calculateCoverageAreaKm2(radiusKm: number): number {
  return Number((Math.PI * Math.pow(radiusKm, 2)).toFixed(2));
}

/**
 * Formatea distancias de manera amigable (metros o kilómetros)
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Valida un par de coordenadas [lat, lng]
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
