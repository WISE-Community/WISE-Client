#!/bin/bash

# Required
# Install AWS CLI
# AWS account with permission to access the pipeline
# AWS access key ID associated with your AWS account
# AWS secret access key associated with your AWS account
# Run aws configure on the command line to register your AWS access keys locally
# Install jq command
# Install git command (you probably already have this installed)

# Check if any testing pipelines are in use. If any testing pipelines are in use, the global
# variable any_testing_pipeline_in_use will be set to true.
function check_if_any_testing_pipeline_in_use() {
  testing_pipelines=(
    "private-wise-api-pipeline"
    "private-wise-client-github-actions-pipeline"
    "private-wise-client-pipeline"
  )

  for testing_pipeline in "${testing_pipelines[@]}"; do
    is_testing_pipeline_in_use $testing_pipeline
  done
}

# Check if the testing pipeline is in use. If the testing pipeline is in use, this function will set
# the global variable any_testing_pipeline_in_use to true.
function is_testing_pipeline_in_use() {
  testing_pipeline_name=$1

  # Get all stage names and the status for each stage
  declare -a statuses=($(aws codepipeline get-pipeline-state --name $testing_pipeline_name |
      jq -c -r '.stageStates[] | { stageName: .stageName, status: .latestExecution.status }'))

  for status in "${statuses[@]}"; do
    # Get the stage name without double quotes
    stageName=$(echo $status | jq '.stageName' | tr -d '"')

    # Get the status without double quotes
    status=$(echo $status | jq '.status' | tr -d '"')

    if [[ "$status" == "InProgress" ]]; then
      any_testing_pipeline_in_use=true
    fi
  done
}

function print_deploy_info() {
  if [[ "$1" == "--dry-run" ]]; then
    echo "Dry run not actually deploying"
  else
    echo "Deploying"
  fi
  echo "Branch: $branch_name"
  echo "Commit Hash: $commit_hash"
  echo "Build Id: $latest_build_id"
}

# Check if the branch name was provided as an argument
if [[ -z $1 ]]; then
  echo "Error: branch name required"
  echo "Example usage: ./start-testing.sh issue-123-fix-a-problem"
  exit 1
fi

# Check if the branch exists
if [[ -z $(git ls-remote --heads origin $1) ]]; then
  echo "Error: branch $1 does not exist"
  exit 1
fi

pipeline_name=private-wise-client-github-actions-pipeline
project_name=wise-client-github-actions-project
branch_name=$1

# Get all builds created by GitHub Actions Pull Requests
build_ids=$(aws codebuild list-builds-for-project --max-items 100 --project-name $project_name |
    jq -c '.ids | join(" ")' | tr -d '"')

if [[ -z "$build_ids" ]]; then
  echo "Error: no builds found"
  exit 1
fi

# Get the latest build info for the specified branch which will be an array with the build id and
# commit hash.
# It will look something like this
# [
#   "wise-client-github-actions-project:e1bbb411-2d84-4a71-8301-b875190d80ac",
#   "ddfa9e00f4de5ff32c1fea731ba67e4cea086ffe"
# ]
query="builds[? environment.environmentVariables[? \
    name=='GITHUB_HEAD_REF' && value=='$branch_name']].[id, sourceVersion] | [0]"
latest_build_info=$(aws codebuild batch-get-builds --ids $build_ids --query "$query")

# Get the latest build id without the project name prefix
# The latest_build_id will look something like this
# e1bbb411-2d84-4a71-8301-b875190d80ac
latest_build_id=($(echo $latest_build_info | jq '.[0]' | tr -d '"' | cut -d ':' -f2))

# Get the commit hash that was used for the build
commit_hash=($(echo $latest_build_info | jq '.[1]' | tr -d '"'))

if [[ "$2" == "--dry-run" ]]; then
  # Dry run will not update the pipeline and will not start the pipeline
  print_deploy_info $2
  exit 0
fi

# Check if any testing pipelines are in use
any_testing_pipeline_in_use=false
check_if_any_testing_pipeline_in_use

if [[ "$any_testing_pipeline_in_use" == true ]]; then
  echo "Error: a testing pipeline is already in use"
  exit 1
fi

# Get the JSON definition of the pipeline without the metadata
pipeline_json=$(aws codepipeline get-pipeline --name $pipeline_name | jq 'del(.metadata)')

# Create a regex to find the S3 object key and value
s3_object_key_value_regex="\"S3ObjectKey\": \"[-\/\.a-z0-9]*\""

if [[ $pipeline_json =~ $s3_object_key_value_regex ]]; then
  # Get the S3 object key and value string that we found
  # It will look something like this
  # "S3ObjectKey": "4dfa518f-07a0-4237-830d-a3c17ffa87a4/wise-client.zip"
  previous_s3_object_key_value=${BASH_REMATCH[0]}
  
  # Escape the forward slash otherwise the sed command below will not work
  previous_s3_object_key_value=$(echo $previous_s3_object_key_value | sed 's/\//\\\//g')

  # Generate the new S3 object key and value string
  new_s3_object_key_value="\"S3ObjectKey\": \"$latest_build_id\/wise-client.zip\""

  # Replace the previous S3 object key and value with the new S3 object key and value
  updated_pipeline_json=$(echo $pipeline_json |
      sed "s/$previous_s3_object_key_value/$new_s3_object_key_value/")

  # Update the pipeline to use the latest build for the specified branch
  aws codepipeline update-pipeline --cli-input-json "$updated_pipeline_json" > /dev/null

  if [[ $? -eq 0 ]]; then
    # Successfully updated the pipeline so now we will start it
    aws codepipeline start-pipeline-execution --name $pipeline_name > /dev/null
    print_deploy_info
    exit 0
  else
    echo "Error: could not update the pipeline"
    exit 1
  fi
else
  echo "Error: could not find the S3ObjectKey in the pipeline JSON so we could not update it"
  exit 1
fi