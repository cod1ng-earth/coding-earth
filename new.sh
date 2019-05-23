#!/usr/bin/env bash

CURDIR=`pwd`

APPDIR=$CURDIR/$1
mkdir $APPDIR
cp $CURDIR/template/Dockerfile.tpl $APPDIR/Dockerfile
cp $CURDIR/template/sample-platform-file.yaml $APPDIR/.platform.app.yml

cat >>docker-compose.yml <<EOL

  $1:
    build:
      context: ./$1
    volumes:
      - ./$1:/app
      - /app/node_modules
EOL

cat >>.platform/routes.yaml <<EOL

"https://$1.{default}/":
  type: upstream
  upstream: "$1:http"
EOL

WEBFILE=$CURDIR/web/conf.d/$1.conf
cp $CURDIR/template/web.conf $WEBFILE
sed  's/#servicename#/'"$1"'/g' $WEBFILE | tee $WEBFILE > /dev/null 2>&1

cat << EOL
add this to your /etc/hosts file:
127.0.0.1   $1.devday.local
EOL


