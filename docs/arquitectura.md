# Decisiones de arquitectura

## Un repositorio, dos aplicaciones

Backend y frontend se compilan de forma independiente. Los archivos de infraestructura, pruebas y documentación están junto al código. No se requieren configuraciones privadas de un IDE ni se agregan carpetas vacías para arquitecturas innecesarias.

## Backend organizado por funcionalidad

`student` reúne la funcionalidad completa. Dentro hay capas de responsabilidad clara:

1. `StudentController` recibe HTTP, valida el DTO y devuelve los códigos y cabeceras correspondientes.
2. `StudentService` aplica reglas de negocio y delimita transacciones.
3. `StudentRepository` usa Spring Data JPA para acceder a la base.
4. `Student` representa la tabla; no se expone directamente en respuestas HTTP.
5. Los DTO inmutables (`record`) separan el contrato público de la persistencia.

La inyección se realiza por constructor. No hay estado mutable compartido en servicios ni controladores, setters innecesarios o un repositorio en memoria no seguro. Se usa `UUID` como identificador. El correo se normaliza antes de validar y guardar; una restricción única en la base evita duplicados incluso con solicitudes simultáneas.

Flyway crea el esquema mediante SQL versionado. Hibernate **valida**, no modifica automáticamente tablas existentes. `open-in-view=false` mantiene las operaciones de persistencia dentro de servicios. El listado tiene orden determinista.

Las excepciones se traducen a `ProblemDetail`. Errores de validación incluyen `errors` por campo. Las excepciones inesperadas se registran en el servidor y producen una respuesta pública genérica. No se agrega una interfaz de servicio con una sola implementación sin una necesidad real.

## Frontend organizado por funcionalidad

`features/students` contiene página, formulario, servicio HTTP y modelos. `core/http` contiene lógica realmente transversal. No se agrega una carpeta `shared` vacía: se incorpora si aparecen componentes reutilizados entre funcionalidades.

Los componentes son standalone y usan `OnPush`. La página administra estado con signals, deriva los resultados mediante `computed` y cancela suscripciones al destruirse. El formulario usa Reactive Forms y comunica eventos, sin llamar directamente a la API. El servicio HTTP utiliza tipos explícitos. Los estilos de cada componente viven junto a su plantilla; los controles, variables y reglas comunes están en `styles.css`.

Los diálogos HTML nativos gestionan foco y navegación por teclado; hay etiquetas, estados de error, mensajes accesibles y respeto por movimiento reducido. La tabla se desplaza horizontalmente dentro de su contenedor en pantallas pequeñas. No hay datos ficticios mezclados con datos reales ni fuentes externas necesarias para renderizar la interfaz.

## Conexión frontend → backend

```text
Navegador → /api/students → proxy Angular (desarrollo) o Nginx (Docker)
                              ↓ elimina /api
                        Spring Boot /students → servicio → JPA → base de datos
```

Se evita habilitar CORS global con `*`: el navegador trabaja con un único origen. `API_UPSTREAM` permite ajustar el destino de Nginx al iniciar el contenedor, sin recompilar Angular. Las credenciales de base de datos se reciben mediante variables de entorno.

## Alcance y siguientes pasos

Es una aplicación académica pequeña, con una arquitectura profesional proporcional al problema. Para usar datos reales o un despliegue estable se añadirían autenticación, autorización, HTTPS, copias de seguridad, paginación y una base externa administrada. La plantilla AWS utiliza almacenamiento efímero deliberadamente para una demostración; no es una configuración de producción.
