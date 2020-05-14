# Installation

## `kubectl` (default)

1. Clone repo
1. Verify [`deploy/authrbac.yaml`](https://github.com/circonus-labs/circonus-kubernetes-agent/blob/master/deploy/authrbac.yaml), alter any applicable settings for cluster security
1. Change any applicable settings in [`deploy/configuration.yaml`](https://github.com/circonus-labs/circonus-kubernetes-agent/blob/master/deploy/configuration.yaml), minimum required:
   * Circonus API Token
   * check target - so the agent can find the check on restart (short, unique string w/o spaces - normally this is an FQDN)
   * Kubernetes name - used for check title when creating a check
   * It is recommended that [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) be installed in the cluster and collection enabled in the configuration for all dashboard tabs to function
1. Change any applicable settings in [`deploy/deployment.yaml`](https://github.com/circonus-labs/circonus-kubernetes-agent/blob/master/deploy/deployment.yaml)
1. Apply `kubectl apply -f deploy/`

## `helm` (contrib)

1. Clone repo
1. Make updates to files in [`contrib/helm`](https://github.com/circonus-labs/circonus-kubernetes-agent/tree/master/contrib/helm) to customize settings
1. Install

```sh
helm install contrib/helm \
  --name=<Helm release name> \
  --set=circonus_api_key=<some valid Circonus API key> \
  --set=kubernetes_name=<kubernetes-name> \
  --set=circonus_check_target=<circonus-check-target> \
  --wait
```
