FROM node
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build

FROM node
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=0 /app/dist .
RUN npm install pm2 -g
EXPOSE 8080
CMD ["pm2-runtime","app.js"]