# Se usa una imagen de Node ligera
FROM node:22-alpine AS base
WORKDIR /app
# Se debe instalar pnpm globalmente
RUN npm i -g pnpm
# Se instalan dependencias
FROM base AS deps
WORKDIR /app
# Copia solo los archivos manifiesto necesarios
COPY package.json pnpm-lock.yaml ./
# Instala solo dependencias en producción
RUN pnpm install --frozen-lockfile --prod
# Se construye la app
FROM base AS builder
WORKDIR /app
# Se copian las dependencias del paso anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Instala todas las dependencias
RUN pnpm install --frozen-lockfile
# Construye la app para producción
RUN pnpm build
# Se construye la imagen para prod
FROM base AS runner
WORKDIR /app
# Se define el entorno como prod
ENV NODE_ENV=produccion
# Deshabilitar la telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1
# Crea un usuario "no root" para mejorar la seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
# Se copian los artefactos de compilacion de la etapa "builder"
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Se cambia al usuario "no root"
USER nextjs
# Se expone la app
EXPOSE 3000
# Comando para iniciar la app
CMD ["node", "server.js"]