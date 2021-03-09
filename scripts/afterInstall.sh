#!/bin/bash

export HOME=/home/ubuntu

exec &>> $HOME/deploy.log

echo "Finishing deployment at $(date)"