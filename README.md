TaskFlow

Aplicación de gestión de tareas desarrollada con HTML, Tailwind CSS y JavaScript, diseñada con un enfoque simple, claro y funcional.

Demo

Aplicación desplegada en Vercel:
https://taskflow-project-iota-gules.vercel.app/

Diseño de la aplicación

El siguiente diseño muestra la interfaz propuesta para TaskFlow.

TaskFlow sigue un diseño tipo dashboard minimalista, pensado para ser claro y fácil de usar tanto en dispositivos móviles como en escritorio.

La interfaz incluye:

Cabecera

Formulario de tareas

Lista de tareas

Panel de estadísticas

Sección de búsqueda y filtros

El objetivo del diseño es ofrecer una experiencia rápida, visual y sin distracciones.

Funcionalidades
Gestión de tareas

Crear tareas

Editar tareas

Eliminar tareas

Marcar tareas como completadas

Organización

Filtrar por estado (todas, pendientes, completadas)

Buscar tareas por texto

Ordenar tareas:

Más recientes

Más antiguas

Orden alfabético

Experiencia de usuario

Persistencia de datos con localStorage

Modo oscuro (dark mode)

Interfaz responsive

Animaciones suaves en la interacción

Ejemplos de uso
1. Crear una tarea

Escribe un título en el campo de entrada.

Pulsa el botón de añadir.

La tarea aparecerá en la lista.

2. Buscar una tarea

Escribe texto en el campo de búsqueda.

La lista se filtra automáticamente en tiempo real.

Ejemplo:

Buscar: estudiar

Resultado: solo tareas que contienen “estudiar”

3. Filtrar tareas

Usa los botones de filtro:

Todas → muestra todas las tareas

Pendientes → tareas sin completar

Completadas → tareas finalizadas

4. Ordenar tareas

Selecciona una opción en el selector de orden:

Más recientes primero

Más antiguas primero

Orden alfabético

5. Editar una tarea

Haz clic en el botón Editar

Modifica el texto

Confirma el cambio

6. Eliminar una tarea

Haz clic en Eliminar

La tarea desaparecerá con animación

Uso de IA en el proyecto

Durante el desarrollo de TaskFlow se utilizó IA como apoyo para:

Refactorizar funciones existentes

Detectar inconsistencias entre archivos

Mejorar validaciones

Proponer nuevas funcionalidades

Generar documentación técnica

Optimizar la estructura del código

Todo el código generado fue revisado manualmente antes de ser aceptado.

Tecnologías utilizadas

HTML5

Tailwind CSS

JavaScript (ES6+)

LocalStorage

Cursor (IA-assisted development)

Estructura del proyecto
taskflow-project/
│
├── index.html
├── style.css
├── script.js / app.js
├── docs/
│   └── ai/
│       ├── prompt-engineering.md
│       ├── experiments.md
│
└── README.md
Instalación y uso

Clonar el repositorio:

git clone https://github.com/tu-usuario/taskflow-project.git

Abrir el proyecto:

cd taskflow-project

Abrir index.html en el navegador

Mejoras futuras

Validaciones más avanzadas en formularios

Edición inline (sin prompt)

Categorías o etiquetas de tareas

Sincronización con backend

Exportación/importación de tareas

Licencia

Este proyecto es de uso académico y educativo.