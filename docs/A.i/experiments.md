# Experimentos con IA en programación

## Objetivo
En este documento recojo una serie de experimentos comparando dos formas de trabajo:

1. resolver pequeños problemas de programación sin usar IA,
2. resolver esos mismos problemas con ayuda de IA.

Después repito la comparación con tres tareas reales relacionadas con el proyecto TaskFlow. El objetivo no es solo medir rapidez, sino también observar diferencias en calidad del código, comprensión del problema y utilidad práctica de la asistencia.

---

# Parte 1. Tres pequeños problemas de programación

## Metodología
Para cada problema seguí este proceso:

1. leí el enunciado,
2. resolví el problema manualmente sin ayuda de IA,
3. resolví después el mismo problema con ayuda de IA,
4. comparé:
   - tiempo invertido,
   - calidad del código,
   - comprensión del problema,
   - facilidad de mantenimiento.

Los tiempos son aproximados, porque el objetivo del experimento es comparativo, no una medición de laboratorio.

---

## Problema 1: contar palabras repetidas en un texto

### Enunciado
Crear una función que reciba un texto y devuelva cuántas veces aparece cada palabra, ignorando mayúsculas y signos básicos de puntuación.

---

### Solución sin IA
Primero pensé en los pasos:

- convertir el texto a minúsculas,
- eliminar signos de puntuación,
- separar por espacios,
- recorrer las palabras,
- acumular repeticiones en un objeto.

### Código sin IA
```javascript
function countWords(text) {
  const cleanedText = text
    .toLowerCase()
    .replace(/[.,!?;:]/g, "");

  const words = cleanedText.split(/\s+/);
  const result = {};

  for (const word of words) {
    if (!word) {
      continue;
    }

    if (result[word]) {
      result[word] += 1;
    } else {
      result[word] = 1;
    }
  }

  return result;
}
```

### Tiempo invertido sin IA
Aproximadamente 8 minutos.

### Valoración sin IA
La solución funciona y me ayudó a pensar bien el problema, pero tuve que decidir manualmente qué signos eliminar y revisar casos como espacios vacíos.

---

### Solución con IA
Usé un prompt pidiendo una función simple, clara y sin librerías externas.

### Código con IA
```javascript
function countWords(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});
}
```

### Tiempo invertido con IA
Aproximadamente 3 minutos.

### Comparación
- **Tiempo:** con IA fue más rápido.
- **Calidad del código:** la versión con IA quedó más compacta y más general al usar una expresión regular más robusta.
- **Comprensión:** sin IA entendí mejor cada paso; con IA tuve que revisar cuidadosamente la expresión regular para no aceptar algo que no entendiera del todo.
- **Conclusión:** la IA ayudó a optimizar la solución, pero la revisión manual fue necesaria para asegurar que realmente comprendía lo que hacía.

---

## Problema 2: ordenar una lista de objetos por fecha

### Enunciado
Dado un array de objetos con la forma `{ title, createdAt }`, ordenar de más reciente a más antiguo.

---

### Solución sin IA
Pensé directamente en usar `sort()` con objetos `Date`.

### Código sin IA
```javascript
function sortByNewest(items) {
  return [...items].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}
```

### Tiempo invertido sin IA
Aproximadamente 4 minutos.

### Valoración sin IA
Era un problema sencillo. Lo resolví rápido porque ya conocía el patrón.

---

### Solución con IA
Pedí a la IA una solución compatible con JavaScript moderno y sin modificar el array original.

### Código con IA
```javascript
function sortByNewest(items) {
  return [...items].sort(
    (firstItem, secondItem) =>
      new Date(secondItem.createdAt) - new Date(firstItem.createdAt)
  );
}
```

### Tiempo invertido con IA
Aproximadamente 2 minutos.

### Comparación
- **Tiempo:** ligera ventaja con IA.
- **Calidad del código:** ambas soluciones son prácticamente equivalentes.
- **Comprensión:** no hubo gran diferencia porque el problema ya era conocido.
- **Conclusión:** en problemas simples que ya domino, la IA ahorra muy poco. Su valor aquí está más en acelerar escritura que en aportar ideas nuevas.

---

## Problema 3: validar un campo de formulario

### Enunciado
Crear una función que valide un título con estas reglas:

- no puede estar vacío,
- no puede contener solo espacios,
- debe tener como máximo 50 caracteres.

---

### Solución sin IA
Primero convertí el problema en reglas simples y devolví mensajes claros.

### Código sin IA
```javascript
function validateTitle(title) {
  const cleanTitle = title.trim();

  if (!cleanTitle) {
    return "El título no puede estar vacío.";
  }

  if (cleanTitle.length > 50) {
    return "El título no puede tener más de 50 caracteres.";
  }

  return "";
}
```

### Tiempo invertido sin IA
Aproximadamente 6 minutos.

### Valoración sin IA
La función es clara y suficientemente buena para un proyecto pequeño.

---

### Solución con IA
Pedí una versión más escalable, con retorno estructurado.

### Código con IA
```javascript
function validateTitle(title) {
  const cleanTitle = title.trim();

  if (!cleanTitle) {
    return {
      isValid: false,
      message: "El título no puede estar vacío."
    };
  }

  if (cleanTitle.length > 50) {
    return {
      isValid: false,
      message: "El título no puede tener más de 50 caracteres."
    };
  }

  return {
    isValid: true,
    message: ""
  };
}
```

### Tiempo invertido con IA
Aproximadamente 3 minutos.

### Comparación
- **Tiempo:** con IA fue más rápido.
- **Calidad del código:** la versión con IA es más útil si luego quiero añadir más reglas o reutilizar la función.
- **Comprensión:** sin IA razoné mejor los requisitos; con IA obtuve una mejor estructura de salida.
- **Conclusión:** la IA fue útil no tanto por resolver el problema, sino por proponer una interfaz de validación más mantenible.

---

# Parte 2. Experimentos con tareas reales de TaskFlow

## Metodología
Repetí el mismo enfoque con tres tareas del proyecto TaskFlow:

1. revisión y refactorización de funciones,
2. incorporación de ordenación de tareas,
3. documentación y análisis de consistencia entre archivos.

En cada caso primero intenté resolver o plantear la solución por mi cuenta y después repetí la tarea usando IA como apoyo.

---

## Tarea 1: refactorizar `createTaskElement`

### Objetivo
Limpiar una función que generaba elementos del DOM mezclando clases utilitarias modernas con nombres de clase heredados de una hoja CSS antigua.

---

### Enfoque sin IA
Primero revisé manualmente:

- qué estructura generaba la función,
- qué clases parecían realmente usadas,
- cuáles eran legacy,
- si coincidían con `index.html` y con `style.css`.

Después propuse limpiar la función eliminando clases semánticas innecesarias como:

- `task-item`
- `task-card`
- `task-main`
- `task-actions`
- `task-label`
- `task-checkbox`

### Tiempo invertido sin IA
Aproximadamente 20 minutos.

### Resultado sin IA
Logré detectar el problema principal: el proyecto ya estaba funcionando visualmente con Tailwind y esas clases heredadas no aportaban nada real.

---

### Enfoque con IA
Pedí a la IA una revisión comparando `createTaskElement`, el HTML real y el CSS existente. Después pedí una versión refactorizada manteniendo:

- la estructura actual,
- el comportamiento,
- el enfoque Tailwind,
- sin introducir librerías.

### Tiempo invertido con IA
Aproximadamente 8 minutos.

### Comparación
- **Tiempo:** clara ventaja con IA.
- **Calidad del código:** con IA obtuve una versión más limpia y coherente con el proyecto actual.
- **Comprensión:** la revisión manual previa fue clave; sin ella habría sido fácil aceptar cambios sin entender por qué.
- **Conclusión:** en tareas de refactorización cruzada entre archivos, la IA acelera mucho, pero funciona mejor cuando ya hay una lectura crítica previa.

---

## Tarea 2: añadir ordenación de tareas

### Objetivo
Agregar una funcionalidad de ordenación por:

- más recientes primero,
- más antiguas primero,
- orden alfabético.

---

### Enfoque sin IA
Planteé manualmente qué debía cambiar:

- en `index.html`, añadir un `select`,
- en JavaScript, crear un estado `currentSort`,
- integrar el criterio dentro de `getFilteredTasks`,
- añadir un listener para actualizar el renderizado.

### Tiempo invertido sin IA
Aproximadamente 18 minutos.

### Resultado sin IA
El diseño de la solución fue correcto, pero redactarlo de forma completa y consistente en los tres archivos llevaba más tiempo.

---

### Enfoque con IA
Pedí a la IA que propusiera los cambios manteniendo:

- la estructura actual,
- el estilo de nombres del proyecto,
- sin librerías externas,
- respetando filtros y búsqueda existentes.

### Tiempo invertido con IA
Aproximadamente 7 minutos.

### Comparación
- **Tiempo:** con IA fue bastante más rápido.
- **Calidad del código:** la solución fue buena porque siguió el patrón ya existente (`currentFilter`, `currentSearch`, `setFilter`, `setSearch`).
- **Comprensión:** el problema ya estaba claro antes de usar IA, lo que hizo más fácil validar la propuesta.
- **Conclusión:** la IA fue especialmente útil para traducir un diseño ya pensado a cambios concretos en HTML, CSS y JavaScript.

---

## Tarea 3: documentar el flujo de trabajo y MCP

### Objetivo
Generar documentación clara sobre:

- uso de Cursor,
- refactorización apoyada por IA,
- configuración de MCP,
- pruebas realizadas sobre TaskFlow.

---

### Enfoque sin IA
Intenté redactar una estructura base con secciones, objetivos y conclusiones. El proceso fue más lento porque debía ordenar muchas ideas dispersas y convertirlas en texto coherente.

### Tiempo invertido sin IA
Aproximadamente 25 minutos.

### Resultado sin IA
La documentación era correcta, pero menos organizada y más costosa de producir.

---

### Enfoque con IA
Pedí a la IA textos estructurados para:

- README,
- memoria de prácticas,
- apartados explicativos,
- listas de pasos y consultas realizadas.

### Tiempo invertido con IA
Aproximadamente 10 minutos.

### Comparación
- **Tiempo:** gran ventaja con IA.
- **Calidad del texto:** con IA la redacción fue más ordenada y consistente.
- **Comprensión:** al redactar manualmente entendí mejor la secuencia real del trabajo; con IA obtuve mejor forma final.
- **Conclusión:** la IA fue muy útil para documentación técnica, siempre que el contenido base fuera real y revisado manualmente.

---

# Comparativa global

## Tiempo invertido
En los seis casos, la IA redujo el tiempo medio de trabajo, especialmente en:

- tareas de documentación,
- refactorizaciones con contexto de varios archivos,
- generación de código repetitivo o estructural.

La diferencia fue menor en problemas pequeños que ya sabía resolver fácilmente.

## Calidad del código
La IA tendió a producir:

- código más compacto,
- mejor estructurado,
- con nombres más consistentes,
- con soluciones más fáciles de reutilizar.

Sin embargo, en varios casos fue necesario revisar:

- expresiones regulares,
- supuestos sobre el proyecto,
- detalles del DOM,
- compatibilidad con la estructura real de TaskFlow.

## Comprensión del problema
Resolver primero sin IA tuvo una ventaja importante: obligó a entender el problema de verdad.

Cuando usé IA después de haber razonado yo antes:

- pude detectar errores más rápido,
- validé mejor las propuestas,
- evité aceptar soluciones solo porque “parecían correctas”.

Esta fue probablemente la conclusión más importante del experimento.

---

# Conclusiones finales

## Qué aporta la IA
La IA resulta especialmente útil para:

- acelerar refactorizaciones,
- proponer mejoras de estructura,
- documentar cambios,
- generar borradores de funciones,
- comparar archivos y detectar incoherencias.

## Qué no conviene delegar por completo
No conviene delegar totalmente en IA:

- la comprensión del problema,
- la validación de requisitos,
- la revisión final del código,
- la comprobación de compatibilidad con el proyecto real.

## Conclusión general
El experimento mostró que la mejor estrategia no es sustituir el razonamiento propio por IA, sino combinar ambas cosas:

1. entender primero el problema,
2. usar IA para acelerar la solución,
3. revisar manualmente el resultado antes de aceptarlo.

En un proyecto como TaskFlow, este enfoque permitió mejorar productividad sin perder control sobre la calidad ni sobre la comprensión del código.
