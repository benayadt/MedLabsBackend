# Stage 1: build the static SPA bundle. This stage only runs during image
# build; no Node.js runs in production.
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve the built files with Nginx. This is the only thing that
# actually runs at container start — a plain static file server plus a
# reverse proxy to the gateway.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
