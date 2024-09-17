pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'  // Path to docker-compose.yml
        PORT_NGINX = '8082'
        DOCKER_CREDENTIALS_ID = 'docker-hub'  // Optional, if pushing images to Docker Hub
    }

    stages {

        // Step 1: Checkout the repository
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Step 2: Build and run using Docker Compose
        stage('Build and Deploy with Docker Compose') {
            steps {
                script {
                    // Build and deploy the service using docker-compose
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d"
                }
            }
        }

        // Optional Step: Push to Docker Hub
        stage('Push to Docker Hub') {
            when {
                expression {
                    return false  // Set this to true to enable Docker push
                }
            }
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh "docker-compose -f ${DOCKER_COMPOSE_FILE} push"
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful. App is available at http://<your_vm_ip>:${PORT_NGINX}"
        }
        failure {
            echo "Deployment failed"
        }
    }
}
