pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                script {
                    // Using SSH for GitHub authentication
                     git url: 'https://github.com/furiousducks-G6/thetiptop-webapp', branch: 'test', credentialsId: 'gitHere'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("thetiptop-web:latest")
                }
            }
        }

     

        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
