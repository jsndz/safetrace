#!/bin/bash

IMAGES=(
  safetrace_auth
  safetrace_gateway
  safetrace_client
  safetrace_server
  safetrace_alert
  safetrace_geo-fencer
  safetrace_location-logger
)

for IMAGE in "${IMAGES[@]}"; do
  docker tag $IMAGE jsndz/$IMAGE:latest
done
