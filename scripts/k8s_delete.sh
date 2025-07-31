#!/bin/bash
echo " Deleting all resources..."
for dir in */; do
  kubectl delete -f "$dir" --ignore-not-found
done
