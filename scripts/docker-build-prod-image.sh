commit_id=$(git rev-parse --short HEAD)
echo "Commit ID: ${commit_id}"
docker buildx build --push -t wiseberkeley/wise-client-server:latest -t wiseberkeley/wise-client-server:${commit_id} .
