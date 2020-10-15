# Stage 1 - build frontend app
FROM node:10-alpine as build-deps

WORKDIR /app/

## define frontend dir
ENV FRONTEND_DIR='webapp'

COPY $FRONTEND_DIR/package.json $FRONTEND_DIR/package-lock.json /app/
RUN npm install

COPY $FRONTEND_DIR /app/
COPY .env /app/.env
RUN npm run build

# Stage 2 - nginx & frontend dist
FROM nginx:alpine

COPY nginx/prod.conf /etc/nginx/nginx.conf
COPY --from=build-deps /app/dist/ /dist/

CMD ["nginx", "-g", "daemon off;"]
