# Actividad_Area_Sistemas_Magic_Leaf_Studios_1

**MAGIC LEAF STUDIOS**

**ÁREA DE TECNOLOGÍA, SOPORTE Y CIBERSEGURIDAD**

*Infraestructura, soporte técnico, versiones y seguridad.*

**Responsable: Director de Sistemas**

**¿Por qué esta área?**

El área de Sistemas habilita y protege la operación tecnológica de Magic Leaf Studios: administra la infraestructura y los equipos, controla versiones con GitLab, respalda datos, despliega el juego, atiende soporte y protege la información del estudio.

**Actividades:**

- Gestión de infraestructura y equipos (laptops, redes).

- Administración del repositorio y control de versiones (GitLab).

- Respaldo y recuperación de datos (backup).

- Seguridad informática y ciberseguridad.

- Despliegue, integración continua y monitoreo.

- Soporte técnico y mesa de ayuda.

- Gestión de licencias y suscripciones.

**Especificación: Actividad 1**

**Gestión de infraestructura y equipos (laptops, redes)**

**Definición: **La gestión de infraestructura administra equipos (4 laptops de 5 000 Bs), servicios de internet y el entorno de trabajo del estudio.

**Objetivo: **Garantizar que todos los equipos y servicios funcionen de forma continua y estable.

**Análisis SMART:**

**Específico.- **Mantiene inventario de equipos, servicios y capacidades.

**Medible.- **Disponibilidad ≥99% de servicios y equipos operativos.

**Alcanzable.- **Se usa el inventario y monitoreo del Análisis de Costos.

**Real.- **Sin infraestructura confiable no hay desarrollo posible.

**Tiempo.- **Revisión y mantenimiento mensual.

**Procesos:**

- Inventariar equipos (laptops, periféricos).

- Controlar servicios (internet, hosting, GitLab).

- Ejecutar mantenimiento preventivo.

- Atender fallas de hardware o red.

- Registrar cambios en el inventario.

**Actores:**

- Director de Sistemas

- Todo el equipo

**Recursos:**

- Inventario de equipos

- Contratos de servicios

- Kit de repuestos

**Tecnología:**

- Sheets de inventario

- Herramientas de monitoreo

- VPN para teletrabajo

**Especificación: Actividad 2**

**Administración del repositorio y control de versiones (GitLab)**

**Definición: **La administración del repositorio gestiona GitLab con ramas, revisión de código (MR) y acceso por usuario para el equipo del estudio.

**Objetivo: **Mantener el código y los assets de BREAKTHROUGH versionados, organizados y con trazabilidad.

**Análisis SMART:**

**Específico.- **Organiza repositorios, ramas y permisos de acceso por rol.

**Medible.- **100% de cambios pasan por revisión y CI antes de integrarse.

**Alcanzable.- **GitLab Premium (5 usuarios, 1 009 Bs/mes) ya está en costos.

**Real.- **El control de versiones es imprescindible para trabajar en equipo.

**Tiempo.- **Política de ramas establecida; revisión en cada sprint.

**Procesos:**

- Crear y organizar repositorios por proyecto y asset.

- Definir ramas (main, develop, feature).

- Configurar merge requests y revisiones.

- Automatizar verificación (CI).

- Gestionar permisos por perfil.

**Actores:**

- Director de Sistemas

- Programadores

- Director de Producción

**Recursos:**

- GitLab Premium

- Repositorios del proyecto

- Política de ramas

**Tecnología:**

- GitLab

- Git CLI / IDE

- GitLab CI

**Especificación: Actividad 3**

**Respaldo y recuperación de datos (backup)**

**Definición: **El respaldo de datos protege el código, los assets y la documentación mediante copias de seguridad espejadas y recuperables.

**Objetivo: **Garantizar que no se pierda trabajo ante fallas, robos o ciberataques.

**Análisis SMART:**

**Específico.- **Respaldo diario de código/assets y semanal de documentación.

**Medible.- **Restauración probada al 100%; RTO ≤1 día para código.

**Alcanzable.- **Respaldos automáticos en la nube y regla 3-2-1.

**Real.- **Perder assets o código puede detener el proyecto semanas.

**Tiempo.- **Respaldo diario automático y prueba de restauración mensual.

**Procesos:**

- Definir qué respaldar (código, assets, docs).

- Configurar respaldo automático.

- Verificar integridad de los respaldos.

- Probar restauración mensualmente.

- Documentar el procedimiento de recuperación.

**Actores:**

- Director de Sistemas

- Director de Producción

- Gerente Financiero (docs)

**Recursos:**

- Nube de respaldo

- Política de respaldo

- Runbook de recuperación

**Tecnología:**

- GitLab (codigo)

- Drive/Dropbox (assets)

- Scripts de backup

**Especificación: Actividad 4**

**Seguridad informática y ciberseguridad**

**Definición: **La seguridad informática protege cuentas, equipos y datos del estudio frente a accesos no autorizados y ciberataques.

**Objetivo: **Reducir el riesgo de filtración, ransomware o pérdida de propiedad intelectual.

**Análisis SMART:**

**Específico.- **Implementa autenticación reforzada, antivirus y control de accesos.

**Medible.- **0 incidentes de seguridad críticos; 2FA activa en el 100% de cuentas.

**Alcanzable.- **Se priorizan medidas de alto impacto y bajo costo.

**Real.- **Los estudios indie son objetivo frecuente de ataques.

**Tiempo.- **Revisión de seguridad trimestral y respuesta inmediata a alertas.

**Procesos:**

- Activar 2FA en todas las cuentas.

- Configurar antivirus y cifrado de disco.

- Restringir accesos por rol y principio de mínimo privilegio.

- Capacitar al equipo en phishing e higiene.

- Monitorear alertas y responder incidentes.

**Actores:**

- Director de Sistemas

- Todo el equipo

**Recursos:**

- Herramientas de seguridad

- Política de seguridad

- Runbook de incidentes

**Tecnología:**

- 2FA/Autenticadores

- Antivirus/EDR

- Cifrado de disco

- VPN

**Especificación: Actividad 5**

**Despliegue, integración continua y monitoreo**

**Definición: **El despliegue e integración continua (CI/CD) automatiza la construcción, pruebas y publicación del juego y sus builds.

**Objetivo: **Detectar errores temprano y entregar builds estables de BREAKTHROUGH a Producción.

**Análisis SMART:**

**Específico.- **Instala CI/CD para builds y pruebas automatizadas.

**Medible.- **Builds automáticos con índice de fallo por prueba reportado.

**Alcanzable.- **Se usa GitLab CI integrado a la suscripción existente.

**Real.- **La automatización reduce errores de integración y acelera el ciclo.

**Tiempo.- **Pipeline configurado y en uso en cada sprint.

**Procesos:**

- Definir etapas del pipeline (build, test, package).

- Configurar GitLab CI.

- Ejecutar pruebas automáticas.

- Generar y versionar builds.

- Reportar resultados a Producción.

**Actores:**

- Director de Sistemas

- Programadores

- Director de Producción

**Recursos:**

- GitLab CI

- Servidor de build

- Framework de pruebas

**Tecnología:**

- GitLab CI/CD

- Unity Cloud Build o similar

- Testing framework

**Especificación: Actividad 6**

**Soporte técnico y mesa de ayuda**

**Definición: **El soporte técnico atiende las incidencias del equipo con sus equipos, cuentas y herramientas de trabajo.

**Objetivo: **Resolver rápidamente problemas técnicos para no frenar el desarrollo.

**Análisis SMART:**

**Específico.- **Mesa de ayuda para equipos, cuentas y herramientas.

**Medible.- **SLA: respuesta en el día; resolución de incidencias críticas ≤24 h.

**Alcanzable.- **Proceso de tickets con prioridades.

**Real.- **Incidencias atascan a personas clave del desarrollo.

**Tiempo.- **Atención continua con revisión semanal de tickets.

**Procesos:**

- Registrar la incidencia (ticket).

- Clasificar por prioridad y asignar.

- Diagnosticar y resolver.

- Verificar la solución con el usuario.

- Cerrar y documentar el caso.

**Actores:**

- Director de Sistemas

- Todo el equipo

**Recursos:**

- Board de tickets

- Guía de solución de problemas

- Inventario de equipos

**Tecnología:**

- Herramienta de tickets

- Escritorio remoto

- Base de conocimiento

**Especificación: Actividad 7**

**Gestión de licencias y suscripciones**

**Definición: **La gestión de licencias administra suscripciones y licencias de software (GitLab, Unity, herramientas) para optimizar el gasto.

**Objetivo: **Mantener el software legal y vigente sin exceder el presupuesto de operación.

**Análisis SMART:**

**Específico.- **Lleva registro de licencias, vencimientos y costos por herramienta.

**Medible.- **0 licencias vencidas no planificadas; costos dentro del Análisis de Costos.

**Alcanzable.- **Control centralizado de suscripciones (GitLab y otras).

**Real.- **El software legal evita riesgos y optimiza el presupuesto.

**Tiempo.- **Revisión mensual de vencimientos y costos.

**Procesos:**

- Inventariar licencias y suscripciones.

- Controlar vencimientos y renovaciones.

- Evaluar necesidad y uso de cada herramienta.

- Optimizar planes y cancelar innecesarias.

- Reportar costos al CFO.

**Actores:**

- Director de Sistemas

- Gerente Financiero

**Recursos:**

- Registro de licencias

- Análisis de Costos

- Facturas de suscripción

**Tecnología:**

- Sheets de licencias

- Panel de proveedores

- Correo

**Cronograma y Asignación de Recursos**

Asignación de tiempos y recursos por actividad (formato listo para importar a Smartsheet).

| **Actividad** | **Responsable** | **Inicio** | **Fin** | **Duración** | **Recursos clave** |
| --- | --- | --- | --- | --- | --- |
| 1. Infraestructura y equipos | Sistemas | Mensual | — | Mensual | Inventario, monitoreo |
| 2. Repositorio GitLab | Sistemas | Continuo | — | Sprint | GitLab Premium |
| 3. Backup y recuperación | Sistemas | Diario | — | Mensual | Respaldo en la nube |
| 4. Seguridad informática | Sistemas | Trimestral | — | Trimestral | 2FA, antivirus |
| 5. CI/CD y monitoreo | Sistemas | Continuo | — | Sprint | GitLab CI |
| 6. Soporte técnico | Sistemas | Continuo | — | Semanal | Tickets, base de ayuda |
| 7. Licencias y suscripciones | Sistemas + CFO | Mensual | — | Mensual | Registro, facturas |
