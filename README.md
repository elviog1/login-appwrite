# 🌳 Family Tree App (Árbol Genealógico)

Aplicación móvil multiplataforma desarrollada con **React Native**, **Expo (Router)** y **Appwrite**, diseñada para gestionar y estructurar árboles genealógicos familiares de manera jerárquica y visual.

---

## 🚀 Características Principales

- 🔐 **Autenticación Completa**: Registro, inicio de sesión, cierre de sesión y cambio de contraseña mediante Appwrite Auth.
- 🌳 **Gestión del Árbol Genealógico**:
  - Creación de personas raíz (antepasados).
  - Adición dinámica de descendientes recursivos.
  - Edición y eliminación de miembros.
  - Cálculo dinámico de edad según fecha de nacimiento.
- 🎨 **Interfaz con Material Design**: Integración de `react-native-paper` con soporte para **Modo Claro / Oscuro**.
- 📊 **Estadísticas de la Familia**: Resumen de total de miembros, personas raíz y descendientes en la pantalla de perfil.
- 📱 **Soporte Multiplataforma**: Android, iOS y Web con Expo.

---

## 🛠️ Stack Tecnológico

| Tecnología | Descripción |
| :--- | :--- |
| **React Native** (0.86) | Framework de desarrollo móvil |
| **Expo** (SDK 57) | Plataforma y herramientas universales |
| **Expo Router** (v57) | Navegación basada en el sistema de archivos |
| **Appwrite** (`react-native-appwrite`) | Backend as a Service (Autenticación y Base de Datos) |
| **React Native Paper** (v5) | Componentes visuales Material Design 3 |
| **TypeScript** (v6) | Tipado estático y robustez |

---

## 📁 Estructura del Proyecto

```text
loginapp/
├── app/                      # Rutas de Expo Router
│   ├── (tabs)/               # Vistas protegidas por pestañas
│   │   ├── _layout.tsx       # Barra de navegación inferior
│   │   ├── home.tsx          # Vista principal del árbol genealógico
│   │   └── profile.tsx       # Perfil del usuario y estadísticas
│   ├── _layout.tsx           # Layout raíz con Proveedores de Contexto
│   ├── index.tsx             # Pantalla de Login
│   └── register.tsx          # Pantalla de Registro
├── components/               # Componentes reutilizables
│   ├── AppHeader.tsx         # Barra superior con selector de tema
│   ├── NotificationSnackbar.tsx # Notificaciones toast
│   ├── Personmodals.tsx      # Modal de creación y edición de personas
│   └── TreeNode.tsx          # Renderizado recursivo de nodos del árbol
├── contexts/                 # Estado global (Context API)
│   ├── auth-context.tsx      # Estado de sesión y usuario
│   ├── theme-context.tsx     # Manejo del tema oscuro/claro
│   └── tree-context.tsx      # Estado global del árbol
├── hooks/                    # Custom Hooks
│   └── useNotification.ts    # Disparador unificado de alertas
├── lib/                      # Servicios y utilidades
│   ├── appwrite.ts           # Configuración del cliente Appwrite
│   ├── auth.ts               # Métodos de autenticación
│   ├── date.utils.ts         # Cálculo y formato de fechas
│   ├── personService.ts      # CRUD y algoritmo de construcción del árbol
│   └── validatorEmail.ts     # Validadores de formulario
└── package.json              # Configuración y dependencias
```

---

## ⚙️ Configuración y Variables de Entorno

Crea un archivo `.env` o `.env.local` en la raíz del proyecto:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_DATABASE_ID=tu_database_id
EXPO_PUBLIC_COLLECTION_ID=tu_collection_id
```

### 🗄️ Estructura de la Colección en Appwrite (`Persons`)

| Atributo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `firstName` | `String` | Sí | Nombre de la persona |
| `lastName` | `String` | Sí | Apellido |
| `birthDate` | `String` (YYYY-MM-DD) | Sí | Fecha de nacimiento |
| `description` | `String` | No | Datos adicionales / biografía |
| `parentId` | `String` | No (nullable) | ID de la persona padre (null si es raíz) |
| `userId` | `String` | Sí | ID del usuario propietario para aislar datos |

---

## 🚀 Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo Expo:**
   ```bash
   npx expo start
   ```

3. **Ejecutar en plataforma deseada:**
   - Presiona `a` para emulador Android.
   - Presiona `i` para simulador iOS.
   - Presiona `w` para navegador Web.
   - O escanea el código QR con la aplicación **Expo Go**.

---

## 📜 Scripts Disponibles

- `npm run start`: Inicia Expo Dev Server.
- `npm run android`: Ejecuta en Android.
- `npm run ios`: Ejecuta en iOS.
- `npm run web`: Ejecuta en la Web.
- `npm run lint`: Ejecuta el análisis estático de ESLint.

