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

any_pipeline_in_use=false
any_pipeline_ready_for_testing=false

function display_pipeline_status() {
  pipeline_name=$1
  echo "- Status for $pipeline_name -"

  # Get all the stage names and their statuses in an array of objects
  declare -a statuses=($(aws codepipeline get-pipeline-state --name $pipeline_name |
      jq -c -r '.stageStates[] | { stageName: .stageName, status: .latestExecution.status }'))

  statusOutput=""

  for status in "${statuses[@]}"; do
    # Get the stage name without double quotes
    stageName=$(echo $status | jq '.stageName' | tr -d '"')

    # Get the status without double quotes
    status=$(echo $status | jq '.status' | tr -d '"')

    # Accumulate the stage name and status
    statusOutput+="$stageName $status\n"

    if [[ "$status" == "InProgress" ]]; then
      any_pipeline_in_use=true
      if [[ "$stageName" == "Approve-Terminate-Private-Instances" ]]; then
        any_pipeline_ready_for_testing=true
      fi
    fi
  done

  # Display the stage names and statuses in a table
  echo -e "$statusOutput" | column -t
}

testing_pipelines=(
  "private-wise-api-and-client-pipeline"
  "private-wise-api-pipeline"
  "private-wise-client-github-actions-pipeline"
)

# Show the status for all the testing pipelines
for testing_pipeline in "${testing_pipelines[@]}"; do
  display_pipeline_status $testing_pipeline
  echo
done

# Display whether any testing pipeline is in use
if [[ "$any_pipeline_ready_for_testing" == true ]]; then
  echo "A testing pipeline is currently in use and ready for testing"
elif [[ "$any_pipeline_in_use" == true ]]; then
  echo "A testing pipeline is currently in use"
else
  echo "Testing pipelines are currently not in use"
fi
