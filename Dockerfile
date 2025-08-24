# Use Node.js LTS
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy app
COPY . .

# Build Next.js app
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
