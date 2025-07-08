# Sistema de Fichas Bibliográficas - Hackathon

## Descripción del Proyecto
Sistema web para gestionar fichas bibliográficas desarrollado para Alonso Cueto Caballero. Permite registrar, organizar, editar, eliminar, buscar y filtrar fichas de diferentes tipos de documentos: libros, artículos, tesis, videos, periódicos y repositorios universitarios.

## Características Implementadas

### ✅ Backend (6 puntos)
- **6 campos bien identificados**: ID, tipo_documento, autor, titulo, año_publicacion, editorial, numero_edicion, numero_paginas, tema, fecha_agregada, estado
- **Tipos de datos**: String, Integer, LocalDate, Boolean
- **Tabla maestra**: fichas con inserción y listado (Activos/Inactivos)
- **Actualización y eliminado lógico**: Estados activo/inactivo
- **4 restricciones**: PK, Unique, Default, Check constraints
- **Operaciones CRUD**: Create, Read, Update, Delete (lógico y físico)
- **Filtros**: Por fecha agregada, tema, autor, tipo de documento
- **Búsquedas**: Postman ready endpoints
- **Reportes**: JasperReports backend (PDF generation)

### ✅ Frontend (10 puntos - Para implementar)
- **Campos variables**: Formulario adaptativo según tipo de documento
- **Filtros**: 2+ filtros (fecha, tema, autor)
- **Búsquedas**: Por tema y autor
- **Listado**: Con Angular
- **CRUD completo**: Crear, actualizar, eliminar
- **Validaciones**: 4+ tipos de validaciones funcionales
- **Reportes frontend**: Jasper Reports integration

## Tecnologías Utilizadas

### Backend
- **Spring Boot 3.5.3**
- **Spring Data JPA**
- **SQL Server**
- **Lombok**
- **JasperReports 6.20.6**
- **Bean Validation**

### Base de Datos
- **SQL Server**
- **Tabla**: fichas
- **Script**: hackaton.sql incluido

## Estructura del Proyecto

```
src/
├── main/
│   ├── java/
│   │   └── vg/leonardo/huaman/hackathon/
│   │       ├── model/           # Entidades JPA
│   │       ├── repository/      # Repositorios Spring Data
│   │       ├── service/         # Lógica de negocio
│   │       ├── rest/           # Controladores REST
│   │       └── dto/            # Data Transfer Objects
│   └── resources/
│       ├── reports/            # Archivos JasperReports (.jrxml)
│       └── application.yml     # Configuración
└── hackaton.sql               # Script de base de datos
```

## Configuración

### Base de Datos
1. Ejecutar el script `hackaton.sql`
2. Configurar `application.yml` con tus credenciales:

```yaml
spring:
  datasource:
    url: jdbc:sqlserver://localhost:1433;databaseName=hackaton;encrypt=true;trustServerCertificate=true
    username: SA
    password: Admin123_
  jpa:
    hibernate:
      ddl-auto: none  # Usar 'none' para usar el script SQL
```

### Dependencias Maven
El `pom.xml` incluye:
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Validation
- JasperReports
- MS SQL Server JDBC Driver
- Lombok

## API Endpoints

### Fichas - Versión 1 (Básica)
- `GET /api/fichas` - Listar todas las fichas
- `GET /api/fichas/activas` - Listar fichas activas
- `GET /api/fichas/{id}` - Obtener ficha por ID
- `POST /api/fichas` - Crear nueva ficha
- `PUT /api/fichas/{id}` - Actualizar ficha
- `DELETE /api/fichas/logical/{id}` - Eliminado lógico
- `DELETE /api/fichas/physical/{id}` - Eliminado físico

### Fichas - Versión 2 (Con validaciones)
- `GET /api/v2/fichas` - Listar todas (con DTOs)
- `POST /api/v2/fichas` - Crear con validaciones
- `PUT /api/v2/fichas/{id}` - Actualizar con validaciones

### Búsquedas y Filtros
- `GET /api/fichas/tema/{tema}` - Buscar por tema
- `GET /api/fichas/autor/{autor}` - Buscar por autor
- `GET /api/fichas/tipo/{tipo}` - Buscar por tipo
- `GET /api/fichas/fecha?fechaInicio=2024-01-01&fechaFin=2024-12-31` - Filtrar por fecha
- `GET /api/fichas/filtros?tema=X&autor=Y&tipoDocumento=Z` - Filtros múltiples

### Reportes (JasperReports)
- `GET /api/reportes/fichas` - Reporte general (PDF)
- `GET /api/reportes/fichas/tipo/{tipo}` - Reporte por tipo (PDF)

## Ejemplos de Uso

### Crear Ficha (Libro)
```json
POST /api/v2/fichas
{
    "tipoDocumento": "libro",
    "autor": "Alonso Cueto",
    "titulo": "La hora azul",
    "añoPublicacion": 2005,
    "editorial": "Planeta",
    "numeroEdicion": "1ra",
    "numeroPaginas": 256,
    "tema": "Narrativa peruana"
}
```

### Crear Ficha (Video - Campos limitados)
```json
POST /api/v2/fichas
{
    "tipoDocumento": "video",
    "autor": "César Vallejo",
    "titulo": "Poética y sociedad",
    "añoPublicacion": 2023,
    "tema": "Poesía social"
}
```

### Búsqueda con Filtros
```
GET /api/fichas/filtros?tema=literatura&fechaInicio=2024-01-01&fechaFin=2024-12-31
```

## Validaciones Implementadas

1. **Campos obligatorios**: autor, titulo, tema, tipoDocumento
2. **Restricción de tipos**: Solo valores permitidos para tipoDocumento
3. **Validación de año**: Entre 1000 y año actual
4. **Longitud de campos**: Límites mínimos y máximos
5. **Validación condicional**: Campos según tipo de documento

## Características Especiales

### Campos Variables por Tipo
- **Libro/Artículo/Tesis**: Todos los campos disponibles
- **Video/Periódico/Repositorio**: Solo campos básicos (autor, titulo, año, tema)

### Eliminado Lógico vs Físico
- **Lógico**: Cambia estado a `false`, mantiene el registro
- **Físico**: Elimina permanentemente de la base de datos

### Reportes PDF
- Generación automática con JasperReports
- Reporte general y por tipo de documento
- Accesible vía endpoints REST

## Próximos Pasos (Frontend)

1. **Angular Frontend**: Implementar interfaz de usuario
2. **Formularios dinámicos**: Campos variables según tipo
3. **Tablas de datos**: Con filtros y búsquedas
4. **Integración de reportes**: Visualización de PDFs
5. **Validaciones frontend**: Sincronizadas con backend

## Autor
Proyecto desarrollado para hackathon - Sistema de gestión bibliográfica para Alonso Cueto Caballero.

---

## Comandos Útiles

### Ejecutar la aplicación
```bash
mvn spring-boot:run
```

### Compilar
```bash
mvn clean install
```

### Ejecutar tests
```bash
mvn test
```

**Base URL**: `http://localhost:8080`
**Documentación API**: Endpoints listados arriba
**Script SQL**: Incluido en raíz del proyecto
