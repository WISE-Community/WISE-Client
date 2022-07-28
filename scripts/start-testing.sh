#!/bin/bash

# Required
# Commit access to the Github repo
# Install AWS CLI
# AWS account with permission to access the pipeline
# AWS access key ID associated with your AWS account
# AWS secret access key associated with your AWS account
# Run aws configure on the command line to register your AWS access keys locally

pipeline_name=private-wise-client-pipeline

# Check if the branch name was provided as an argument
if [[ -z $1 ]]; then
  echo "Error: branch name required"
  echo "Example usage: ./start-testing.sh issue-123-fix-a-problem"
  exit 0
fi

# Check if the branch exists
if [[ -z $(git ls-remote --heads origin $1) ]]; then
  echo "Error: branch $1 does not exist"
  exit 0
fi

# Put the code from the branch we want to test into the testing branch
git fetch
git checkout $1
git pull
git checkout testing
git reset --hard $1
git push origin testing --force

# Start the AWS Codepipeline
echo "Starting $pipeline_name with $1";
aws codepipeline start-pipeline-execution --name $pipeline_name
