# Node.js Jenkins Pipeline

This repository contains Html, a Node.js application and its Jenkins pipeline configuration for continuous integration and deployment (CI/CD). The pipeline automates the process of building, testing, and deploying the Node.js application to an EC2 instance.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Pipeline Overview](#pipeline-overview)
- [Stages Description](#stages-description)
- [Deployment Instructions](#deployment-instructions)
- [Troubleshooting and Challenges Faced](#troubleshooting-and-challenges-faced)
- [Contributing](#contributing)

## Prerequisites

Before setting up this pipeline, ensure you have the following:

- **Jenkins**: Installed and configured Jenkins server.
- **Node.js**: Node.js and npm installed on your local machine and EC2 instance.
- **EC2 Instance**: An Ubuntu EC2 instance configured to deploy your application.
- **Jenkins Plugins**: Install the following Jenkins plugins:
  - **Pipeline**: For defining pipeline jobs.
  - **SSH Agent**: For managing SSH credentials.
  - **NodeJS**: To install and manage Node.js versions.
- **SSH Key**: An SSH key for accessing the EC2 instance (add this to Jenkins credentials).

## Setup

- **Clone the Repository**

   ```bash
   git clone https://github.com/kenneth-stack/nodejs-jenkins-pipeline.git
   cd nodejs-jenkins-pipeline
   ```

## Jenkins Pipeline Setup

1. **Create a Jenkins Pipeline Job**
   - **Open Jenkins Dashboard**: Navigate to your Jenkins dashboard.
   - **Create a New Item**: Click on "New Item" in the left-hand menu.
   - **Choose Pipeline**: Enter a name for your job and select "Pipeline" as the type, then click "OK".

2. **Configure Pipeline**
   - **Add Node.js Installation**: Go to `Manage Jenkins` -> `Global Tool Configuration`, and add a Node.js installation named `nodejs`.
   - **Add SSH Credentials**: Go to `Manage Jenkins` -> `Manage Credentials`, and add a new SSH Username with private key. Use the ID `ec2-ssh-key` for the SSH key.
   - **Pipeline Definition**: In the "Pipeline" section, set the "Definition" field to "Pipeline script from SCM".
   - **SCM Configuration**:
     - **SCM**: Select "Git".
     - **Repository URL**: Enter the URL of your Git repository (e.g., `https://github.com/kenneth-stack/nodejs-jenkins-pipeline.git`).
     - **Credentials**: If your repository requires authentication, add and select the appropriate credentials.(only private repo requires this)
     - **Branch Specifier**: Set this to `main` or the branch you are using.
   - **Script Path**: Set this to `Jenkinsfile` (the path to the Jenkinsfile in your repository).

4. **Save and Build**
   - **Save Configuration**: Click "Save" to store your job configuration.
   - **Build Job**: Trigger a build by clicking "Build Now". Jenkins will use the `Jenkinsfile` from your repository to execute the pipeline.

## Pipeline Overview

The Jenkins pipeline automates the following tasks:

1. **Checkout**: Pulls the latest code from the `main` branch of the GitHub repository.
2. **Install Dependencies**: Installs project dependencies using `npm ci`.
3. **Test**: Runs the test suite with `npm test`.
4. **Deploy to EC2**: Deploys the application to an EC2 instance, handling file transfer, application installation, and process management.

## Stages Description

1. **Checkout**
   - **Description**: Checks out the code from the GitHub repository.
   - **Steps**:
     - Uses Git to pull the latest code from the `main` branch.
     - Handles any errors during the checkout process.

2. **Install Dependencies**
   - **Description**: Installs the Node.js dependencies required for the application.
   - **Steps**:
     - Runs `npm ci` to install dependencies based on the `package-lock.json` file.
     - Handles any errors during the installation of dependencies.

3. **Test**
   - **Description**: Runs the test suite to ensure code quality.
   - **Steps**:
     - Executes `npm test` to run the test cases.
     - Handles any errors during the test execution.

4. **Deploy to EC2**
   - **Description**: Deploys the application to an EC2 instance.
   - **Steps**:
     - Uses `rsync` to copy files to the EC2 instance, excluding unnecessary directories like `node_modules` and `.git`.
     - Connects to the EC2 instance via SSH and performs:
       - Installation of production dependencies with `npm ci`.
       - Application deployment using `pm2` to manage the Node.js application.
     - Ensures that the application is either started or reloaded based on its current state.
     - Cleans up by removing the temporary SSH key file.

## Deployment Instructions

1. **Configure Your EC2 Instance**
   - Ensure Node.js, npm, and `pm2` are installed on your EC2 instance.
   - Set up your EC2 instance to accept SSH connections using the provided SSH key.

2. **Run the Jenkins Pipeline**
   - Trigger the pipeline manually or configure it to run automatically based on your needs.
   - Monitor the pipeline execution via the Jenkins dashboard.

## Troubleshooting and Challenges Faced

During the deployment of this project, several challenges were encountered. This section outlines these issues and provides solutions to help you overcome similar obstacles.

### 1. Module Not Found Errors

**Challenge**: 
When running the application or during the build process, Node.js threw "Module Not Found" errors for certain packages.

**Solution**:
- Ensure all required Node.js modules are properly installed:
  1. Double-check the `package.json` file to verify all necessary dependencies are listed.
  2. Compare `package.json` with `package-lock.json` to identify any discrepancies.
  3. Delete the `node_modules` directory and run `npm ci` to perform a clean installation of dependencies.
  4. If using a specific Node.js version, ensure it's compatible with all your dependencies.

**Prevention**:
- Regularly update your dependencies and use a consistent Node.js version across development and production environments.
- Consider using a tool like `npm-check-updates` to keep your dependencies current.

### 2. SSH Authentication Issues

**Challenge**:
Encountered difficulties connecting to the EC2 instance via SSH during the deployment stage.

**Solution**:
- Verify SSH key permissions and EC2 instance configuration:
  1. Check that the SSH key file has the correct permissions (typically 400 or 600).
  2. Ensure the correct key is being used for authentication in the Jenkins credentials.
  3. Verify that the EC2 instance's security group allows inbound SSH traffic from the Jenkins server's IP.
  4. Double-check the EC2 user and hostname in the Jenkins pipeline configuration.

## Contributing

If you wish to contribute to this project, please fork the repository and submit a pull request with your changes. Ensure that your changes are well-documented and tested.
