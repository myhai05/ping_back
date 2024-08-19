# Utilisez une image de Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code de l'application
COPY . .

# Exposer le port sur lequel votre serveur écoute (par exemple 3031)
EXPOSE 3031

# Commande pour démarrer l'application
CMD ["npm", "start"]