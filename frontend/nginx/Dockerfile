FROM nginx:1.25
# COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d
# EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
