pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/your-repo/thetiptop-web.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("thetiptop-web:latest")
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    docker.image("thetiptop-web:latest").inside {
                        sh 'npm run test'
                    }
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
