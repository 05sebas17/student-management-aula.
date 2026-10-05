# Guion sugerido — 9 minutos

La entrega solicita un video, no solo código. Graba cuando hayas completado la prueba en Docker y en la nube. No presentes esas etapas como realizadas si siguen pendientes.

| Tiempo | Qué explicar | Qué mostrar |
| --- | --- | --- |
| 0:00–0:45 | Problema y alcance: crear, consultar y listar estudiantes. | Interfaz de Aula. |
| 0:45–1:30 | Java/Spring Boot para API, Angular para interfaz y motivos. | README y estructura del proyecto. |
| 1:30–2:30 | Flujo controlador → servicio → repositorio, DTO y persistencia. | `StudentController`, `StudentService`, `StudentRepository` y migración SQL. |
| 2:30–3:40 | Tres endpoints, métodos, JSON y códigos 201/200/400/404/409. | Crear desde HTTP Client/Postman, guardar el UUID, consultar y listar. |
| 3:40–4:40 | Registro y consulta con interfaz, búsqueda y validaciones. | Registrar un estudiante ficticio y abrir su ficha; probar correo repetido. |
| 4:40–5:50 | Dockerfile por etapas: Maven compila, JRE ejecuta; puerto y usuario. | Dockerfile backend, Dockerfile frontend y Compose. |
| 5:50–7:00 | Construcción y ejecución local, persistencia y pruebas. | `docker compose up --build -d`, `docker compose ps`, curl y navegador. |
| 7:00–8:25 | Imagen en ECR y ejecución en ECS/Fargate. | Repositorio ECR, tarea en RUNNING, dirección pública y respuesta real de la API. |
| 8:25–9:00 | Organización, pruebas y resultado de la solución. | Pruebas pasando y resumen de los tres requisitos. |

## Evidencias a preparar

- Consola con `mvnw verify`, `npm run test:ci` y compilación.
- Capturas de interfaz, creación y consulta por ID.
- Dockerfile y salida de construcción sin errores.
- Contenedores saludables y solicitudes a la API dentro del contenedor.
- Endpoint público funcionando en AWS y tarea ECS en ejecución.

Utiliza nombres ficticios y correos `example.com`. Evita mostrar credenciales, tokens o `.env`. No necesitas leer cada línea de código: explica qué responsabilidad cumple cada parte y muestra el resultado.
