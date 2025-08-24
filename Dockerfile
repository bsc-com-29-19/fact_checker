# Use Node.js LTS
FROM node:18-alpine

# --- Step 1: Declare build-time arguments for ALL required variables ---
# These are for your server-side code during the build
ARG OPENAI_API_KEY
ARG LGC_DEPLOYMENT_URL
ARG LANGSMITH_API_KEY
ARG CLERK_SECRET_KEY

# These are for your client-side code (Next.js will inline them)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
ARG NEXT_PUBLIC_FORCE_LGC
# Note: Deprecated Clerk URLs are included since you have them.
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
ARG NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL

WORKDIR /app

# --- Step 2: Make the ARGs available as ENV variables for the build ---
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV LGC_DEPLOYMENT_URL=${LGC_DEPLOYMENT_URL}
ENV LANGSMITH_API_KEY=${LANGSMITH_API_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_SIGN_IN_URL}
ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_SIGN_UP_URL}
ENV NEXT_PUBLIC_FORCE_LGC=${NEXT_PUBLIC_FORCE_LGC}
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=${NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL}
ENV NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=${NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL}

# Install ALL dependencies (including devDependencies needed for build)
COPY package.json package-lock.json ./
RUN npm install

# Copy app source code
COPY . .

# Build Next.js app (now with access to the ENV variables)
RUN npm run build

# Prune devDependencies to keep the final image smaller
RUN npm prune --production


# Expose Next.js port
EXPOSE 3000

ENV PORT=3000

# Start app
ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]