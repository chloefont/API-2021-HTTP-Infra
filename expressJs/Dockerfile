FROM node:latest
COPY src /opt/app
EXPOSE 3006
RUN cd /opt/app && npm install
CMD ["node", "/opt/app/index.js"]