#!/bin/bash
eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 id_rsa # Allow read access to the private key
ssh-add id_rsa # Add the private key to SSH

echo -e "Host $IP\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config

sftp root@$IP << !
    cd $DEPLOY_DIR
    put -r bin
    put -r node_modules
!

git config --global push.default matching
git remote add deploy ssh://root@$IP$DEPLOY_DIR
git push deploy master

echo "Completed!"

ssh root@$IP <<EOF
  cd $DEPLOY_DIR
  killall -s KILL apache
  killall -s KILL node
  cd bin
  npm install forever -g 
  forever start main.js
  exit
EOF