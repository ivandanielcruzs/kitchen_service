FROM node:22.12.0

WORKDIR /src

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente, incluyendo el `.env`
COPY . .

# 🔹 Asegurar que React use el `.env` local
RUN npm run build

# Instalar `serve` para servir la aplicación en producción
RUN npm install -g serve

# Exponer el puerto del frontend
EXPOSE 3001

# Servir la aplicación desde el build generado
CMD ["serve", "-s", "build", "-l", "3001"]
