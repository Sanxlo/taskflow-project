Comparativa entre asistentes de IA

Qué documenta este archivo
En este documento voy a comparar el comportamiento de ChatGPT y Claude en distintas tareas relacionadas con programación. Analizaré la claridad de sus explicaciones, su capacidad para detectar errores en funciones JavaScript y la calidad del código que generan a partir de descripciones en lenguaje natural.

Objetivo
El objetivo de esta comparativa es comprobar qué asistente resulta más útil en tareas reales de desarrollo dentro del proyecto TaskFlow.

Se analizan tres aspectos clave:

Explicación de conceptos técnicos

Detección de errores en código

1. Explicación de conceptos técnicos
Closure

Prompt usado:

Explícame qué es un closure en JavaScript con una definición sencilla, un ejemplo práctico y un caso real de uso en frontend.

IA 1 (resumen)

Explicación muy intuitiva (“recuerda variables”)

Ejemplos progresivos: contador, toggle, eventos

Muy orientada a aprendizaje

IA 2 (resumen)

Explicación correcta pero más formal

Introduce encapsulación y estado persistente

Conecta con React (useState)

Comparación

IA 1: mejor claridad + mejores ejemplos

IA 2: mayor profundidad conceptual

Ganador: IA 1 (aprendizaje), IA 2 (contexto profesional)

Event Loop

Prompt usado:

Explícame cómo funciona el event loop en JavaScript con ejemplos.

IA 1 (resumen)

Explicación paso a paso

Ejemplos con logs detallados

Regla mental clara:
stack → microtasks → callback queue

IA 2 (resumen)

Más técnica y compacta

Introduce macrotasks

Relaciona con async/await y render

Comparación

IA 1: claridad + intuición

IA 2: profundidad técnica

Ganador: IA 1 (comprensión), IA 2 (nivel avanzado)

DOM

Prompt usado:

Explícame qué es el DOM y cómo se usa con JavaScript.

IA 1 (resumen)

Metáfora de árbol muy clara

Explica acceso, modificación y eventos

Ideal para empezar

IA 2 (resumen)

Añade:

classList

atributos

innerHTML vs textContent

performance (reflow/repaint)

DocumentFragment

Comparación

IA 1: mejor para entender

IA 2: mejor para trabajar

Ganador: IA 2 (uso real), IA 1 (aprendizaje)

2. Detección de errores en funciones
Bug 1 — Off-by-one
function countCompletedTasks(tasks) {
  let completed = 0;

  for (let i = 0; i <= tasks.length; i++) {
    if (tasks[i].completed) {
      completed++;
    }
  }

  return completed;
}
IA 1

Detecta <= → i < tasks.length

Explica error de índices

Describe TypeError

Añade versión más segura

IA 2

Detecta el bug correctamente

Explica off-by-one

Da versión corregida

Comparación

Ambas correctas, pero IA 1 más completa

Bug 2 — Asignación vs comparación
function findTaskById(tasks, id) {
  return tasks.find(task => task.id = id);
}
IA 1

Detecta el bug

Explica mutación de datos

Señala dependencia de valores truthy/falsy

IA 2

Detecta el bug

Afirma que muta todos los elementos

Comparación

IA 1 es más precisa
IA 2 comete error conceptual (find se detiene antes)

Bug 3 — Serialización
function saveTasks(tasks) {
  localStorage.setItem("tasks", tasks);
}
IA 1

Explica problema de serialización

Propone JSON.stringify

Añade try/catch

IA 2

Explicación más precisa del resultado ([object Object])

Añade función de carga (JSON.parse)

Comparación

Ambas correctas
IA 2 ligeramente más completa

3. Generación de funciones desde lenguaje natural
Caso 1 — Filtrar tareas por estado

Descripción:

Crea una función JavaScript que filtre una lista de tareas por estado. Debe aceptar "all", "pending" y "completed".

Código generado por IA 1
function filterTasks(tasks, status) {
  if (status === "all") {
    return tasks;
  }

  if (status === "completed") {
    return tasks.filter(task => task.completed === true);
  }

  if (status === "pending") {
    return tasks.filter(task => task.completed === false);
  }

  return [];
}
Código generado por IA 2
function filterTasksByStatus(tasks, status) {
  if (status === "all") return tasks;
  if (status === "completed") return tasks.filter(task => task.completed);
  if (status === "pending") return tasks.filter(task => !task.completed);

  throw new Error(`Estado no válido: "${status}"`);
}
Comparación

IA 1: simple, clara, segura para principiantes

IA 2: más robusta (valida errores), más profesional

Ganador: IA 2

Caso 2 — Porcentaje de tareas completadas

Descripción:

Crea una función que calcule el porcentaje de tareas completadas.

Código generado por IA 1
function getCompletedPercentage(tasks) {
  if (!tasks.length) return 0;

  const completedCount = tasks.filter(task => task.completed === true).length;

  return (completedCount / tasks.length) * 100;
}
Código generado por IA 2
function getCompletionPercentage(tasks) {
  if (tasks.length === 0) return 0;

  const completed = tasks.filter(task => task.completed).length;
  return Math.round((completed / tasks.length) * 100);
}
Comparación

IA 1: correcta pero sin redondeo

IA 2: más usable en UI (resultado limpio)

Ganador: IA 2

Caso 3 — Búsqueda de tareas por texto

Descripción:

Crea una función que busque tareas por texto (case insensitive).

Código generado por IA 1
function searchTasks(tasks, searchText) {
  const query = searchText.toLowerCase();

  return tasks.filter(task =>
    task.text.toLowerCase().includes(query)
  );
}
Código generado por IA 2
function searchTasksByText(tasks, query) {
  if (!query.trim()) return tasks;

  const normalizedQuery = query.toLowerCase().trim();

  return tasks.filter(task =>
    task.title.toLowerCase().includes(normalizedQuery)
  );
}
Comparación

IA 1: simple pero frágil (no maneja edge cases)

IA 2: robusta (trim, validación)

Problema IA 2: cambia modelo (text → title)

Ganador: IA 2 (aunque con inconsistencia)


Conclusiones:
IA 1

Mejor para aprender

Más clara

Más precisa en algunos detalles técnicos

Mejores explicaciones paso a paso

IA 2

Mejor para producción

Código más robusto

Mejor manejo de errores

Más conocimiento práctico (performance, edge cases)