FROM nginx
COPY ./nginx/ /etc/nginx/
RUN mkdir /etc/nginx/sites-enabled/
RUN ln -s /etc/nginx/sites-available/reverse-proxy.conf /etc/nginx/sites-enabled/reverse-proxy.conf