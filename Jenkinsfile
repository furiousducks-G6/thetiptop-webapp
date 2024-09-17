pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        VM_USER = 'username'
        VM_IP = 'vm-ip'
        REMOTE_PATH = '/var/www/angular-app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Angular Application') {
            steps {
                script {
                    // Build the Angular application using Docker
                    sh "docker-compose -f ${DOCKER_COMPOSE_FILE} build --no-cache"
                }
            }
        }

        stage('Deploy to VM') {
            steps {
                script {
                    try {
                        // Copy the built Angular application to the VM
                        sh "scp -r dist/thetiptop-web ${VM_USER}@${VM_IP}:${REMOTE_PATH}"
                    } catch (Exception e) {
                        error "Deployment failed: ${e.message}"
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                echo "Deployment successful. App is available at http://${VM_IP}"
            }
        }
        failure {
            script {
                echo "Deployment failed"
            }
        }
    }
}
