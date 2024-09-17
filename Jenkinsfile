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

        // Step 2: Build and deploy using Docker Compose
        stage('Build and Deploy with Docker Compose') {
            steps {
                script {
                    try {
                        // Pull any required images (if necessary)
                        sh "docker-compose -f ${DOCKER_COMPOSE_FILE} pull"
                        
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
                echo "Deployment successful. App is available at http://<your_vm_ip>:${PORT_NGINX}"
            }
        }
        failure {
            script {
                echo "Deployment failed"
            }
        }
    }
}
