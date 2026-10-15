# ropa-store

A full-stack e-commerce application built with [Vendure](https://www.vendure.io/) and [Next.js](https://nextjs.org/).

## Project Structure

This is a monorepo using npm workspaces:

```
ropa-store/
├── apps/
│   ├── server/       # Vendure backend (GraphQL API, Admin Dashboard)
│   └── storefront/   # Next.js frontend
└── package.json      # Root workspace configuration
```

## Getting Started

### Development

Start both the server and storefront in development mode:

```bash
npm run dev
```

Or run them individually:

```bash
# Start only the server
npm run dev:server

# Start only the storefront
npm run dev:storefront
```

### Access Points

- **Vendure Dashboard**: http://localhost:3000/dashboard
- **Shop GraphQL API**: http://localhost:3000/shop-api
- **Admin GraphQL API**: http://localhost:3000/admin-api
- **Storefront**: http://localhost:3001

### Admin Credentials

Use these credentials to log in to the Vendure Dashboard:

- **Username**: superadmin
- **Password**: superadmin

## Production Build

Build all packages:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## Learn More

- [Vendure Documentation](https://docs.vendure.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vendure Discord Community](https://vendure.io/community)


------


# Integración de Culqi - Arquitectura

## Objetivo

Se preparó la estructura necesaria para integrar **Culqi** como pasarela de pago principal del ecommerce. La arquitectura fue diseñada para que la lógica de pagos esté desacoplada del checkout y sea fácilmente extensible a otros proveedores (Niubiz, Mercado Pago, PayPal, etc.).

Actualmente **no existe ninguna integración activa con Culqi**. Solamente se preparó la estructura del proyecto para que, una vez obtenidas las credenciales de Culqi (Public Key y Secret Key), la integración pueda implementarse sin modificar el flujo del checkout.

---

# Arquitectura General

```text
Cliente
    │
    ▼
PaymentStep
    │
    ▼
CreditCardPayment
    │
    ▼
lib/payments/culqi
    │
    ▼
API Route
    │
    ▼
Plugin de Vendure
    │
    ▼
API Culqi
```

Cada capa tiene una única responsabilidad.

---

# Frontend

Ruta:

```text
src/
 ├── components/
 ├── lib/
 └── app/
```

---

## components/payments/

Contiene únicamente componentes visuales relacionados con los métodos de pago.

No debe contener llamadas a APIs ni lógica de negocio.

Su responsabilidad es mostrar la interfaz del usuario.

En el futuro contendrá componentes como:

```text
CreditCardPayment.tsx
CardIcons.tsx
PaymentLoading.tsx
PaymentError.tsx
```

---

## lib/payments/

Esta carpeta centraliza toda la lógica relacionada con los pagos.

El objetivo es evitar que `PaymentStep` tenga conocimiento de Culqi.

---

### config.ts

Contiene la configuración general de los proveedores de pago.

Actualmente almacena:

* Public Key
* Entorno (Sandbox / Producción)

Toda la aplicación obtendrá la configuración desde este archivo.

---

### types.ts

Contiene todas las interfaces relacionadas con los pagos.

Aquí se definen:

* Tipos de proveedores
* Resultado de pagos
* Interfaces compartidas

Evita repetir interfaces en distintos archivos.

---

### utils.ts

Funciones auxiliares relacionadas con pagos.

Ejemplos futuros:

* Conversión de montos
* Formato de moneda
* Validaciones

---

# lib/payments/culqi/

Esta carpeta contiene exclusivamente la lógica relacionada con Culqi.

El objetivo es que ningún otro archivo del proyecto conozca cómo funciona Culqi internamente.

---

## constants.ts

Define constantes utilizadas por la integración.

Ejemplos:

* URL del SDK
* Código de moneda
* Versiones
* Configuración estática

---

## errors.ts

Contiene errores personalizados.

Permite capturar errores de Culqi de manera uniforme.

Ejemplo:

```text
CulqiError
```

---

## types.ts

Interfaces exclusivas de Culqi.

Ejemplos:

* Token
* Cargo
* Respuestas del SDK

No deben mezclarse con los tipos generales del proyecto.

---

## client.ts

Responsable de la comunicación desde el navegador hacia Culqi.

En este archivo se cargará el SDK oficial y se generarán los Tokens.

Este archivo nunca utilizará la Secret Key.

---

## service.ts

Contendrá funciones reutilizables relacionadas con Culqi.

Ejemplo:

* Crear token
* Inicializar SDK
* Validaciones

No contendrá componentes React.

---

## index.ts

Archivo barril.

Permite importar todo Culqi mediante:

```ts
import { ... } from "@/lib/payments/culqi";
```

En lugar de múltiples imports individuales.

---

# API

Ruta

```text
src/app/api/payments/culqi/
```

---

## route.ts

Será el único endpoint del frontend encargado de comunicarse con el backend.

Responsabilidades futuras:

* Recibir Token generado por Culqi
* Enviar Token al servidor
* Devolver resultado del pago

Nunca recibirá directamente números de tarjeta.

---

# Backend (Vendure)

Ruta

```text
apps/server/src/plugins/payments/culqi/
```

Toda la integración con Culqi vive como un Plugin independiente.

De esta forma el núcleo del servidor permanece desacoplado.

---

## culqi.plugin.ts

Punto de entrada del Plugin.

Será el encargado de registrar:

* Servicios
* Payment Handler
* Dependencias

---

## culqi.service.ts

Contendrá toda la comunicación con la API de Culqi.

Ejemplos futuros:

* Crear cargos
* Consultar pagos
* Manejar respuestas

Toda llamada HTTP hacia Culqi se realizará desde este servicio.

---

## culqi-payment.handler.ts

Implementará el Payment Handler de Vendure.

Responsabilidades futuras:

* Crear Payment
* Confirmar pagos
* Cambiar estado del pedido
* Manejar errores

Es el puente entre Vendure y Culqi.

---

## types.ts

Interfaces exclusivas del Plugin.

No deben mezclarse con las del frontend.

---

## constants.ts

Constantes utilizadas únicamente por el Plugin.

Ejemplo:

* Nombre del proveedor
* Configuración interna

---

## index.ts

Archivo barril del Plugin.

Exporta todos los módulos públicos del Plugin.

---

# Variables de entorno

Se utilizarán las siguientes variables:

Frontend

```env
NEXT_PUBLIC_CULQI_PUBLIC_KEY=
CULQI_ENVIRONMENT=sandbox
```

Backend

```env
CULQI_SECRET_KEY=
CULQI_ENVIRONMENT=sandbox
```

Cuando se obtenga una cuenta de Culqi únicamente será necesario reemplazar:

```env
NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_test_xxxxx
CULQI_SECRET_KEY=sk_test_xxxxx
```

y posteriormente cambiar:

```env
CULQI_ENVIRONMENT=production
```

cuando la tienda pase a producción.

---

# Principios de la arquitectura

* **Separación de responsabilidades:** cada archivo tiene una única función.
* **Escalabilidad:** permite agregar nuevos proveedores sin modificar el checkout.
* **Seguridad:** la información sensible (Secret Key) permanece exclusivamente en el backend.
* **Mantenibilidad:** la lógica de Culqi está completamente aislada del resto de la aplicación.
* **Extensibilidad:** la estructura puede reutilizarse para integrar otros proveedores de pago.

---

# Estado actual

✅ Estructura de carpetas creada.
✅ Archivos base creados.
✅ Configuración inicial preparada.
✅ Arquitectura desacoplada definida.

## Pendiente

* Integrar el SDK oficial de Culqi en el frontend.
* Implementar el endpoint `/api/payments/culqi`.
* Desarrollar `CulqiService` para comunicarse con la API de Culqi.
* Implementar el `CulqiPaymentHandler` de Vendure.
* Configurar las credenciales (`Public Key` y `Secret Key`) una vez obtenidas desde la cuenta de Culqi.
* Realizar pruebas en entorno **sandbox** y, posteriormente, habilitar el entorno de **producción**.
