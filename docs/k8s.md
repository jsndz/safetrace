We will start with the Namespace.

Namespace groups related resources together.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: safetrace
```

Next we will have a common config map for storing non-sensitive, environment-level data shared across services

next add configMap

which has all environment variables for the deploments in the namespace

Next will be scerets like db connections etc which will be in secret object

next will be the actual deployment
provides a set of resource constraints and high level management for pods and replicaset

apiVersion: apps/v1
kind: Deployment
metadata:
name: auth
namespace: safetrace
spec:
replicas: 3
selector:
matchLabels:
app: auth
template:
metadata:
labels:
app: auth
spec:
containers: - name: auth
image: jsndz/safetrace_auth:latest
resources:
limits:
memory: "128Mi"
cpu: "500m"
requests:
memory: "64Mi"
cpu: "250m"
ports: - containerPort: 3001
