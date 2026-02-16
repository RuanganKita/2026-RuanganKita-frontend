FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Ubah dari npm ci ke npm install
RUN npm install

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .

RUN npm run build

# Stage 2: Serve dengan Nginx
FROM nginx:alpine

RUN apk add --no-cache wget

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]