pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        IMAGE_NAME = 'furiousducks6/angular-app'
        DOCKER_CREDENTIALS_ID = 'docker-hub'
        SLACK_CHANNEL = '#social'
        SLACK_CREDENTIALS_ID = 'slack'
        WORKDIR = '/usr/src/app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Output the current branch for debugging
                    def branchName = env.BRANCH_NAME ?: sh(script: 'git rev-parse --abbrev-ref HEAD', returnStdout: true).trim()
                    echo "Current branch: ${branchName}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        // Build the Docker image (this will also build the Angular app)
                        sh "docker-compose -f ${COMPOSE_FILE} build"
                    }
                }
            }
        }

        stage('Deploy to Dev') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    // Start the containers
                    sh "docker-compose -f ${COMPOSE_FILE} up -d"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        def imageTag = 'latest-dev'
                        sh "docker tag ${IMAGE_NAME}:${imageTag} ${IMAGE_NAME}:latest"
                        sh "docker push ${IMAGE_NAME}:${imageTag}"
                        sh "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
        success {
            emailext (
                to: 'tchantchoisaac1998@gmail.com',
                subject: "Build Success: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "The build was successful.\n\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}"
            )
            slackSend(channel: SLACK_CHANNEL, message: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}")
        }
        failure {
            emailext (
                to: 'tchantchoisaac1998@gmail.com',
                subject: "Build Failure: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "The build failed.\n\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}"
            )
            slackSend(channel: SLACK_CHANNEL, message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}")
        }
    }
}
