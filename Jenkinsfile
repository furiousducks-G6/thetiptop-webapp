pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build and Deploy with Docker Compose') {
            steps {
                script {
                    try {
                        // Build and deploy the service using docker-compose
                        sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d"
                    } catch (Exception e) {
                        error "Build and Deploy failed: ${e.message}"
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                echo "Deployment successful. App is available at http://167.99.134.180:7070"
            }
        }
        failure {
            script {
                echo "Deployment failed"
            }
        }
    }
}
