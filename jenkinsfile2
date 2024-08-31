pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        AWS_DEFAULT_REGION = 'us-east-2'
        AWS_ACCOUNT_ID = '875851908797'
        ECR_REPO_NAME = 'node-app'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        ECS_CLUSTER_NAME = 'nodejs-app'
        ECS_SERVICE_NAME = 'webapp-deployment'
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${ECR_REPO_NAME}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/kenneth-stack/nodejs-jenkins-pipeline.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                    docker build -t ${REPOSITORY_URI}:${IMAGE_TAG} .
                    """
                }
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withAWS(credentials: 'aws_credentials', region: "${AWS_DEFAULT_REGION}") {
                    script {
                        sh """
                        aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com
                        """
                    }
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                script {
                    sh """
                    docker push ${REPOSITORY_URI}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage('Deploy to ECS') {
            steps {
                withAWS(credentials: 'aws_credentials', region: "${AWS_DEFAULT_REGION}") {
                    script {
                        sh """
                        aws ecs update-service --cluster ${ECS_CLUSTER_NAME} --service ${ECS_SERVICE_NAME} --force-new-deployment
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker images'
            sh 'docker rmi ${REPOSITORY_URI}:${IMAGE_TAG}'
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
