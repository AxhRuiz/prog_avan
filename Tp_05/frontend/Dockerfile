# Etapa 1: build de la app con Vite
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# La URL del backend se "hornea" dentro del bundle en build-time
ARG VITE_API_URL=http://localhost:3002
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Etapa 2: servir el build estático con Nginx
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
