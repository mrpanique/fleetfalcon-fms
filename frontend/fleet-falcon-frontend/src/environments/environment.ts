export const environment = {
  production: window.location.hostname !== 'localhost',
  // A trükk: Megnézzük, hol fut a frontend!
  apiUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:8080'                          
    : 'https://fleetfalcon-api.onrender.com'     // Render.com backend api (FALLBACK)
};