#!/bin/bash

export HOME=/home/ubuntu
export WISE_BUILD_FILES=$HOME/wise-build-files

sudo -u ubuntu -g ubuntu touch $HOME/deploy.log
exec &>> $HOME/deploy.log

echo "Starting deployment at $(date)"

echo "Updating Ubuntu"
apt-get update
apt-get upgrade -y

echo "Setting server timezone to Los Angeles"
timedatectl set-timezone America/Los_Angeles

echo "Installing AWS CLI"
apt-get install awscli -y

echo "Downloading files from wise-build-files S3 bucket"
sudo -u ubuntu -g ubuntu mkdir $WISE_BUILD_FILES
sudo -u ubuntu -g ubuntu aws s3 sync --exclude "legacy.war" s3://wise-build-files $WISE_BUILD_FILES
chmod u+x $WISE_BUILD_FILES/sync.sh

echo "Installing Nginx"
apt-get install nginx -y

echo "Adding ip to nginx.conf"
sed 's/http {/http {\n        add_header ip $server_addr;/' -i /etc/nginx/nginx.conf
sed 's/include \/etc\/nginx\/sites-enabled\/\*;/include \/etc\/nginx\/sites-enabled\/\*;\n\n        ##\n        # Browser preferred language detection \(does NOT require AcceptLanguageModule\)\n        ##\n\n        map \$http_accept_language \$accept_language {\n                ~\*\^tr tr;\n                ~\*\^es es;\n                ~\*\^pt pt;\n                ~\*\^ja ja;\n                ~\*\^zh-Hans zh-Hans;\n                ~\*\^zh-Hant zh-Hant;\n                ~\*\^zh-CN zh-Hans;\n                ~\*\^zh-TW zh-Hant;\n        }/' -i /etc/nginx/nginx.conf

echo "Adding gzip_types to nginx.conf"
sed 's/gzip on;/gzip on;\n        gzip_types text\/plain text\/xml image\/gif image\/jpeg image\/png image\/svg+xml application\/json application\/javascript application\/x-javascript text\/javascript text\/css;/' -i /etc/nginx/nginx.conf

echo "Copying WISE Nginx config file to Nginx sites-enabled folder"
rm -f /etc/nginx/sites-enabled/*
cp $WISE_BUILD_FILES/client/wise.conf /etc/nginx/sites-enabled/wise.conf

echo "Restart Nginx"
systemctl restart nginx

echo "Copying .vimrc file to the ubuntu home folder"
sudo -u ubuntu -g ubuntu cp $WISE_BUILD_FILES/.vimrc $HOME/.vimrc

echo "Appending text to .bashrc"
cat $WISE_BUILD_FILES/client/append-to-bashrc.txt >> ~/.bashrc
source ~/.bashrc

echo "Copying message of the day file to update-motd.d folder to display notes on login"
cp $WISE_BUILD_FILES/client/99-notes /etc/update-motd.d/99-notes
chmod 755 /etc/update-motd.d/99-notes

echo "Installing tree"
apt-get install tree -y