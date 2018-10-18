module.exports = {


    apps: [
        // First application
        {
            name: 'community-chat',
            script: 'npm start',
            env: {
                COMMON_VARIABLE:
                    'true'
            },
            env_production: {

                NODE_ENV:
                    'production'

            }

        },

    ],



    /**
    
    * Deployment section
    
    * http://pm2.keymetrics.io/docs/usage/deployment/
    
    */

    deploy: {

        production: {

            key: '/Users/Juico/.ssh/id_rsa',

            user: 'ubuntu',

            key: "/Users/Juico/.ssh/id_rsa",

            host: ['52.14.229.151'],

            ref: 'origin/master',

            ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no", "ForwardAgent=yes"],

            repo: 'git@github.com:nalnir/community-chat.git',

            path: '/community-chat',

            'pre-setup':
                "ls -la; sudo mkdir /community-chat ; sudo chown -R ubuntu.ubuntu /community-chat ; " +
                "sudo curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - ; " +
                "sudo apt-get install -y nodejs ; " +
                "sudo npm install pm2 -g ; ",
            'pre-deploy':
                'sudo mkdir /community-chat ; ' +
                'sudo mkdir /community-chat/source ; sudo mkdir /community-chat/shared ;' +
                'sudo chown -R ubuntu.ubuntu /community-chat',
            'pre-deploy-local':
                "echo 'This is a local executed command'",
            'post-deploy':
                'sudo npm install && ' +
                'sudo pm2 reload ecosystem.config.js --env production && ' +
                'sudo pm2 restart community-chat && ' +
                'sudo pm2 start'
        },
    }
};
