#!/bin/bash

IMAGES=(
  safetrace-auth
  safetrace-gateway
  safetrace-client
  safetrace-server
  safetrace-alert
  safetrace-geo-fencer
  safetrace-location-logger
)

for IMAGE in "${IMAGES[@]}"; do
  docker push jsndz/${IMAGE}:latest
done
