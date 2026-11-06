# Build from the REPO ROOT:  docker build -f server/Dockerfile -t fe-api .
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY server/package.json ./server/package.json
COPY server/src ./server/src
# P1's validated data. The folder must exist in the repo (data-pipeline/robots and data-pipeline/translations).
COPY data-pipeline ./data-pipeline
USER node
WORKDIR /app/server
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8787)+'/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node","src/index.js"]
