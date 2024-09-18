pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        IMAGE_NAME = 'furiousducks6/angular-app'
        DOCKER_CREDENTIALS_ID = 'docker-hub'
        SLACK_CHANNEL = '#social'
        SLACK_CREDENTIALS_ID = 'slack'
        WORKDIR = '/usr/src/app'
        BRANCH_NAME = '' // Define a global variable for the branch name
    }

    stages {
        
        stage('Checkout') {
            steps {
               
                script {
                   sh "echo bonjour"
                }
            }
        }

}
