FROM nginx:alpine
COPY . /usr/share/nginx/html

#FROM ubuntu
#RUN apt-get update
#RUN apt-get install nginx -y
#COPY . /var/www/html/
#EXPOSE 80
#CMD [“nginx”,”-g”,”daemon off;”]
