pipeline {
    agent any

    environment {
        IMAGE_NAME = 'your-dockerhub-username/angular-app'  // Update this
        DOCKER_CREDENTIALS_ID = 'docker-hub'  // Your Jenkins Docker Hub credentials
        PORT_NGINX = '8082'
    }

    stages {
        // Step 1: Checkout the repository
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Step 2: Build the Docker image using Dockerfile
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image from the Dockerfile
                    sh "docker build -t ${IMAGE_NAME}:latest ."
                }
            }
        }

        // Step 3: Run the Docker container using the built image
        stage('Deploy to NGINX') {
            steps {
                script {
                    // Remove the existing container if it exists
                    sh "docker rm -
