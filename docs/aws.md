# Despliegue posterior en AWS — demostración académica

Este procedimiento y la plantilla están preparados, **no desplegados ni verificados en una cuenta AWS**. Requieren una cuenta autorizada, AWS CLI, Docker funcionando y permisos sobre ECR/ECS/IAM/CloudWatch/VPC. Crear esos recursos puede generar cargos; elimina los de esta demostración cuando termines.

## 1. Preparar imágenes en ECR

Desde la raíz, en PowerShell. Autentícate primero con tu perfil de AWS (por ejemplo mediante `aws configure sso` y `aws sso login`). No guardes claves en el proyecto.

```powershell
$region = 'us-east-1'
$accountId = aws sts get-caller-identity --query Account --output text
$registry = "$accountId.dkr.ecr.$region.amazonaws.com"

aws ecr create-repository --repository-name aula-api --region $region
aws ecr create-repository --repository-name aula-web --region $region
aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $registry

docker build --platform linux/amd64 -t "${registry}/aula-api:1.0.0" ./backend
docker build --platform linux/amd64 -t "${registry}/aula-web:1.0.0" ./frontend
docker push "${registry}/aula-api:1.0.0"
docker push "${registry}/aula-web:1.0.0"
```

Ejecuta los pasos en orden y detente si uno falla. Si los repositorios ya existen, reutilízalos y omite su creación. En [la guía oficial de ECR](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html) se describe la autenticación, etiquetado y envío de imágenes.

## 2. Preparar ECS

En AWS, crea o utiliza un rol `ecsTaskExecutionRole` con confianza para `ecs-tasks.amazonaws.com` y la política administrada `AmazonECSTaskExecutionRolePolicy`. El rol permite descargar imágenes y enviar registros. Consulta [la documentación oficial del rol de ejecución](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html).

```powershell
aws logs create-log-group --log-group-name /ecs/aula-students-demo --region $region
aws logs put-retention-policy --log-group-name /ecs/aula-students-demo --retention-in-days 7 --region $region
aws ecs create-cluster --cluster-name aula-demo --region $region
```

Si el grupo o clúster ya existe, reutilízalo. Copia `infra/aws/task-definition.example.json` a `infra/aws/task-definition.local.json` (excluido de Git). Sustituye `ACCOUNT_ID` y `REGION` y verifica que el ARN del rol sea el correcto. Registra la definición:

```powershell
aws ecs register-task-definition --cli-input-json file://infra/aws/task-definition.local.json --region $region
```

Esta definición ejecuta ambos contenedores en la misma tarea: backend en 8081 y frontend en 8080. Nginx se comunica con `127.0.0.1:8081`; el navegador utiliza `/api/students`. Se usa red `awsvpc`, necesaria para Fargate; consulta [los parámetros oficiales](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html).

**Persistencia de esta plantilla:** usa H2 en memoria para una demostración, permitido por el enunciado. Los estudiantes se pierden cuando se reemplaza o detiene la tarea. Para uso estable, configura PostgreSQL externo (por ejemplo RDS) mediante `DB_URL`, `DB_USERNAME` y `DB_PASSWORD`; entrega la contraseña con Secrets Manager y permisos mínimos. No ejecutes réplicas con bases H2 separadas.

## 3. Ejecutar la tarea en Fargate

En la consola ECS, dentro de `aula-demo`, selecciona **Run task**, la definición registrada, Fargate y una tarea. Selecciona:

- Una VPC y una subred pública con ruta `0.0.0.0/0` a un Internet Gateway.
- Asignación de IP pública habilitada para la demostración.
- Un grupo de seguridad de la demostración: entrada TCP **8080 solo desde tu IP pública /32**. No abras 8081, base de datos ni todos los puertos.
- Salida que permita descargar imágenes, enviar logs y resolver DNS.

Espera a `RUNNING` y a que ambos contenedores estén saludables. En la interfaz de red de la tarea busca su IP pública. Es una IP temporal: puede cambiar al recrearla. Si no inicia, revisa el motivo de parada y CloudWatch Logs; verifica imágenes, rol, red y puertos.

## 4. Evidencia real

Abre `http://IP_PUBLICA:8080`, registra un estudiante ficticio y consulta su ficha. En PowerShell:

```powershell
curl.exe http://IP_PUBLICA:8080/api/students
curl.exe http://IP_PUBLICA:8080/api/students/UUID_REAL
```

Captura la respuesta, la interfaz y la tarea funcionando para el video. No presentes una captura local como prueba de AWS. Para una aplicación pública permanente utiliza un servicio ECS, balanceador, HTTPS y autenticación; esta plantilla no implementa esos componentes.

## 5. Cerrar la demostración

Detén la tarea. Si creaste servicios, reduce/elimina los de esta actividad. Elimina únicamente recursos propios que ya no necesites: repositorios e imágenes ECR, grupo de logs, clúster vacío y grupo de seguridad. No borres recursos compartidos. Revisa la consola de facturación después de retirar los recursos.
