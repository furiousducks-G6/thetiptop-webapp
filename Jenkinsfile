pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml' // Chemin vers le fichier docker-compose
        DOCKER_IMAGE = 'angular-app:latest'
        IMAGE_NAME = 'furiousducks6/angular-app'
        DOCKER_CREDENTIALS_ID = 'docker-hub'
        SLACK_CHANNEL = '#social'
        SLACK_CREDENTIALS_ID = 'slack'
        WORKDIR = '/usr/src/app'
    }

    stages {
        stage('Checkout') {
            steps {
                // Récupère le code source depuis le dépôt Git
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Utilise Docker Compose pour construire l'image
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh "docker-compose -f ${COMPOSE_FILE} build"
                        sh "docker images"
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Exécute les commandes dans le conteneur Docker géré par Docker Compose
                    sh "docker-compose -f ${COMPOSE_FILE} run --rm angular-app npm install"
                }
            }
        }

        stage('Run Build') {
            steps {
                script {
                    // Exécute la commande de build Angular dans le conteneur Docker
                    sh "docker-compose -f ${COMPOSE_FILE} run --rm angular-app npm run build -- --prod"
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Exécute les tests Angular dans le conteneur Docker
                    sh "docker-compose -f ${COMPOSE_FILE} run --rm angular-app npm test -- --watch=false"
                }
            }
        }

        stage('Deploy to Dev') {
            when {
                // Exécute le déploiement uniquement pour la branche 'develop'
                branch 'develop'
            }
            steps {
                script {
                    // Déploye l'application Angular en utilisant Docker Compose
                    sh "docker-compose -f ${COMPOSE_FILE} run --rm angular-app npm run deploy:dev"
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        def imageTag = 'latest-dev'
                        // Tag l'image Docker construite comme 'latest'
                        sh "docker tag ${IMAGE_NAME}:${imageTag} ${IMAGE_NAME}:latest"
                        // Pousse les deux versions (latest-dev et latest) vers Docker Hub
                        sh "docker push ${IMAGE_NAME}:${imageTag}"
                        sh "docker push ${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
        success {
            // Envoi d'un email et notification Slack en cas de succès
            emailext (
                to: 'tchantchoisaac1998@gmail.com',
                subject: "Build Success: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "The build was successful.\n\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}"
            )
            slackSend(channel: SLACK_CHANNEL, message: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}")
        }
        failure {
            // Envoi d'un email et notification Slack en cas d'échec
            emailext (
                to: 'tchantchoisaac1998@gmail.com',
                subject: "Build Failure: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "The build failed.\n\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}"
            )
            slackSend(channel: SLACK_CHANNEL, message: "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}")
        }
        unstable {
            // Envoi d'un email et notification Slack si le build est instable
            emailext (
                to: 'tchantchoisaac1998@gmail.com',
                subject: "Build Unstable: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "The build is unstable.\n\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}"
            )
            slackSend(channel: SLACK_CHANNEL, message: "Build Unstable: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}")
        }
        always {
            // Envoi d'un email et notification Slack à la fin du pipeline, quel que soit le résultat
            emailext (
                to: 'tchantchoisaac1998@gmail.com',
                subject: "Pipeline Finished: ${env.JOB_NAME} [${env.BUILD_NUMBER}]",
                body: "Pipeline finished.\n\nJob: ${env.JOB_NAME}\nBuild Number: ${env.BUILD_NUMBER}\nBuild URL: ${env.BUILD_URL}\nResult: ${currentBuild.result}"
            )
            slackSend(channel: SLACK_CHANNEL, message: "Pipeline Finished: ${env.JOB_NAME} #${env.BUILD_NUMBER} - ${env.BUILD_URL}")
        }
    }
}
