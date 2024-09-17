pipeline {
    agent any

    environment {
        IMAGE_NAME_NGINX = 'nginx:alpine'
        PORT_NGINX = '8082'
        ANGULAR_BUILD_DIR = "${env.WORKSPACE}/dist/angular-app"  // Adjust if needed
        DOCKER_CREDENTIALS_ID = 'docker-hub' // Optional: if pushing images to Docker Hub
    }

    stages {

        // Step 1: Checkout the repository
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Step 2: Install Angular dependencies and build the Angular app
        stage('Build Angular App') {
            steps {
                script {
                    sh 'npm install'  // Installing npm dependencies
                    sh 'npm run build --prod'  // Build the Angular app for production
                }
            }
        }

        // Step 3: Verify that the Angular build output exists
        stage('Verify Build') {
            steps {
                script {
                    echo "Checking Angular build directory contents"
                    sh "ls -la ${ANGULAR_BUILD_DIR}"  // List the Angular build directory to verify it contains files
                }
            }
        }

        // Step 4: Deploy the Angular app with NGINX using Docker
        stage('Deploy to NGINX') {
            steps {
                script {
                    // Remove the existing container if it exists to avoid conflict
                    sh "docker rm -f nginx-app || true"

                    // Run the NGINX container and mount the Angular build directory
                    sh """
                        docker run --name nginx-app \
                        -v ${ANGULAR_BUILD_DIR}:/usr/share/nginx/html \
                        -p ${PORT_NGINX}:80 \
                        -d ${IMAGE_NAME_NGINX}
                    """
                }
            }
        }

        // Optional Step: Push the NGINX Docker image to Docker Hub (only if required)
        stage('Push to Docker Hub') {
            when {
                expression {
                    return false // Set this to true if you want to push images to Docker Hub
                }
            }
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        sh "docker commit nginx-app ${IMAGE_NAME_NGINX}:latest"
                        sh "docker push ${IMAGE_NAME_NGINX}:latest"
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
