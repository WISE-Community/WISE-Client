#!/bin/bash

# Required
# Install AWS CLI
# AWS account with permission to access the pipeline
# AWS access key ID associated with your AWS account
# AWS secret access key associated with your AWS account
# Run aws configure on the command line to register your AWS access keys locally
# Install jq command
#
# Recommended
# Install watch command

pipeline_name=private-wise-client-pipeline
echo "Status for $pipeline_name"

# Get all the stage names and their statuses in an array of objects
declare -a statuses=($(aws codepipeline get-pipeline-state --name $pipeline_name |
  jq -c -r '.stageStates[] | { stageName: .stageName, status: .latestExecution.status }'))

statusOutput=""
is_pipeline_in_use=false
is_pipeline_ready_for_testing=false

for status in "${statuses[@]}"; do
  # Get the stage name without double quotes
  stageName=$(echo $status | jq '.stageName' | tr -d '"')

  # Get the status without double quotes
  status=$(echo $status | jq '.status' | tr -d '"')

  # Accumulate the stage name and status
  statusOutput+="$stageName $status\n"
  
  if [[ "$status" == "InProgress" ]]; then
    is_pipeline_in_use=true
    if [[ "$stageName" == "Approve-Terminate-Private-Instances" ]]; then
      is_pipeline_ready_for_testing=true
    fi
  fi
done

# Display the stage names and statuses in a table
echo -e "$statusOutput" | column -t

# Display whether the pipeline is in use or not
if [[ "$is_pipeline_ready_for_testing" == true ]]; then
  echo "Pipeline is currently in use and ready for testing"
elif [[ "$is_pipeline_in_use" == true ]]; then
  echo "Pipeline is currently in use"
else
  echo "Pipeline is currently not in use"
fi
