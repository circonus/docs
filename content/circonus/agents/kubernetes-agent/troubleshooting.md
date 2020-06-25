# Troubleshooting

>Note: ssh to the master, use `kubectl proxy` or `kubectl get --raw` and alter URLs below accordingly.

## General setup

Get service IP for api server

```sh
kubectl get svc kubernetes
```

Make a note of the cluster-ip for the api server (default name is 'kubernetes'). The cluster-ip will be used in all of the curl examples below.

e.g.

```sh
master01:~$ kubectl get svc kubernetes
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   33d
```

Get bearer token

Note: assumes the agent deployment has already been done, so that the service account exists. The token will be used in all of the curl examples below.

```sh
TOKEN=$(kubectl get secret -o jsonpath="{.items[?(@.metadata.annotations['kubernetes\.io/service-account\.name']=='circonus-kubernetes-agent')].data.token}"|base64 -d)
```

Verify API is reachable

```sh
curl --cacert /etc/kubernetes/pki/ca.crt -H "Authorization: Bearer $TOKEN" https://10.96.0.1/api
```

e.g.

```sh
master01:~$ curl --cacert /etc/kubernetes/pki/ca.crt -H "Authorization: Bearer $TOKEN" https://10.96.0.1/api
{
  "kind": "APIVersions",
  "versions": [
    "v1"
  ],
  "serverAddressByClientCIDRs": [
    {
      "clientCIDR": "0.0.0.0/0",
      "serverAddress": "172.16.20.50:6443"
    }
  ]
}
```

---

## kube-state-metrics

Test kube-state-metrics

Check the service definition

```sh
curl --cacert /etc/kubernetes/pki/ca.crt -H "Authorization: Bearer $TOKEN" \
    "https://10.96.0.1/api/v1/services?fieldSelector=metadata.name=kube-state-metrics"
```

The agent will use the _names_ of the ports to build the request URL, it specifically looks for `http-metrics` and `telemetry`

```sh
curl --cacert /etc/kubernetes/pki/ca.crt -H "Authorization: Bearer $TOKEN" \
     https://10.96.0.1/api/v1/namespaces/kube-system/services/kube-state-metrics:http-metrics/proxy/metrics
```

---

## node stats and metrics

Get list of nodes

```sh
kubectl get no
```

e.g.

```sh
master01:~$ kubectl get no
NAME               STATUS   ROLES    AGE   VERSION
master01.k8s.lan   Ready    master   33d   v1.17.0
node01.k8s.lan     Ready    <none>   33d   v1.17.0
node02.k8s.lan     Ready    <none>   33d   v1.17.0
node03.k8s.lan     Ready    <none>   33d   v1.17.0
node04.k8s.lan     Ready    <none>   33d   v1.17.0
```

Test basic node info

```sh
curl --cacert /etc/kubernetes/pki/ca.crt -H "Authorization: Bearer $TOKEN" \
     https://10.96.0.1/api/v1/nodes
```

Test kublet summary stats

```sh
curl --cacert /etc/kubernetes/pki/ca.crt -H "Authorization: Bearer $TOKEN" \
     https://10.96.0.1/api/v1/nodes/master01.k8s.lan/proxy/stats/summary
```

Test kubelet metrics

```sh
curl --cacert /etc/kubernetes/pki/ca.crt -H "Authorization: Bearer $TOKEN" \
     https://10.96.0.1/api/v1/nodes/master01.k8s.lan/proxy/metrics
```

---

## api-server

Test metrics-server

```sh
curl --cacert /etc/kubernetes/pki/ca.crt -H "Authorization: Bearer $TOKEN" \
     https://10.96.0.1/metrics
```

---

## events

Observe what events _should_ be flowing

```sh
kubectl get events -w -o json
```

---

## pods

See what pods are running in your cluster on each node.

```sh
kubectl get po -o wode -A
```

---

## utilization

See what resources pods are using in the cluster

```sh
kubectl top po -A
```

---

## FAQ & Issues encountered

1. When customizing configuration items in `configuration.yaml` which are commented out by default, ensure that the corresponding configuration lines in `deployment.yaml` are uncommented in order for the configuration item to be applied
1. When updating `configuration.yaml` the deployment must be updated as well, ConfigMaps are not dynamically updated
    1. update `coonfiguration.yaml`
    1. `kubectl apply -f deploy/configuration.yaml`
    1. `kubectl rollout restart deploy/circonus-kubernetes-agent`
1. If running agent in a separate namespace, ensure that `namespace` attributes in `authrbac.yaml` are the same
