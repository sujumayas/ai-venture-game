# HYPERION — Una peregrinación en siete relatos

*Adaptación no oficial y sin ánimo de lucro de **Hyperion** (1989), de **Dan Simmons**, creada como prueba de concepto
jugable para los titulares de los derechos.*

Siete peregrinos cruzan Hyperion hacia las Tumbas del Tiempo y el Alcaudón, y cada uno cuenta por qué ha venido. Esta
aventura gráfica clásica sigue la estructura de la novela capítulo a capítulo. Entre relatos juegas como **el Cónsul**;
dentro de cada relato encarnas a su protagonista: Paul Duré entre los bikura, Kassad en Agincourt y en las Tumbas,
Silenus desde la Vieja Tierra hasta la Ciudad de los Poetas, Sol viviendo hacia atrás los días de Rachel, Lamia en el caso
de Johnny, Merin Aspic en Maui-Pacto y, por último, la confesión del propio Cónsul.

- Fiel a la novela: sucesos, orden, desenlaces, nombres y lugares. Lo añadido para que las escenas puedan jugarse está
  documentado en `docs/design/`, y los puntos que conviene verificar con el libro están en `docs/FIDELITY_NOTES.md`.
- Texto original: no se reproduce prosa de la novela.
- Completamente bilingüe (inglés y español), con cambio de idioma en cualquier momento.
- Contenido adulto (violencia, duelo, horror corporal, relaciones) sugerido, nunca explícito.
- Guardado y carga, selección de capítulos y relatos (Opciones → modo revisión desbloquea todo).

## Cómo jugarlo
Abre el sitio en un navegador de escritorio. Clic izquierdo: caminar o acción por defecto · clic derecho: mirar ·
**Tab**: mostrar zonas interactivas · Espacio: saltar línea · Esc: menú.

En local: `python3 -m http.server 8123` y abre `http://localhost:8123/?lang=es`.

## Publicar en Netlify
La raíz del repositorio es el sitio (`netlify.toml` ya configurado, sin paso de compilación). Conecta el repositorio
o arrastra la carpeta a Netlify. Se recomienda proteger el sitio con contraseña mientras se presenta a editoriales.

*Hyperion © Dan Simmons. Proyecto de fans no afiliado ni respaldado por el autor ni sus editores, y no está a la venta.*
