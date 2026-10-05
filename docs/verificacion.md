# Verificación de la entrega

Fecha: 3 de octubre de 2026 (America/New_York).

## Verificado

- API Spring Boot: **8 pruebas de integración aprobadas**, con HTTP simulado, servicio real, JPA, Flyway y base H2 aislada.
- Angular: **6 pruebas aprobadas**, navegación accesible, servicio HTTP, datos enviados, campos inválidos y normalización del formulario.
- Navegador Microsoft Edge con Playwright: **2 escenarios completos aprobados**. Registro real, validación de campos, búsqueda, consulta individual, rechazo de duplicados, búsqueda sin resultados, vista móvil de 390 px sin desbordamiento de página y recuperación tras fallo de API.
- Compilación de producción de Angular y empaquetado del JAR ejecutable.
- Ejecución local de Spring Boot y Angular conectados mediante proxy.
- Sintaxis de Compose validada con `docker compose --env-file .env.example config --quiet` (no requiere motor).
- Comprobación posterior: imágenes construidas y los tres contenedores (Spring Boot, Nginx/Angular y PostgreSQL) en estado `healthy`. La API respondió `{"status":"UP"}` y el proxy `/api/students` devolvió correctamente el listado vacío de la nueva base PostgreSQL. Las 8 pruebas del backend también pasaron durante la construcción con Java 21.
- Se corrigió `package-lock.json` agregando las entradas ausentes de `@emnapi/core` y `@emnapi/runtime`; `npm ci` y la compilación Angular completaron correctamente en Linux.

La verificación local utiliza Java 25.0.2 (código compilado para Java 21), Node 24.11.1 y Maven 3.9.11. Las imágenes Docker y la automatización de GitHub usan Java 21. No se ha ejecutado todavía la automatización en GitHub.

## Pendiente

- Completar la demostración de registro y consulta desde el navegador conectado a Docker y guardar las capturas para el video.
- Desplegar y verificar en AWS: no se creó ningún recurso. La plantilla y las instrucciones requieren completar los datos de una cuenta autorizada.
- Grabar el video final (máximo 10 minutos) con las evidencias de Docker y nube.

Las capturas incluidas muestran la aplicación **local**, con estudiantes ficticios creados para las pruebas. No son evidencia de AWS.
