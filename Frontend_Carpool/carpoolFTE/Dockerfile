# Stage 1: Node.js build stage
FROM node:18.18.0 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --force

# copy all files to workdir
COPY . . 

# install angular globally for ng command
RUN npm install -g @angular/cli@16.2.10

RUN ng build --configuration=production

# Stage 2: Nginx stage to serve the Angular app
FROM nginx:alpine

# Replace the default nginx.conf to use absolute paths
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/carpool-fte /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]