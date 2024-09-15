pipeline {
    agent any

    environment {
        // Define environment variables
        DOCKER_IMAGE = 'angular-app:latest'
        WORKDIR = '/usr/src/app'
        SLACK_CHANNEL = '#social'
        SLACK_CREDENTIALS_ID = 'slack'
        IMAGE_NAME = 'furiousducks6/angular-app'
        DOCKER_CREDENTIALS_ID = 'docker-hub'
        PATH_TO_ANGULAR_APP = '/usr/src/app'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = 'latest-dev'
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh "docker build -t ${IMAGE_NAME}:${imageTag} ."
                        sh "docker images"
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    docker.image(DOCKER_IMAGE).inside("--user root -w ${WORKDIR}") {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Run Build') {
            steps {
                script {
                    docker.image(DOCKER_IMAGE).inside("--user root -w ${WORKDIR}") {
                        sh 'npm run build -- --prod'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    docker.image(DOCKER_IMAGE).inside("--user root -w ${WORKDIR}") {
                        sh 'npm test -- --watch=false'
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
                    sh """
                        docker run --rm -v ${WORKDIR}:/app -w /app ${IMAGE_NAME}:latest-dev sh -c "npm run deploy:dev"
                    """
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        def imageTag = 'latest-dev'
                        docker.image("${IMAGE_NAME}:${imageTag}").push(imageTag)
                        docker.image("${IMAGE_NAME}:${imageTag}").push('latest')
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
        unstable {
            emailext (
                to: 'tchantchoisaac1998@gmail.com',
                subject: "Build Unstable: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "The build is unstable.\n\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}"
            )
            slackSend(channel: SLACK_CHANNEL, message: "Build Unstable: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}")
        }
        always {
            emailext (
                to: 'tchantchoisaac1998@gmail.com',
                subject: "Pipeline Finished: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "Pipeline finished.\n\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}\nResult: ${currentBuild.result}"
            )
            slackSend(channel: SLACK_CHANNEL, message: "Pipeline Finished: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}")
        }
    }
}
