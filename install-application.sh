#!/usr/bin/env bash

#!/bin/bash

cd /opt/HouseLendingMain

export MONGO_DB_URL="mongodb://localhost:27017/house-lending-db"

echo "Home directory is: $HOME"
echo "install-application.sh: directory = $PWD"
echo "REPOSITORY_NAME = https://github.com/house-lending-apps/HouseLendingMain.git"
echo "targetBranch = master"

#echo "Starting to pull latest ... from $REPOSITORY_NAME "

#git pull

npm install

npm run startApplication

