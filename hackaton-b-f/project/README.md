# Sistema de Biblioteca Digital

## Descripción

Sistema de gestión de fichas bibliográficas desarrollado con Angular 19 y Angular Material. Permite registrar, consultar, editar y eliminar fichas de diferentes tipos de documentos académicos.

## Características

### ✨ Funcionalidades Principales
- **Gestión de Fichas**: Crear, editar, eliminar y consultar fichas bibliográficas
- **Tipos de Documento**: Soporte para 6 tipos:
  - 📚 Libros
  - 📄 Artículos
  - 🎓 Tesis
  - 🎥 Videos
  - 📰 Periódicos
  - 🏛️ Repositorios
- **Interfaz Moderna**: UI construida con Angular Material
- **Búsqueda y Filtros**: Buscar por título, autor, tema, tipo de documento
- **Responsive**: Diseño adaptativo para móviles y escritorio

### 🛠️ Tecnologías Utilizadas
- **Frontend**: Angular 19.2.14
- **UI**: Angular Material 19.2.14
- **Estilos**: SCSS
- **Formularios**: Reactive Forms
- **Routing**: Angular Router
- **HTTP**: HttpClient para comunicación con API

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── interfaces/
│   │   │   └── biblio.ts          # Interfaces TypeScript
│   │   └── services/
│   │       └── biblio.service.ts   # Servicio HTTP
│   ├── feature/
│   │   ├── biblio-list/           # Componente lista
│   │   └── biblio-form/           # Componente formulario
│   ├── material.config.ts         # Configuración Material
│   ├── app.routes.ts              # Rutas
│   └── app.component.*            # Componente principal
└── styles.scss                    # Estilos globales
```

## Instalación y Ejecución

### Prerrequisitos
- Node.js 18+ 
- npm 6+

### Pasos

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   cd project
   npm install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Abrir navegador**
   ```
   http://localhost:4200
   ```

## Uso del Sistema

### Página Principal
- Muestra tabla con todas las fichas registradas
- Botón "Nueva Ficha" para crear registros
- Filtros por tipo de documento y búsqueda general

### Crear/Editar Ficha
- Formulario con validaciones
- Campos obligatorios: Tipo, Título, Autor, Año, Tema
- Campos opcionales: Editorial, Edición, Páginas
- Validación en tiempo real

### Tipos de Documento
- **Libro**: Narrativa, ensayos, manuales
- **Artículo**: Publicaciones académicas, científicas
- **Tesis**: Trabajos universitarios de grado/postgrado
- **Video**: Documentales, conferencias educativas
- **Periódico**: Artículos periodísticos
- **Repositorio**: Documentos de repositorios institucionales

## Configuración Backend

El frontend está preparado para conectarse con una API REST. 

### Endpoints Esperados
```
GET    /api/fichas              # Listar fichas
GET    /api/fichas/{id}         # Obtener ficha por ID
POST   /api/fichas              # Crear ficha
PUT    /api/fichas/{id}         # Actualizar ficha
DELETE /api/fichas/{id}         # Eliminar ficha
GET    /api/tipos-documento     # Listar tipos de documento
GET    /api/fichas/search?q=    # Buscar fichas
```

### Configuración de URL
Modificar `src/app/core/services/biblio.service.ts`:
```typescript
private apiUrl = 'http://localhost:8080/api'; // Cambiar por tu URL
```

## Características Técnicas

### Arquitectura
- **Standalone Components**: No usa NgModules
- **Lazy Loading**: Preparado para carga diferida
- **Reactive Forms**: Formularios reactivos con validación
- **HTTP Interceptors**: Preparado para autenticación/logging

### Estilos
- **Angular Material**: Tema Indigo-Pink
- **SCSS**: Preprocesador CSS
- **Responsive**: Breakpoints para móviles
- **Accesibilidad**: Componentes accesibles

### Datos de Prueba
El sistema incluye datos de ejemplo cuando no hay backend:
- Fichas de muestra de diferentes tipos
- Simulación de operaciones CRUD
- Manejo de errores HTTP

## Desarrollo

### Comandos Útiles
```bash
# Desarrollo
npm start

# Build producción
npm run build

# Tests
npm test

# Linting
ng lint
```

### Agregar Nuevas Funcionalidades
1. Crear componentes en `src/app/feature/`
2. Agregar rutas en `app.routes.ts`
3. Actualizar interfaces en `core/interfaces/`
4. Extender servicios en `core/services/`

## Próximas Mejoras

- [ ] Paginación en tabla
- [ ] Ordenamiento por columnas
- [ ] Filtros avanzados
- [ ] Exportación a PDF/Excel
- [ ] Gestión de usuarios
- [ ] Sistema de categorías/tags
- [ ] Historial de cambios
- [ ] Búsqueda por texto completo

## Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**Desarrollado para el Hackathon 2025** 🚀

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
