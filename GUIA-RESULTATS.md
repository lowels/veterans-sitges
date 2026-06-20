# Guía: cargar resultados del Torneig 2026 (sin deploys)

La página `torneig-2026.html` **lee los resultados en directo desde un Google Sheet**.
Tú escribes los marcadores en la hoja desde el móvil y **todo el mundo los ve actualizarse** en la web.

✅ **Sin deploys** el día del torneo.
✅ **Sin credenciales en el código**: la web solo *lee* la hoja; *editar* lo controlan los permisos de Google.
✅ La web es **solo lectura** para los visitantes. Solo quien tenga **permiso de edición** en la hoja puede cargar resultados.

---

## Cómo funcionan los permisos (lo que preguntabas)

- **Quién puede ESCRIBIR resultados** = quien tú añadas como **Editor** de la hoja (tú y quien elijas). Nadie más.
- **Quién puede LEER** = para que la web pueda mostrar los datos sin claves, la hoja debe ser **"Cualquiera con el enlace: Lector"**. Esto solo hace públicos los *resultados* (que ya son públicos); **editar sigue restringido** a tus editores.

No hace falta una API key ni nada secreto en el código.

---

## Puesta en marcha (una sola vez, ~5 min)

1. **Crea la hoja**
   - En [sheets.google.com](https://sheets.google.com), hoja nueva.
   - *Archivo → Importar → Subir →* `resultats-plantilla.csv` (está en esta carpeta `web/`).
     Elige **"Reemplazar hoja actual"**, separador **coma**.
   - Renombra la pestaña a **`Resultats`** (abajo, doble clic en el nombre de la pestaña).
   - Verás 23 filas (20 partidos + `sf1`, `sf2`, `final`). Tú solo rellenas `punts_local`, `punts_visitant` y `tl`. **No toques la columna `id`.**
   - La columna **`scored id`** la rellenas **una vez** (antes del torneo) con el ID de cada partido en scored.es; es lo que usa la pantalla de marcadores (ver más abajo).

2. **Comparte**
   - Botón **Compartir** (arriba a la derecha).
   - En **"Acceso general"**: cambia a **"Cualquiera con el enlace"** y rol **"Lector"**.
   - Añade como **Editores** las personas que podrán cargar resultados (tu correo y quien elijas).

3. **Coge el ID de la hoja y arma la URL CSV**
   - La URL de tu hoja es algo así:
     `https://docs.google.com/spreadsheets/d/`**`1AbCdEf...XyZ`**`/edit#gid=0`
     Lo que está en negrita es el **ID**.
   - La URL que necesita la web es:
     ```
     https://docs.google.com/spreadsheets/d/EL_TEU_ID/gviz/tq?tqx=out:csv&sheet=Resultats
     ```

4. **Pégala en la web**
   - Abre `assets/js/torneig-2026.js`, arriba en `CONFIG`:
     ```js
     const CONFIG = {
       sheetCsvUrl: 'https://docs.google.com/spreadsheets/d/EL_TEU_ID/gviz/tq?tqx=out:csv&sheet=Resultats',
       refreshSeconds: 30,
     };
     ```
   - Sube la web **una única vez** con este cambio. **A partir de aquí, cero deploys.**

> **Plan B** (si tu cuenta del club tiene bloqueado el "cualquiera con el enlace"):
> usa *Archivo → Compartir → Publicar en la web → CSV* y pega esa URL (acaba en `output=csv`) en `sheetCsvUrl`. Funciona igual.

---

## El día del torneo

- Abre el **Google Sheet en el móvil** (app Google Sheets, con tu cuenta editora) y ve rellenando:
  - `punts_local` y `punts_visitant` = puntos de cada equipo.
  - `tl` = **solo si hay empate**: `local` o `visitant`, según quién gane los tiros libres.
- La web se **actualiza sola cada 30 s** (y al volver a la pestaña). También hay botón **↻ Actualizar**.
- **Clasificación, cruces de semifinales y campeón se calculan solos.** En `sf1`/`sf2`/`final` solo pones los puntos; la web ya sabe qué equipo va en cada lado según el ranking.

> **Tip:** la web abierta en una pantalla/TV del pabellón para el público + el Sheet en tu móvil para cargar.

---

## Columnas del CSV

| Columna | ¿La tocas? | Qué es |
|---|---|---|
| `id` | ❌ NO | Identificador interno (g1…g20, sf1, sf2, final) |
| `hora`, `pista`, `grup` | ❌ NO | Solo informativo para ti |
| `equip_local`, `equip_visitant` | ❌ NO | Nombres para orientarte |
| `punts_local` | ✅ SÍ | Puntos del equipo local |
| `punts_visitant` | ✅ SÍ | Puntos del equipo visitante |
| `tl` | ✅ (solo empates) | `local` o `visitant` = quién gana los tiros libres |
| `scored id` | ✅ (una vez) | ID del partido en scored.es. Lo usa la pantalla de marcadores para cargar cada iframe |

---

## Pantalla de marcadores en directo (pantalla gigante)

La página **`marcadors-horitzontal.html`** muestra **dos partidos a la vez** en una pantalla 1920×1080: Pista 1 arriba y Pista 2 abajo, con una franja central que pasa los patrocinadores en carrusel.

Lee el **mismo Google Sheet** y usa la columna **`scored id`** para cargar cada marcador. El día del torneo casi no tienes que tocar nada:

1. Abre `marcadors-horitzontal.html` en el ordenador de la pantalla y pulsa **`F`** (pantalla completa).
2. Pulsa **`C`** para abrir el panel → en **⚡ Càrrega per hora** elige la hora actual y pulsa **"Carrega aquesta hora"**. Cargan solos los dos partidos de esa franja.
3. Al cambiar de franja horaria, repites el paso 2 (o pulsas **↻** si acabas de añadir algún `scored id` a la hoja).

> **Requisito:** rellena la columna `scored id` en la hoja **antes** del torneo. Si una fila no la tiene, el desplegable lo avisa con ⚠️ y ese marcador se queda vacío.
>
> Teclas útiles: `F` pantalla completa · `C` panel · `O` mostrar/ocultar la franja de patrocinadores · `1`/`2` + flechas/rueda para reencuadrar un marcador.

---

## ¿Y si todavía no he configurado la hoja?

Si `sheetCsvUrl` está vacío (`''`), la web se ve perfectamente pero con la tabla **sin resultados** (todo a `–`). En cuanto pegas la URL y subes esa vez, empieza a leer de la hoja.
