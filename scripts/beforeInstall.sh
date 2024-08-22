#!/bin/bash

export HOME=/home/ubuntu
export WISE_BUILD_FILES=$HOME/wise-build-files

if [[ "$DEPLOYMENT_GROUP_NAME" == "qa-wise-client-deployment-group" ]]; then
  export ENV="qa"
else
  export ENV="prod"
fi

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

echo "Update apt repository to be able to use latest stable Nginx packages"
apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring -y
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" | tee /etc/apt/sources.list.d/nginx.list
apt update

echo "Installing Nginx 1.26.2"
apt-get install nginx=1.26.2-1~$(lsb_release -sc) -y

echo "Adding ip to nginx.conf"
sed 's/http {/http {\n        add_header ip $server_addr;/' -i /etc/nginx/nginx.conf
sed 's/include \/etc\/nginx\/sites-enabled\/\*;/include \/etc\/nginx\/sites-enabled\/\*;\n\n        ##\n        # Browser preferred language detection \(does NOT require AcceptLanguageModule\)\n        ##\n\n        map \$http_accept_language \$accept_language {\n                ~\*\^tr tr;\n                ~\*\^es es;\n                ~\*\^pt pt;\n                ~\*\^ja ja;\n                ~\*\^zh-Hans zh-Hans;\n                ~\*\^zh-Hant zh-Hant;\n                ~\*\^zh-CN zh-Hans;\n                ~\*\^zh-TW zh-Hant;\n        }/' -i /etc/nginx/nginx.conf

echo "Adding gzip_types to nginx.conf"
sed 's/gzip on;/gzip on;\n        gzip_types text\/plain text\/xml image\/gif image\/jpeg image\/png image\/svg+xml application\/json application\/javascript application\/x-javascript text\/javascript text\/css;/' -i /etc/nginx/nginx.conf

echo "Remove TLS 1.0 from nginx.conf"
sed 's/TLSv1 //g' -i /etc/nginx/nginx.conf

echo "Remove TLS 1.1 from nginx.conf"
sed 's/TLSv1.1 //g' -i /etc/nginx/nginx.conf

echo "Copying WISE Nginx config file to Nginx sites-enabled folder"
rm -f /etc/nginx/sites-enabled/*
cp $WISE_BUILD_FILES/client/$ENV/wise.conf /etc/nginx/sites-enabled/wise.conf

echo "Restarting Nginx"
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

echo "Installing sysstat"
apt-get install sysstat -y

echo "Configuring sysstat parameters"
sed 's/ENABLED="false"/ENABLED="true"/' -i /etc/default/sysstat
sed 's/HISTORY=7/HISTORY=30/' -i /etc/sysstat/sysstat
sed 's/SADC_OPTIONS="-S DISK"/SADC_OPTIONS="-D -S DISK"/' -i /etc/sysstat/sysstat

echo "Enabling sysstat on startup"
systemctl enable sysstat

echo "Starting sysstat"
systemctl start sysstat