pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        BRANCH_NAME = '' // Global variable for branch name
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    BRANCH_NAME = env.GIT_BRANCH ?: sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    echo "Current branch: ${BRANCH_NAME}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // Build using docker-compose with no cache
                sh "docker-compose -f ${COMPOSE_FILE} build --no-cache"
            }
        }

        stage('Deploy to Dev') {
            when {
                expression { BRANCH_NAME == 'origin/develop' }
            }
            steps {
                // Deploy the Docker containers
                sh "docker-compose -f ${COMPOSE_FILE} up -d"
            }
        }
    }

    post {
        always {
            echo currentBuild.result == 'SUCCESS' ? 'Success' : 'Failure'
        }
    }
}
