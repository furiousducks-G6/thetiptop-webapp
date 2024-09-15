# Étape 1 : Construire l'application Angular
FROM node:18-alpine AS build

WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application en mode production
RUN npm run build -- --configuration production

# Étape 2 : Utiliser Nginx pour servir les fichiers compilés
FROM nginx:alpine

# Copier les fichiers construits vers le répertoire Nginx
COPY --from=build /usr/src/app/dist/thetiptop-web/browser /usr/share/nginx/html

# Exposer le port 80 pour Nginx
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
