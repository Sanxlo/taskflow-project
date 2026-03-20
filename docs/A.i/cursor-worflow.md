Flujo de trabajo con Cursor
Qué documenta este archivo

En este documento explico cómo he utilizado Cursor dentro del proyecto TaskFlow, qué herramientas he probado y en qué casos me ha ayudado a revisar, corregir y mejorar el código existente en los archivos index.html, style.css y script.js (o app.js, según la versión del proyecto).

1. Instalación y apertura del proyecto

Instalé Cursor y abrí el proyecto completo de TaskFlow para trabajar con contexto real sobre su estructura. Esto me permitió revisar de forma conjunta el HTML, los estilos y la lógica JavaScript, en lugar de analizar cada archivo por separado.

Trabajar con el proyecto completo fue importante porque muchas de las mejoras no dependían solo de una función aislada, sino de la relación entre varios archivos: por ejemplo, la correspondencia entre elementos del DOM, clases visuales y lógica de renderizado.

2. Exploración de la interfaz

Durante el primer contacto exploré varias partes de Cursor para entender cómo podía aplicarlo al proyecto:

explorador de archivos

terminal integrada

chat contextual

edición inline

Composer

Esta exploración me permitió comprobar cómo Cursor combina navegación por archivos, explicación de código, edición asistida y generación de cambios más amplios a partir de instrucciones en lenguaje natural.

3. Pruebas realizadas con el archivo JavaScript

Usé como base el archivo principal de lógica del proyecto, centrando la revisión en funciones relacionadas con el almacenamiento, renderizado, filtrado, búsqueda, validación y ordenación de tareas.

3.1 Autocompletado

Probé el autocompletado escribiendo comentarios e intenciones funcionales para comprobar cómo Cursor proponía implementaciones coherentes con el proyecto. Por ejemplo:

crear una función para validar el título de una tarea

actualizar la barra de progreso

filtrar tareas por estado y texto de búsqueda

ordenar tareas por fecha o por nombre

Esto me permitió ver cómo Cursor interpreta instrucciones en lenguaje natural y las traduce en propuestas de código alineadas con la estructura existente.

3.2 Chat contextual

Utilicé el chat contextual para pedir explicaciones sobre funciones concretas del proyecto, especialmente:

loadTasks

renderTasks

createTaskElement

getFilteredTasks

updateProgress

Esto fue útil para entender mejor:

cómo se cargan las tareas desde localStorage

cómo se vuelve a pintar la interfaz tras cada cambio

cómo se combinan búsqueda, filtros y renderizado

qué diferencias había entre el JavaScript actual y la estructura real del HTML/CSS

qué partes del proyecto seguían una lógica moderna basada en Tailwind y cuáles parecían heredadas de una hoja CSS anterior

3.3 Edición inline

Utilicé la edición inline para modificar funciones existentes sin reescribir todo el archivo. Las funciones en las que más trabajé fueron:

addTask

editTask

createTaskElement

getFilteredTasks

En estas pruebas pedí mejoras como:

evitar tareas vacías

reforzar validaciones con trim()

dejar más clara la lógica de renderizado

eliminar clases legacy que ya no encajaban con el enfoque actual del proyecto

integrar mejor la búsqueda y la ordenación con el flujo de filtrado existente

3.4 Composer

Probé Composer para generar cambios que afectaban a varios archivos a la vez. Lo utilicé sobre todo para plantear mejoras completas en tres áreas:

revisión de inconsistencias entre HTML, CSS y JavaScript

confirmación e integración de la búsqueda de tareas

incorporación de un sistema de ordenación de tareas

Composer fue especialmente útil cuando el cambio no afectaba solo a una función, sino a la relación entre interfaz, estilo y lógica.

4. Cambios revisados y trabajados en el proyecto
4.1 Revisión de coherencia entre index.html, style.css y script.js

Uno de los trabajos más importantes fue revisar si el JavaScript realmente coincidía con el HTML y el sistema visual del proyecto.

A partir de esa revisión detecté que:

la estructura principal del DOM sí era compatible con funciones como renderTasks y createTaskElement

el proyecto estaba funcionando principalmente con clases de Tailwind escritas directamente en el HTML y en el JavaScript

style.css contenía reglas y nombres de clase de una versión anterior del diseño, pero no estaba participando realmente en la interfaz actual si no se enlazaba en index.html

Esto permitió concluir que muchas “inconsistencias” no eran fallos entre JavaScript y HTML, sino una mezcla entre un diseño antiguo basado en CSS tradicional y una implementación nueva apoyada en Tailwind.

4.2 Limpieza de createTaskElement

También revisé la función createTaskElement() porque mezclaba clases semánticas heredadas con clases utilitarias de Tailwind.

A partir de esa revisión se planteó una versión más coherente donde:

se mantiene la estructura funcional de la tarea

se eliminan clases legacy que ya no aportaban nada visual

se conservan solo clases alineadas con el diseño real actual

la animación de borrado se resuelve con clases utilitarias, sin depender de reglas antiguas como .task-item.removing

Con esto, el código quedó más limpio y más consistente con el enfoque visual real del proyecto.

4.3 Confirmación de que la búsqueda ya existía

Otro punto importante fue comprobar que la búsqueda de tareas no hacía falta implementarla desde cero, porque ya estaba integrada correctamente en el proyecto.

Se revisó que:

existía un campo input con id search-input en index.html

el estado currentSearch ya estaba presente en JavaScript

la función getFilteredTasks() ya combinaba filtro por estado y texto de búsqueda

renderTasks() ya usaba esa lista filtrada para pintar el resultado en pantalla

A partir de esto, el trabajo no consistió en “crear la búsqueda”, sino en dejar claro que ya formaba parte del flujo actual y que debía mantenerse al hacer nuevas mejoras.

4.4 Mejora del estado vacío

Aprovechando la revisión del renderizado, también se planteó una mejora del estado vacío para distinguir entre dos casos:

que no existan tareas todavía

que no haya resultados por culpa de la búsqueda o de los filtros

Esto mejora la experiencia de uso y hace más comprensible el comportamiento de la interfaz.

4.5 Incorporación de ordenación de tareas

Una de las ampliaciones más claras realizadas sobre el proyecto fue la propuesta de un sistema de ordenación de tareas.

Se definió una solución sencilla, sin librerías externas, integrada en el flujo actual del proyecto:

en index.html, añadiendo un selector sort-select dentro de la zona de filtros

en style.css, añadiendo estilos base para select coherentes con el diseño general

en script.js, incorporando:

una nueva referencia al DOM (sortSelect)

un nuevo estado (currentSort)

una función setSort()

la lógica de ordenación dentro de getFilteredTasks()

Los criterios incorporados fueron:

más recientes primero

más antiguas primero

orden alfabético

La ordenación se integró después del filtrado por estado y de la búsqueda, de modo que todas las funciones del proyecto siguieran funcionando juntas sin romper el flujo de renderizado.

5. Atajos de teclado más usados

- `Ctrl/Cmd + Shift + P`: abrir la paleta de comandos
- `Ctrl/Cmd + K`: edición inline
- `Ctrl/Cmd + L`: abrir el chat
- `Ctrl/Cmd + Enter`: enviar o ejecutar una acción en el panel correspondiente

6. Dos ejemplos concretos donde Cursor mejoró mi código
Ejemplo 1: detección de inconsistencias entre archivos

Uno de los aportes más útiles de Cursor fue ayudarme a detectar incoherencias entre la lógica JavaScript y la estructura real del proyecto.

Durante la revisión se observó que parte del código parecía venir de una versión anterior basada en style.css, mientras que la interfaz real estaba construida sobre Tailwind. Gracias a Cursor pude revisar esa relación entre archivos con más rapidez y entender qué partes del código seguían siendo válidas y cuáles debían limpiarse o reinterpretarse.

Esto fue especialmente útil en funciones como createTaskElement() y en la revisión de elementos del DOM relacionados con filtros, barra de progreso, búsqueda y tema visual.

Ejemplo 2: mejora de validaciones y del flujo de filtrado

Otro caso claro donde Cursor me ayudó fue en la mejora incremental del comportamiento del proyecto.

A partir de funciones ya existentes pude plantear cambios como:

reforzar validaciones al crear o editar tareas

mantener la búsqueda integrada en el filtrado

añadir ordenación sin romper el resto de funcionalidades

mejorar el estado vacío de la interfaz

Esto hizo que el código quedara más robusto, más entendible y mejor conectado entre HTML, CSS y JavaScript.

7. Valoración personal

Cursor me resultó especialmente útil para trabajar sobre código ya existente con contexto real de proyecto. Su mayor valor no estuvo tanto en generar una aplicación desde cero, sino en ayudarme a:

revisar la relación entre archivos

detectar incoherencias estructurales

entender funciones ya escritas

proponer refactorizaciones controladas

extender funcionalidades sin romper las anteriores

En el caso de TaskFlow, me ayudó sobre todo a confirmar qué partes del proyecto ya estaban bien resueltas, cuáles necesitaban limpieza y cómo añadir mejoras como la ordenación manteniendo la estructura y el estilo del código existente.



Uso de MCP (Model Context Protocol) en TaskFlow
Objetivo

Este documento describe la configuración, uso y verificación de un servidor MCP dentro del proyecto TaskFlow utilizando Cursor, así como ejemplos prácticos de consultas realizadas sobre el proyecto.

¿Qué es MCP?

El Model Context Protocol (MCP) es un estándar que permite conectar herramientas de inteligencia artificial con fuentes externas como:

sistema de archivos

APIs

bases de datos

repositorios

En este proyecto, se ha utilizado un servidor MCP de tipo filesystem, que permite a la IA acceder directamente a los archivos del proyecto.

Configuración del servidor MCP

Se ha configurado el servidor MCP mediante el archivo mcp.json con la siguiente estructura:

{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/LENOVO/taskflow-project"
      ]
    }
  }
}
🔧 Requisitos

Node.js instalado

Cursor configurado con soporte MCP

Ruta correcta al proyecto TaskFlow

Autorización de comandos

Durante la primera ejecución, Cursor solicita autorización para ejecutar comandos del sistema (en este caso, PowerShell).

Este paso es necesario por seguridad, ya que el servidor MCP puede interactuar con el sistema de archivos.

Acción realizada

Se autorizó el uso de PowerShell mediante:

Allowlist 'powershell'

Run

Verificación de funcionamiento

Una vez configurado y autorizado el servidor MCP, se realizaron varias consultas para comprobar su correcto funcionamiento.

El objetivo era verificar que la IA podía acceder al contenido real del proyecto.

Consultas realizadas
1. Listado de archivos del proyecto

Consulta:

Lista los archivos de mi proyecto

Resultado esperado:

Se muestran archivos como:

index.html

style.css

script.js / app.js

Verificación:
✔ Acceso correcto al sistema de archivos

2. Análisis de estructura HTML

Consulta:

Abre index.html y resume su estructura

Resultado esperado:

Descripción de secciones como:

formulario de tareas

filtros

búsqueda

lista de tareas

Verificación:
✔ Lectura directa de archivos HTML

3. Búsqueda de elementos del DOM

Consulta:

Busca search-input en el proyecto

Resultado esperado:

Ubicación en index.html

Uso en script.js

Verificación:
✔ Relación entre HTML y JavaScript

4. Análisis de funciones

Consulta:

Dime qué hace getFilteredTasks

Resultado esperado:

Explicación de:

filtrado por estado

búsqueda por texto

ordenación

Verificación:
✔ Acceso a lógica interna del proyecto

5. Detección de inconsistencias

Consulta:

Detecta inconsistencias entre HTML y JS

Resultado esperado:

Posibles diferencias entre:

IDs del DOM

clases CSS

uso de Tailwind vs style.css

Verificación:
✔ Análisis cruzado entre archivos

Casos de uso en proyectos reales

El uso de MCP resulta especialmente útil en:

proyectos grandes con muchos archivos

revisión automática de código

detección de inconsistencias entre capas (HTML, CSS, JS)

acceso a documentación interna sin copiar contenido manualmente

integración con servicios externos (GitHub, APIs, etc.)

