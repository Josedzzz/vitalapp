# base deno image
FROM denoland/deno:alpine-2.2.7

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /

# Copia todos los archivos del proyecto al contenedor
COPY . .

# Expón el puerto que tu aplicación usa (ajústalo si usas otro)
EXPOSE 3000

# Comando para ejecutar tu app en Render
CMD ["run", "--watch", "--allow-net", "--allow-env", "--allow-read", "--allow-sys",  "src/app.ts"]

