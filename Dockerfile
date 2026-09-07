# Pre-built static export served by nginx.
# Run `npm run build` first (or `./scripts/docker-build-push.sh`).
FROM nginx:alpine

COPY dist-export/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
