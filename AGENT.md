# 🤖 AGENT.md - Directrices del Proyecto para Desarrolladores y Asistentes IA

Este documento describe la arquitectura, decisiones de diseño, convenciones de código y áreas de oportunidad para cualquier asistente o desarrollador que trabaje en **Family Tree App** (anteriormente `loginapp`).

---

## 🎯 Propósito del Proyecto

Una aplicación móvil construida con **React Native + Expo** conectada a **Appwrite**, orientada a registrar árboles genealógicos familiares. Los usuarios pueden autenticarse y construir estructuras jerárquicas de personas (raíces y descendientes recursivos).

---

## 🏗️ Arquitectura y Patrones

### 1. Enrutamiento (Expo Router v6)

- Basado en el directorio `/app`.
- **Rutas públicas**: `/index.tsx` (Login), `/register.tsx` (Registro).
- **Rutas privadas/autenticadas**: `/app/(tabs)/`
  - `home.tsx`: Pantalla principal del árbol genealógico.
  - `profile.tsx`: Perfil del usuario, estadísticas y cambio de contraseña.
- Layout raíz en `app/_layout.tsx` encapsula los Providers de React Context.

### 2. Capa de Datos y Backend (Appwrite)

- **Cliente**: Configurado en `lib/appwrite.ts`.
- **Servicio de Personas**: `lib/personService.ts`
  - Modelo `PersonDocument`: `$id`, `firstName`, `lastName`, `birthDate`, `description`, `parentId`, `userId`.
  - Modelo `Person`: Extiende `PersonDocument` agregando `children: Person[]`.
  - Función clave `buildFamilyTree(persons: PersonDocument[])`: Transforma la lista plana de Appwrite en una estructura de árbol en memoria (Map O(N)).

### 3. Componentes UI y Visualización

- **`TreeNode.tsx`**: Componente recursivo que renderiza la tarjeta del nodo y sus descendientes al expandir.
- **`Personmodals.tsx`**: Diálogos unificados para crear miembros raíz o descendientes y editar personas existentes.
- **`NotificationSnackbar.tsx`**: Mensajes flotantes de confirmación / error.

---

## 📌 Convenciones y Reglas de Código

1. **TypeScript Estricto**:
   - Evitar el uso de `any` en los contextos y componentes (ej. en `auth-context.tsx` tipar `user: Models.User<Models.Preferences> | null`).
   - Definir interfaces explícitas para las props de cada componente.

2. **UI & Theming**:
   - Usar siempre componentes de `react-native-paper` (`Text`, `Button`, `Card`, `TextInput`, `Portal`, etc.).
   - Utilizar el hook `useTheme()` para mantener soporte consistente de colores en Modo Claro y Oscuro.

3. **Manejo de Errores y Estados de Carga**:
   - Toda llamada asíncrona a Appwrite debe envolverse en `try/catch` con feedback visual al usuario (`ActivityIndicator` y `Snackbar`).

---

## ⚠️ Puntos de Atención / Mejoras Pendientes

1. **Pestaña `create-root` en `app/(tabs)/_layout.tsx`**:
   - Hay una referencia a `<Tabs.Screen name="create-root" .../>`, pero el archivo `create-root.tsx` no existe en `app/(tabs)/`. Es preferible eliminarla o crear la pantalla correspondiente.
2. **Duplicación de `PaperProvider`**:
   - `app/_layout.tsx` contiene un `<PaperProvider>`, mientras que `contexts/theme-context.tsx` ya contiene su propio `<PaperProvider theme={...}>`. Remover el de `_layout.tsx` para evitar anulación de temas.
3. **Optimización del Árbol Genealógico**:
   - En árboles grandes, un componente recursivo simple puede generar problemas de rendimiento o desbordes visuales en pantallas pequeñas. Se sugiere explorar librerías de diagramación SVG o Canvas (ej. `@shopify/react-native-skia` o `react-native-svg`).
4. **Relación Biparental (Madre y Padre)**:
   - El modelo actual solo admite `parentId` único. En árboles reales, se recomienda admitir `fatherId` y `motherId` o un modelo de relaciones conyugales.
