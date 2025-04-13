# base deno image
FROM denoland/deno:alpine-2.2.7

WORKDIR /

COPY . .

EXPOSE 3000

CMD ["run", "--watch", "--allow-net", "--allow-env", "--allow-read", "--allow-sys",  "src/app.ts"]

