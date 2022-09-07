#!/bin/bash

# Required
# Install AWS CLI
# AWS account with permission to access the pipeline
# AWS access key ID associated with your AWS account
# AWS secret access key associated with your AWS account
# Run aws configure on the command line to register your AWS access keys locally
# Install jq command

pipeline_name=private-wise-client-github-actions-pipeline

# Get the execution token from the Approve-Terminate-Private-Instances stage/action
token=$(aws codepipeline get-pipeline-state --name $pipeline_name |
  jq -r '.stageStates[] | select(.stageName == "Approve-Terminate-Private-Instances") |
  .actionStates[] | select(.actionName == "Approve-Terminate-Private-Instances") |
  .latestExecution.token')

# Make sure we were able to retrieve the execution token
if [[ "$token" == "null" ]]; then
  echo "Error: unable to retrieve the execution token, make sure the" \
      "Approve-Terminate-Private-Instances stage is InProgress"
  exit 1
fi

# Approve the Approve-Terminate-Private-Instances stage to terminate the test servers
aws codepipeline put-approval-result \
  --pipeline-name $pipeline_name \
  --stage-name Approve-Terminate-Private-Instances \
  --action-name Approve-Terminate-Private-Instances \
  --result "summary=Done testing,status=Approved" \
  --token $token > /dev/null

if [[ $? -eq 0 ]]; then
  echo "Successfully stopped $pipeline_name"
  exit 0
else
  echo "Error: failed to stop $pipeline_name"
  exit 1
fi