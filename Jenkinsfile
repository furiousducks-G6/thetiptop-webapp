pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                script {
                    // Clean up workspace
                    deleteDir()
                    
                    // Checkout code from 'develop' branch
                    checkout([$class: 'GitSCM', 
                              branches: [[name: '*/develop']], 
                              userRemoteConfigs: [[url: 'https://your-repository-url.git']]
                             ])
                    
                    // Build Docker image
                    sh 'docker build -t angular-app .'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Stop and remove any existing container
                    sh 'docker-compose down || true'
                    
                    // Start containers using Docker Compose
                    sh 'docker-compose up -d'
                }
            }
        }
    }
    
    post {
        always {
            // Clean up Docker containers and images
            sh 'docker system prune -af'
        }
    }
}
