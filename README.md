# API-2021-HTTP-Infra

## Démarrer les serveurs

Pour démarrer nos différents serveurs il est nécessaire d'avoir docker d'installé sur votre ordinateur.
Ensuite il suffit de vous rentre dans le dossier racine et de lancer la commande docker compose up. Ce dernier va créer les images et lancer les containers.

Une fois que tout est allumé vous pouvez vous rendre sur http://localhost:8081. Vous verrez ensuite une page vous affichant la date et l'heure du serveur.

## 1. STATIC HTML SERVER

Pour servir notre fichier html nous avons décidé d'utiliser NGINX car ayant déjà utilisé Apache auparavant nous voulions apprendre quelque chose de nouveau.

Ce serveur permet donc d'accéder a index.html. Ce dernier fait des requêtes ajax toutes les secondes à notre serveur express pour afficher l'heure et la date actuelle.

Le fichier de configuration par défaut se trouve ici:
/etc/nginx/conf.d/default.conf

## 2. Dynamic HTTP server with express.js

Nous avons créé une image Nodejs permettant de servir la date et l'heure actuelle en accédant à la route /. Pour ce faire nous avons utilisé le framework express.

## 3. Reverse proxy

Nous avons choisi d'utiliser ici aussi NGINX mais cette fois-ci il sert de serveur proxy ainsi que de répartiteur de charge.

Le fichier de configuration par défaut se trouve ici:
/etc/nginx/conf.d/default.conf

Ces lignes permettent de rediriger un utilisateur sur un autre serveur quand il accède a /express ou / .

```
location /express {
    proxy_pass http://dynamic_stream/;
}

location / {
    proxy_pass http://static_stream/;
}
```

Nous avons ensuite ajouté ces lignes, qui permettent elle de répartir les charges en appliquant le round bobine. Dynamic1, dynamic2, static1 et static2 sont les noms que nous avons choisi dans le docker-compose.yml. Ils sont ensuite utilisés comme hostname afin de ne pas avoir à écrire les ip des container manuellement.

```
upstream dynamic_stream {
    server dynamic1:3006;
    server dynamic2:3006;
}

upstream static_stream {
    server static1;
    server static2;
}
```
