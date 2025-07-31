#!/bin/bash
echo "✅ Applying all resources..."
for dir in */; do
  kubectl apply -f "$dir"
done
