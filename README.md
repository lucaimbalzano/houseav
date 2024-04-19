# <img src="https://github.com/lucaimbalzano/houseav/assets/45575898/fcb0fd99-8f6d-4873-962e-188df3e834be" width="90" height="105" />Houseav


## Dev & Prod environment setup 
```
$ NODE_ENV=development node ./api/index.js
$ NODE_ENV=production node ./api/index.js
```

## Docker
```
$ docker volume create mysql_data_houseav_db
$ docker-compose --env-file .env.dev up
# change css for the adminer
$ docker cp ./api/utils/adminer.css $(docker ps -qf "name=houseav-adminer"):/var/www/html/
```
