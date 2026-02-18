export interface LocationResult {
  latitude: number;
  longitude: number;
}

export async function getCurrentLocation(): Promise<LocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(new Error(`Location error: ${err.message}`)),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  });
}
