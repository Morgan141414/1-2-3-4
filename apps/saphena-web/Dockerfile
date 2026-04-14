# 1. Ставим node
FROM node:20-alpine AS build

# 2. Сперва устанавливаем зависимости, чтобы кешировались
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci 

# 3. Копируем остальной код
COPY . .

# 4. Собираем проект
RUN npm run build -- --configuration=production

# 5. Убираем ненужные зависимости (уменьшает размер образа)
RUN npm prune --production

# 6. Копируем nginx.conf
FROM nginx:stable-alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# 7. Копируем собранный проект
COPY --from=build /app/dist/saphena-web/browser /usr/share/nginx/html
