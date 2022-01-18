# API-2021-HTTP-Infra

## Démarrer les serveurs

Pour démarrer nos différents serveurs il est nécessaire d'avoir docker d'installé sur votre ordinateur.

Pour build et démarrer les serveurs, rendez vous dans le dossier racine et lancez la commande :
```
docker-compose up
```

Pour uniquement démarrer les serveurs, lancez la commande :
```
docker-compose start
```

Une fois les serveurs allumés, vous pouvez vous rendre sur http://localhost:8081. Vous verrez ensuite une page vous affichant la date et l'heure du serveur.

## 1. Static HTTP server with nginx

Pour servir notre fichier html, nous avons décidé d'utiliser NGINX car ayant déjà utilisé Apache auparavant nous voulions apprendre quelque chose de nouveau.

Nous avons choisi de mapper le port 3006 au port 80 étant le port par défaut du protocole HTTP.

Pour afficher le fichier de configuration, lancez un shell dans un des container static :
```
docker exec -it api-2021-http-infra_static2_1 bash
```

Puis affichez le fichier :
```
cat /etc/nginx/conf.d/default.conf
```
Ce serveur permet d'accéder à la page index.html. Ce dernier effectue des requêtes ajax toutes les secondes à notre serveur express afin d'afficher l'heure et la date actuelle.


## 2. Dynamic HTTP server with express.js

Nous avons créé une image Nodejs permettant de servir la date et l'heure actuelle sous format json ainsi qu'une variable d'environnement définie dans le fichier docker-compose.yml.

La route permettant l'accès aux données est la racine /.
Nous avons utilisé le framework express pour créer un serveur http et définir notre route.

## 3. Reverse proxy with nginx

Nous avons à nouveau choisi d'utiliser un serveur NGINX. Dans ce cas, il sert de serveur proxy ainsi que de répartiteur de charge.

Le fichier de configuration par défaut se trouve ici:
/etc/nginx/conf.d/default.conf

Dans ce fichier, on retrouve ces lignes qui permettent de rediriger un utilisateur sur un autre serveur quand il accède a /express ou / . Cette fois-ci, c'est la route /express/ qui permet donc d'accéder aux serveurs dynamiques express.

```
location /express/ {
    proxy_pass http://dynamic_stream/;
}

location / {
    proxy_pass http://static_stream/;
}
```

Nous avons ensuite ajouté ces lignes, qui permettent de répartir les charges en appliquant le round-robine. Dynamic1, dynamic2, static1 et static2 sont les noms que nous avons choisi dans le docker-compose.yml. Ils sont ensuite utilisés comme hostname afin de ne pas avoir à écrire les ip des containers manuellement.

Nous avons ainsi deux serveurs dynamiques et deux serveurs statiques. 
Docker compose offre la possibilité d'intégrer directer du load balancing en ajoutant l'argument `scale ` au fichier de configuration.

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

## 4. AJAX requests with JQuery
Nous avons mis en place un timer qui effectue une requête AJAX sur la route /express/ toutes les secondes. Une fois la réponse reçue, nous mettons à jour la page html.

```
setInterval(() => {
            $.getJSON("/express/").done((data) => {
                console.log("heure:", data);
                $('#year').text(`${data.year}`);
                $('#month').text(`${data.month}`);
                $('#day').text(`${data.day}`);
                $('#hour').text(`${data.hour}`);
                $('#minute').text(`${data.minutes}`);
                $('#second').text(`${data.seconds}`);
                $('#no-server').text(`${data.noServer}`)

            })

        }, 1000);
```

## 5. Dynamic reverse proxy configuration
Pour implémenter le reverse proxy, nous avons décidé d'utiliser docker compose. Il suffisait donc de créer différents services en leur attribuant un nom.

Nous n'avions donc plus à écrire l'adresse ip des différents services, qui pouvait changer à chaque redémarrage, dans tous nos fichiers de configuration.

## Bonus - Load balancing and round-robine vs sticky session
Comme expliqué au chapitre 3, nous avons implémenté le load balancing sur nos serveurs dynamiques et statiques, permettant de rediriger les clients sur plusieurs serveurs et de répartir ainsi la charge de travail.

Par défaut, la configuration est en round-robine, ce qui signifie que le client sera redirigé aléatoirement vers un des serveurs. Dans le cas d'une sticky session, le client est toujours redirigé vers le même serveur. Nous l'avons intégré en ajoutant cette ligne aux streams dans le fichier default.conf :
```
ip_hash;
```
Lors de sa première requête, nginx redirige aléatoirement le client vers un des serveurs et enregistre son adresse ip afin de pouvoir envoyer toutes ses prochaines requêtes vers ce même serveur.