CONTEXTO DEL PROYECTO: S.I.R.E. (Sistema de Información y Registro de Emergencias)

1. Visión General del Producto
   S.I.R.E. es una plataforma HealthTech Open Source creada como respuesta a los sismos y crisis de infraestructura en Venezuela. Su propósito principal es mitigar el caos de información en las áreas de triaje de los hospitales públicos durante emergencias masivas. Reemplaza las listas de papel y las fotos en estados de WhatsApp por un directorio digital centralizado, rápido y seguro.

El sistema tiene dos caras estrictamente separadas:

Frente Médico (Privado): Para que el personal de salud ingrese y actualice el estado de los pacientes en segundos.

Frente Ciudadano (Público): Para que los familiares busquen el paradero de un ser querido ingresando únicamente su número de cédula, evitando que se aglomeren en las puertas de los hospitales.

2. Stack Tecnológico
   Frontend: Astro. Orientado a PWA para soportar conectividad intermitente. Lo más ligero posible

Backend: NestJS + TypeScript.

Base de Datos: MySQL (Relacional) usando TypeORM.

Seguridad: @nestjs/throttler (Rate limiting), JWT para autenticación, RBAC (Control de acceso basado en roles) estrictamente implementado mediante Guards.

3. Reglas de Negocio Inquebrantables (Core Rules)
   Al generar código para este proyecto, la IA debe respetar estrictamente estas directrices éticas y técnicas:

Fricción Cero en el Triaje: El formulario de ingreso de pacientes debe ser ultra minimalista (Cédula, Nombre, Estado (enum con estados de salud ESTABLE, CRÍTICO, CONTACTAR INMEDIATO, ETC), Centro Médico). No hay historiales médicos clínicos.

Aislamiento de Roles (RBAC estricto): El rol SuperAdmin SOLO gestiona cuentas de usuarios y el catálogo de hospitales. Tiene prohibido por sistema alterar o crear registros de pacientes. El rol Medico SOLO gestiona pacientes y no tiene acceso a la configuración del sistema.

Privacidad y Seguridad Física del Personal: El endpoint de búsqueda pública de pacientes NUNCA debe devolver el nombre o ID del usuario (médico/enfermero) que registró o actualizó la información. Esto protege al personal de represalias. Solo se expone el nombre del Centro de Salud y la última actualización sobre esa persona.

Trazabilidad y Auditoría (Bitácora): Un estado médico nunca se sobrescribe simplemente. Toda actualización del estado de un paciente genera un nuevo registro inmutable en una tabla de historial (patient_status_logs) vinculando al paciente, el nuevo estado, la fecha/hora y el usuario que hizo el cambio.

Prevención de Extorsión: El endpoint público de búsqueda (GET /api/search/:cedula) debe estar estrictamente protegido por Rate Limiting para evitar el barrido de datos (scraping) por actores malintencionados.

Catálogo de Centros Médicos (Data Maestra): Los médicos no escriben el nombre del hospital a mano. El sistema cuenta con una tabla medical_centers alimentada por un Seeder inicial (que cubrirá puntos críticos en Los Teques y Miranda para empezar, escalando luego a nivel nacional) y un CRUD administrable por el SuperAdmin. En el formulario, los médicos usan un select buscador (autocomplete) que consulta esta tabla.

Aislamiento de Datos por Médico: En su vista de tabla (Dashboard), un médico NO puede listar a todos los pacientes de Venezuela. Solo visualizará, mediante paginación, los pacientes que él mismo haya registrado O gestionado (actualizado). Sin embargo, puede usar un buscador global por cédula para localizar a un paciente de otro hospital y actualizar su estado.

4. Flujo de Alertas (Notificaciones background)
   Existe un flujo donde usuarios civiles registrados pueden agregar hasta 15 cédulas a una "lista de observación". Si un médico registra o actualiza a un paciente cuya cédula está en una de estas listas, el backend debe disparar un evento asíncrono para enviar una alerta por correo electrónico al civil suscrito. diciéndole que la persona de esa cédulas encuentra en X centro médico

📋 Casos de Uso - S.I.R.E.
(0) Navegación y Descubrimiento (Landing Page)
Actor: Cualquier usuario (Médico, Civil o Admin).
Objetivo: Comprender qué es la herramienta y ser dirigido a la acción correcta.

Acción Inicial: El usuario entra a la URL raíz y visualiza un Hero Section explicando el S.I.R.E.

Acciones Secundarias: Tiene a la vista el buscador principal (CU 2) y botones de enrutamiento: "Recibir alertas por correo si aparece alguien en específico" (CU 6), "Soy personal de salud" (CU 4) e "Iniciar Sesión" (CU 9).

(1) Registro y Actualización de Paciente (Flujo del Personal Médico)
Actor: Usuario con permisos (Médico, Paramédico, Enfermero) (PERFIL PERSONAL DE SALUD).
Objetivo: Ingresar o actualizar el estatus de un paciente en el sistema rápidamente.

Acción Inicial: El usuario hace clic en "Registrar", visualiza un formulario minimalista e ingresa la cédula.

Escenario A: La persona NO existe en la base de datos

El usuario llena el nombre completo.

Selecciona el estado de la persona desde una lista predefinida (Enum).

Selecciona el Centro de Salud usando un input tipo autocomplete que consulta la tabla maestra de centros médicos. (o escribe a mano)

Escenario B: La persona YA existe en la base de datos

El sistema autocompleta la información básica.

El usuario actualiza el estado de la persona (Enum).

Actualiza o confirma el Centro de Salud.

🔒 Detalle Técnico (Auditoría): Toda actualización genera un nuevo registro en la bitácora (quién, qué estado, cuándo).

(2) Búsqueda Pública de Paciente (Flujo del Público General)
Actor: Ciudadano / Familiar (Público, sin inicio de sesión).
Objetivo: Conocer el paradero y estado de salud de un ser querido mediante su documento de identidad.

Escenario A: La persona NO existe en la base de datos

El sistema retorna: "No hay información de esa persona hasta el momento".

Despliega Call to Action: "¿Quieres enterarte inmediatamente si ingresa a algún hospital?" (Lleva a los CU 6 y 3).

Escenario B: La persona YA existe en la base de datos

El sistema retorna la información pública: Estado de salud (Enum), Centro de salud actual y fecha de última actualización. (Omite el personal médico que lo registró). Muestra sólamente el último registro

(3) Configuración de Alertas por Cédula (Flujo de Ciudadano)
Actor: Ciudadano registrado (Sesión iniciada).
Objetivo: Recibir notificación automatizada por correo si un paciente específico es gestionado.

El usuario accede a "Mis Alertas".

Registra hasta un máximo de 15 cédulas.

Trigger: Si un médico ejecuta el CU (1) sobre una de esas cédulas, el sistema dispara un correo de alerta.

Nota: Los usuarios comunes deben poder registrarse con correo electrónico y nombre completo nada más, los doctores si tienen un flujo un poco más extenso

(4) Solicitud de Acceso Médico (Flujo de Validaciones)
Actor: Personal de Salud (Médicos, Paramédicos).
Objetivo: Solicitar credenciales oficiales para usar S.I.R.E.

El profesional llena un formulario institucional (Nombre, Cédula, Cargo, Contacto, Centro de Salud).

El sistema pone los datos en revisión; la cuenta nace inactiva.

(5) Gestión de Credenciales y Centros Médicos (Flujo de Administración)
Actor: Administrador del Sistema (SuperAdmin).
Objetivo: Aprobar accesos médicos y gestionar el catálogo de hospitales.

Visualiza solicitudes pendientes del CU (4), verifica externamente y aprueba el acceso.

Mantiene el CRUD de la tabla medical_centers (agregar, editar, o desactivar hospitales para que aparezcan en el buscador de los médicos).

(6) Registro de Ciudadano (Flujo del Público General)
Actor: Ciudadano / Familiar.
Objetivo: Crear cuenta básica para recibir alertas.

Proporciona Correo, Nombre y Contraseña.

Inicia sesión y es redirigido a "Mis Alertas" (y siempre tiene a la vista el buscador) (CU 3).

(7) Cambio / Recuperación de Contraseña (Flujo de Seguridad)
Actor: Cualquier usuario registrado.
Objetivo: Restablecer acceso.

Escenario A (Autenticado): Desde su perfil, cambia la contraseña manual.

Escenario B (No Autenticado): Solicita recuperación, recibe token por correo y define nueva clave.

(8) Tablero de Control y Gestión (Medical Dashboard)
Actor: Personal Médico con sesión iniciada.
Objetivo: Visualizar y gestionar la carga de pacientes.

El médico visualiza una tabla paginada EXCLUSIVAMENTE con los pacientes que él ha registrado o actualizado previamente.

Puede usar una barra de búsqueda global por cédula para localizar a cualquier paciente del país.

Al localizarlo (sea de su lista o del buscador), puede actualizar su estado mediante un modal rápido.

(9) Autenticación y Cierre de Sesión (Login / Logout)
Actor: Usuario registrado.
Objetivo: Acceso seguro mediante JWT y cierre de sesión destruyendo el token, con redirecciones basadas en el rol.

Nota: Para el seeder de centros médicos, lo vas a dejar con unos 3 de ejemplo, recordemos que el select que se va a popular con los mismos no debe colapsar la base de datos, yo me encargaré de popularlo con datos oficiales, SEGUNDO PUNTO IMPORTANTE, vamos a registrar también a las personas DESAPARECIDAS así que necesitamos ese estatus en el ENUM
