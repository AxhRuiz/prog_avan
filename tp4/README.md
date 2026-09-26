# API de Pagos con Stripe (NestJS)

Servicio backend construido en NestJS que gestiona el flujo de pagos a través de Stripe Checkout, incluyendo la generación de sesiones de pago y el procesamiento de notificaciones (webhooks) enviadas por Stripe.

---

## Stack y requisitos previos

Antes de correr el proyecto necesitás tener instalado:

- Node.js
- npm
- Stripe CLI (para probar webhooks en local)
- Una cuenta de Stripe en modo test

Tecnologías principales del proyecto: **NestJS**, **TypeScript**, **Stripe**, `class-validator`, `class-transformer` y `dotenv`.

---

## Puesta en marcha

1. Instalá las dependencias del proyecto:

   ```bash
   npm install
   ```

2. Configurá las variables de entorno

3. Levantá el servidor en modo desarrollo:

   ```bash
   npm run start:dev
   ```

Una vez arriba, la API queda escuchando en:

```text
http://localhost:3003
```

---

## Configuración de entorno

Basate en el archivo `.env.template` para crear tu propio `.env` en la raíz del proyecto:

```env
PORT=3003

STRIPE_SECRET=sk_test_xxxxxxxxxxxxxxxxxxxxx

STRIPE_SUCCESS_URL=http://localhost:3003/payments/success

STRIPE_CANCEL_UR=http://localhost:3003/payments/cancel

STRIPE_ENDPOINT_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

 Variable -- Descripción 

 `PORT` -- Puerto en el que corre la API 
 `STRIPE_SECRET` -- Clave secreta de Stripe (modo test) 
 `STRIPE_SUCCESS_URL` -- Redirección tras un pago exitoso 
 `STRIPE_CANCEL_UR` -- Redirección cuando el usuario cancela el pago 
 `STRIPE_ENDPOINT_SECRET` -- Secreto para validar la firma de los webhooks 



---

## Endpoints disponibles

### Crear sesión de pago

```http
POST /payments/create-payment-session
```

Body de ejemplo:

```json
{
  "orderId": "ord-1",
  "currency": "usd",
  "items": [
    {
      "name": "Producto",
      "price": 20,
      "quantity": 1
    }
  ]
}
```

Los montos se convierten automáticamente a la unidad mínima que usa Stripe (por ejemplo, `20 USD` se transforma en `2000` centavos).

Respuesta esperada:

```json
{
  "id": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

El `orderId` viaja hacia Stripe dentro de `payment_intent_data.metadata`, lo que permite recuperarlo más adelante desde el webhook.

### Pago exitoso

```http
GET /payments/success
```

```json
{
  "ok": true,
  "message": "Payment successful"
}
```

### Pago cancelado

```http
GET /payments/cancel
```

```json
{
  "ok": false,
  "message": "Payment cancelled"
}
```

---

## Recepción de webhooks

```http
POST /payments/webhook
```

Stripe firma cada notificación con el header `stripe-signature`. El servicio usa ese header junto con el cuerpo crudo de la petición (`rawBody`) y la variable `STRIPE_ENDPOINT_SECRET` para confirmar que el evento efectivamente proviene de Stripe.

Cuando llega un evento `charge.succeeded`, el servicio extrae el `orderId` desde `charge.metadata.orderId` y lo imprime por consola.

Cualquier otro tipo de evento se registra igualmente, pero se responde no se trata como un pago.

### Escuchar eventos en local con Stripe CLI

```bash
stripe listen \
  --events charge.succeeded \
  --forward-to http://localhost:3003/payments/webhook
```

La CLI va a imprimir un secreto con este formato:

```text
whsec_xxxxxxxxxxxxxxxxxxxxx
```

Copialo en tu `.env`:

```env
STRIPE_ENDPOINT_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

y reiniciá la aplicación para que tome el nuevo valor.

---

## Cómo probar el flujo completo

### 1. Generar un pago de prueba

Enviá una petición:

```http
POST http://localhost:3003/payments/create-payment-session
```

```json
{
  "orderId": "ord-1",
  "currency": "usd",
  "items": [
    {
      "name": "Producto",
      "price": 20,
      "quantity": 1
    }
  ]
}
```

Abrí la `url` que te devuelve la respuesta y completá el checkout usando la tarjeta de test de Stripe:

```text
4242 4242 4242 4242
```

(cualquier fecha futura y cualquier CVC son válidos en test).

### 2. Confirmar que el webhook lo recibe

Con Stripe CLI corriendo (`stripe listen ...`) y la app levantada, completá el pago desde el checkout. Al recibirse el evento `charge.succeeded`:

- El endpoint responde `200 OK`.
- En la consola del servidor vas a ver el `orderId` asociado.

---

## Validaciones

El endpoint de creación de sesión rechaza (`400 Bad Request`) los siguientes casos:

- Array `items` vacío o inexistente.
- Precios negativos.
- Propiedades extra no contempladas en el DTO.
- Tipos de datos inválidos.

El webhook, por su parte, rechaza cualquier request que no incluya una firma de Stripe válida.
