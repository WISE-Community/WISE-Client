#!/bin/bash

pipeline_name=private-wise-client-github-actions-pipeline
project_name=wise-client-github-actions-project

# Check if the branch name was provided as an argument
if [[ -z $1 ]]; then
  echo "Error: branch name required"
  echo "Example usage: ./start-testing-prebuilt.sh issue-123-fix-a-problem"
  exit 0
fi

# Check if the branch exists
if [[ -z $(git ls-remote --heads origin $1) ]]; then
  echo "Error: branch $1 does not exist"
  exit 0
fi

branch_name=$1

# Get all builds created by GitHub Actions Pull Requests
build_ids=$(aws codebuild list-builds-for-project --project-name $project_name | jq -c '.ids | join(" ")' | tr -d '"')

# Get builds for the specified branch
builds=$(aws codebuild batch-get-builds --ids $build_ids --query "builds[? environment.environmentVariables[? name=='GITHUB_HEAD_REF' && value=='$branch_name']].id")

# Get the latest build for the specified branch
# By default, the builds are ordered from newest to oldest so we will get the first in the array
# The lastest_build will look something like this
# wise-client-github-actions-project:5b818116-6414-4d40-ac16-9c9ddc7ffa60
latest_build=$(echo $builds | jq '.[0]' | tr -d '"')

# Get the build id (without the project name)
latest_build_id=($(echo $latest_build | cut -d ':' -f2))

# Get the JSON definition of the pipeline
pipeline_json=$(aws codepipeline get-pipeline --name $pipeline_name | jq 'del(.metadata)')

# Create regex to find the previous S3ObjectKey
s3_object_key_regex="\"S3ObjectKey\": \"(.*?)\/wise-client\.zip\""

if [[ $pipeline_json =~ $s3_object_key_regex ]]; then
  # Get the previous S3ObjectKey
  previous_s3_object_key=${BASH_REMATCH[1]}

  # Replace the previous build id with the latest build id
  updated_pipeline_json=$(echo $pipeline_json | sed "s/$previous_s3_object_key/$latest_build_id/")

  # Update the pipeline
  aws codepipeline update-pipeline --cli-input-json "$updated_pipeline_json"

  # Start the pipeline
  aws codepipeline start-pipeline-execution --name $pipeline_name

  echo "Deploying"
  echo "Branch: $branch_name"
  echo "Build ID: $latest_build_id"
else
  echo "Error: Could not update pipeline"
  exit 0
fi