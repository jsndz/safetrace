We will start with the Namespace.

Namespace groups related resources together.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: safetrace
```

Next we will have a common config map for storing non-sensitive, environment-level data shared across services
