# Restaurant Management System (React + Redux + Formik + Yup)

Sistema de gestión de restaurantes full-stack desarrollado con tecnologías modernas de React. Este proyecto demuestra la implementación de una aplicación web empresarial completa, utilizando las mejores prácticas y patrones de diseño actuales.

## Tecnologías Principales

### Frontend
- **React 18** con Vite para un desarrollo rápido y eficiente
- **Redux Toolkit** para una gestión de estado predecible y eficaz
- **Material-UI v5** para una interfaz moderna y responsive
- **Formik + Yup** para manejo y validación robusta de formularios
- **React Query** para gestión eficiente de estado del servidor
- **React Router v6** para navegación declarativa

### Backend
- **Node.js** con Express para una API RESTful
- **MongoDB** con Mongoose para una base de datos flexible
- **JWT** para autenticación segura
- **Swagger** para documentación de API

## Características Destacadas

- **Arquitectura Escalable**: Estructura modular y mantenible
- **Diseño Responsive**: Adaptable a cualquier dispositivo
- **Gestión de Estado Avanzada**: Integración de Redux Toolkit y React Query
- **Formularios Robustos**: Validación completa con Formik y Yup
- **Seguridad**: Implementación de JWT, protección CSRF y sanitización de datos
- **UI/UX Moderna**: Interfaz intuitiva con Material-UI
- **Optimización de Rendimiento**: Lazy loading, code splitting y caching

## Funcionalidades del Sistema

### Dashboard Interactivo
- Métricas en tiempo real
- Gráficos de rendimiento
- KPIs principales
- Vista general del negocio

### Gestión de Restaurantes
- CRUD completo de locales
- Gestión de horarios
- Análisis de rendimiento
- Configuración personalizada

### Sistema de Mesas
- Gestión en tiempo real
- Asignación inteligente
- Estados dinámicos
- Historial de uso

### Reservas Avanzadas
- Sistema de reservas online
- Confirmación automática
- Gestión de estados
- Notificaciones

### Gestión de Clientes
- Perfiles detallados
- Sistema de fidelización
- Preferencias personalizadas
- Historial de visitas

### Panel de Empleados
- Control de acceso basado en roles
- Gestión de horarios
- Métricas de rendimiento
- Información detallada

## Módulos Principales

### Gestión de Restaurantes
- Administración de locales
- Horarios y capacidad
- Métricas y análisis
- Configuración de servicios

### Gestión de Mesas
- Estado en tiempo real
- Tipos de mesa (Estándar/VIP)
- Capacidad y ubicación
- Historial de uso

### Gestión de Reservas
- Sistema de reservas en línea
- Confirmación y check-in
- Gestión de estados
- Asignación automática de mesas
- Notificaciones

### Gestión de Clientes
- Perfiles detallados
- Preferencias y restricciones alimentarias
- Historial de visitas
- Sistema de fidelización
- Contacto y comunicaciones

### Gestión de Empleados
- Perfiles de personal
- Roles y permisos
- Horarios y turnos
- Rendimiento y métricas
- Contactos de emergencia

## Requisitos del Sistema

### Backend
- Node.js >= 14.x
- MongoDB >= 4.x
- npm o yarn

### Frontend
- Node.js >= 14.x
- npm o yarn
- Navegador moderno con soporte para ES6

## Instalación Detallada

### Backend

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/restaurant-chain-manager.git
   cd restaurant-chain-manager
   ```

2. Instalar dependencias:
   ```bash
   cd backend
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con los siguientes valores:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/restaurant-manager
   JWT_SECRET=tu_secreto_jwt
   EMAIL_SERVICE=gmail
   EMAIL_USER=tu_email
   EMAIL_PASSWORD=tu_password
   ```

4. Inicializar la base de datos:
   ```bash
   npm run db:seed
   ```

5. Iniciar el servidor:
   ```bash
   # Desarrollo
   npm run dev

   # Producción
   npm run build
   npm start
   ```

### Frontend

1. Instalar dependencias base:
   ```bash
   cd frontend
   npm install
   ```

2. Instalar dependencias principales:
   ```bash
   # Gestión de formularios y validación
   npm install formik yup

   # Gestión de estado y routing
   npm install @reduxjs/toolkit react-redux
   npm install @tanstack/react-query
   npm install react-router-dom

   # Componentes UI y estilos
   npm install @mui/material @emotion/react @emotion/styled
   npm install @mui/icons-material
   npm install notistack

   # Utilidades y herramientas
   npm install axios date-fns
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Restaurant Manager
   ```

4. Iniciar la aplicación:
   ```bash
   # Desarrollo
   npm run dev

   # Producción
   npm run build
   npm run preview
   ```

## Estructura del Proyecto Actualizada

### Backend
```
backend/
├── src/
│   ├── config/        # Configuración de la aplicación
│   ├── controllers/   # Controladores de la API
│   │   ├── auth.controller.js
│   │   ├── restaurant.controller.js
│   │   ├── table.controller.js
│   │   ├── reservation.controller.js
│   │   ├── customer.controller.js
│   │   └── employee.controller.js
│   ├── middleware/    # Middleware personalizado
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── models/        # Modelos de MongoDB
│   │   ├── Restaurant.js
│   │   ├── Table.js
│   │   ├── Reservation.js
│   │   ├── Customer.js
│   │   └── Employee.js
│   ├── routes/        # Rutas de la API
│   ├── services/      # Lógica de negocio
│   └── utils/         # Utilidades y helpers
```

### Frontend
```
frontend/
├── src/
│   ├── components/    # Componentes reutilizables
│   │   ├── common/    # Componentes genéricos
│   │   ├── layout/    # Componentes de estructura
│   │   └── navigation/# Componentes de navegación
│   ├── pages/         # Páginas de la aplicación
│   │   ├── auth/      # Páginas de autenticación
│   │   ├── dashboard/ # Dashboard principal
│   │   ├── restaurants/# Gestión de restaurantes
│   │   ├── tables/    # Gestión de mesas
│   │   ├── reservations/# Gestión de reservas
│   │   ├── customers/ # Gestión de clientes
│   │   └── employees/ # Gestión de empleados
│   ├── services/      # Servicios de API
│   ├── store/         # Estado global con Redux
│   │   ├── slices/    # Redux slices
│   │   └── store.js   # Configuración de Redux
│   ├── theme/         # Configuración de tema
│   └── utils/         # Utilidades y helpers
```

## Características de Seguridad

- Autenticación JWT
- Protección contra CSRF
- Rate limiting
- Validación de datos
- Sanitización de entradas
- Logs de seguridad
- Encriptación de datos sensibles

## Mantenimiento

### Backend
- Backups automáticos de la base de datos
- Logs de errores y actividad
- Monitoreo de rendimiento
- Actualización de dependencias

### Frontend
- Análisis de rendimiento
- Gestión de caché
- Optimización de assets
- Monitoreo de errores

## Soporte

Para reportar problemas o solicitar ayuda:
1. Abrir un issue en GitHub
2. Describir el problema detalladamente
3. Incluir pasos para reproducir el error
4. Adjuntar logs relevantes

## Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.
