/* ============================================================
   playlist.js — Pantalla gegant · llista de vídeos verticals
   ============================================================

   COM AFEGIR UN VÍDEO
   1. Crea una carpeta dins de  assets/videos/  amb el NOM que vols
      que surti a l'etiqueta sobre el vídeo. Exemple:
          assets/videos/Víctor Claver/
   2. Posa-hi dins:
          video.mp4     ← el vídeo vertical (obligatori)
          portada.jpg   ← imatge prèvia (OPCIONAL; també val .png/.webp/.jpeg)
   3. Afegeix aquí sota una línia amb el nom de la carpeta.

   La pantalla anirà passant:  portada → vídeo → següent carpeta → …
   (si una carpeta no té portada, o encara no té vídeo, se la salta sola).

   Si els fitxers tenen un altre nom, indica'ls a la línia:
      { name: 'Ramón Mirabet', video: 'mirabet.mp4', portada: 'portada.png' }
   I per saltar la portada d'una carpeta:  portada: null
   ============================================================ */

window.VIDEOS = [
  { name: 'Víctor Claver' },
  { name: 'Ramón Mirabet', video: 'mirabet.mp4' },
  { name: 'Xavi Fernández' },
  { name: 'Marcela Ferrari' },
  { name: 'Bruno Senna' },
  { name: 'Marcel Barrena' },
  { name: 'Ivan Massague' },
  { name: 'Guillem Vives' },
  { name: 'Pau Del Tio' },
  { name: 'Andrés Jiménez' },
  { name: 'Joel Parra' },
  { name: 'Miquel Forns' },
  { name: 'Neus Sanz' },
  { name: 'Amaya Valdemoro' },
  { name: 'Xuriguera i Faixedes' },
  { name: 'Jacint Carafí' },
  { name: 'Carme Lluveras' },
  { name: 'Audie Norris' },
  { name: 'Anna Barrachina' },
  { name: 'Roger Esteller' },
  { name: 'Pep Plaza' },
  { name: 'Ernest macià' },
  { name: 'Lluís Gavaldà' },
  { name: 'Luís Moya' },
  { name: 'Roger Grimau' },
  { name: 'Xavi Monferrer' },
];
