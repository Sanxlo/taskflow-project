Prompt engineering aplicado al desarrollo

Objetivo
En este documento recojo prompts útiles aplicados al desarrollo del proyecto TaskFlow. Los ejemplos cubren definición de rol, few-shot prompting, razonamiento paso a paso, restricciones claras y uso práctico para generar código, refactorizar funciones y documentar el proyecto.


1. Rol: desarrollador senior para revisión de código

Prompt**
```text
Actúa como un desarrollador frontend senior. Revisa este archivo de TaskFlow y detecta:
1. incoherencias entre HTML, CSS y JavaScript,
2. nombres de variables poco claros,
3. funciones demasiado largas,
4. validaciones ausentes,
5. riesgos de mantenimiento.

No reescribas todo desde cero. Propón mejoras incrementales y explica el motivo de cada una.
```

Por qué funciona bien:
Funciona porque fija un rol claro y marca un tipo de respuesta concreta: revisión crítica, no generación libre. Además, obliga a trabajar con mejoras graduales, lo que reduce respuestas exageradas o refactorizaciones innecesarias.

2. Rol + restricción: mantener estilo del proyecto

Prompt
```text
Actúa como un desarrollador senior especializado en refactorización de proyectos pequeños. Refactoriza esta función de TaskFlow manteniendo:
- la estructura actual,
- el estilo de nombres ya existente,
- compatibilidad con el HTML actual,
- sin librerías externas,
- sin eliminar funcionalidades.

Devuélveme primero una explicación breve de los cambios y después el código final.
```

Por qué funciona bien
El prompt acota muy bien el margen de maniobra. La IA no intenta rehacer el proyecto, sino mejorar una pieza respetando el contexto. Las restricciones evitan cambios incompatibles con el resto del código.

Uso recomendado
- refactorización puntual
- mejoras conservadoras
- mantenimiento de proyectos académicos

3. Few-shot prompting para validaciones

Prompt
```text
Quiero que sigas este patrón de validación:

Ejemplo 1:
Entrada: título vacío
Salida esperada: no crear tarea y mostrar mensaje de error

Ejemplo 2:
Entrada: título con solo espacios
Salida esperada: no crear tarea y mostrar mensaje de error

Ejemplo 3:
Entrada: título duplicado
Salida esperada: no crear tarea y mostrar mensaje de error

Ahora aplica el mismo criterio para refactorizar la función addTask de TaskFlow.
```

Por qué funciona bien
Los ejemplos concretos reducen ambigüedad. La IA entiende mejor la lógica esperada porque ve casos de entrada y salida antes de generar la solución. Esto suele mejorar mucho la consistencia en validaciones.

4. Few-shot prompting para estilo de respuesta técnica

Prompt
```text
Quiero una explicación siguiendo este estilo:

Ejemplo:
- Problema: la función mezcla responsabilidades.
- Riesgo: cuesta mantenerla.
- Mejora: separar filtrado y renderizado.

Ahora analiza la función getFilteredTasks de TaskFlow con ese mismo formato:
- Problema
- Riesgo
- Mejora
```

Por qué funciona bien
Aquí los ejemplos no enseñan código, sino formato de pensamiento y salida. Esto ayuda a obtener respuestas más uniformes y útiles para documentación técnica o memoria de prácticas.

Uso recomendado
- documentación
- informes de revisión
- explicación de refactorizaciones

5. Razonamiento paso a paso para detectar inconsistencias

Prompt
```text
Analiza TaskFlow paso a paso.
1. Revisa los IDs usados en JavaScript.
2. Comprueba si existen en index.html.
3. Revisa si las clases usadas en createTaskElement coinciden con style.css o con Tailwind.
4. Resume las inconsistencias encontradas.
5. Propón la solución más limpia.

No hagas cambios todavía. Solo analiza.
```

Por qué funciona bien
Pedir el análisis por pasos obliga a la IA a seguir una secuencia y reduce respuestas superficiales. Es especialmente útil cuando hay relaciones entre varios archivos y conviene separar observación y solución.

6. Razonamiento paso a paso para añadir una funcionalidad

Prompt
```text
Quiero añadir ordenación de tareas a TaskFlow. Razona paso a paso antes de escribir código:
1. qué debe cambiar en HTML,
2. qué debe cambiar en CSS,
3. qué debe cambiar en JavaScript,
4. cómo integrar la nueva funcionalidad sin romper búsqueda ni filtros,
5. qué nombres usar para mantener consistencia.

Después de ese análisis, genera el código final.
```

Por qué funciona bien
Funciona porque separa diseño e implementación. La IA no salta directamente al código, sino que primero piensa en el impacto por capas. Eso mejora bastante la calidad cuando una funcionalidad afecta a varios archivos.

7. Restricciones claras para respuestas más útiles

Prompt
```text
Refactoriza esta función cumpliendo estas restricciones:
- no uses librerías externas,
- no cambies los IDs del DOM,
- no cambies los nombres públicos de las funciones,
- no añadas complejidad innecesaria,
- devuelve una sola versión final,
- explica en 5 puntos qué mejoraste.
```

Por qué funciona bien
Las restricciones claras reducen el ruido y evitan soluciones demasiado creativas pero poco prácticas. También ayudan a obtener una respuesta más fácil de aplicar directamente en el proyecto.

## 8. Prompt para JSDoc y documentación interna

**Prompt**
```text
Añade comentarios JSDoc a estas funciones de TaskFlow:
- loadTasks
- saveTasks
- createTask
- getFilteredTasks
- createTaskElement

Reglas:
- escribe la documentación en español,
- describe parámetros y retorno,
- no cambies la lógica del código,
- mantén un tono técnico y claro.
```

Por qué funciona bien
El prompt define exactamente qué documentar y qué no tocar. Eso evita que la IA mezcle documentación y refactorización, algo bastante común cuando la instrucción es demasiado abierta.


## 9. Prompt para generar README o memoria técnica

**Prompt**
```text
Actúa como redactor técnico. A partir de estos cambios en TaskFlow, redacta un README claro en español que incluya:
- objetivo,
- cambios realizados,
- archivos modificados,
- cómo probar la funcionalidad,
- conclusión.

No inventes pasos que no aparezcan en la información que te doy.
```

Por qué funciona bien
Es un prompt muy útil para transformar trabajo técnico en documentación comprensible. La restricción de no inventar información mejora la fiabilidad del resultado y evita README demasiado genéricos.

10. Prompt para revisión manual de código generado

Prompt
```text
He usado IA para generar este código. Quiero que ahora actúes como revisor humano exigente.
Haz una revisión final y dime:
1. qué partes son correctas,
2. qué partes podrían romper el proyecto,
3. qué nombres son confusos,
4. qué casos borde no están cubiertos,
5. si aceptarías este cambio en un proyecto real y por qué.
```

Por qué funciona bien
Este prompt cambia el objetivo: ya no pide generar, sino auditar críticamente. Es muy valioso porque fuerza una segunda pasada de control de calidad antes de aceptar cambios.

## 11. Prompt para simplificar funciones largas

**Prompt**
```text
Simplifica esta función de TaskFlow sin cambiar su comportamiento observable.
Objetivos:
- menos repetición,
- mejor legibilidad,
- mismos resultados,
- mismo flujo general del proyecto.

Antes de dar el código, indica qué partes repetitivas has detectado.
```

Por qué funciona bien
La expresión “sin cambiar su comportamiento observable” centra la refactorización en estructura, no en lógica. Eso es ideal cuando el código ya funciona pero cuesta mantenerlo.

## 12. Prompt para comparar dos enfoques técnicos

Prompt
```text
Compara estas dos opciones para TaskFlow:
A) seguir con Tailwind como sistema principal,
B) volver a depender de style.css como fuente principal de estilos.

Quiero una comparación práctica con:
- ventajas,
- desventajas,
- impacto en mantenimiento,
- impacto en coherencia del proyecto,
- recomendación final razonada.
```

Por qué funciona bien:
Pedir una comparación estructurada ayuda a tomar decisiones de arquitectura pequeñas sin caer en respuestas vagas. Además, obliga a justificar la recomendación final.


Conclusión:
Estos prompts funcionan bien porque no se limitan a pedir “hazlo”, sino que añaden contexto, rol, ejemplos, restricciones o secuencias de análisis. En desarrollo, eso suele producir respuestas más útiles, más seguras y más fáciles de integrar en un proyecto real como TaskFlow.
