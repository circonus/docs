# Settings

> Note: all of these settings are as of v0.7.1, additional settings may be present in actual repository.

Settings are maintained in [`deploy/configuration.yaml`](https://github.com/circonus-labs/circonus-kubernetes-agent/blob/master/deploy/configuration.yaml) and [`deploy/deployment.yaml`](https://github.com/circonus-labs/circonus-kubernetes-agent/blob/master/deploy/deployment.yaml). These two files need to be kept in sync. If a particular setting in configuration.yaml is uncommented, the corresponding setting in deployment.yaml must also be uncommented in order for the setting to be activated.

## Settings in `configuration.yaml`

### Secrets

```yaml
## Circonus API Key is REQUIRED
circonus-api-key: ""
## For in-cluster operation, the service account token
## will be used. Only set this to use a DIFFERENT token
## than the kubernetes-bearer-token-file setting
## below. The file will always take precedence, ensure
## kubernetes-bearer-token-file is set to "" when using
## this setting.
#kubernetes-bearer-token: ""
```

The Circonus API key is required, api tokens/keys are maintained in the Circonus UI (See Integrations>API Tokens).

### ConfigMap

The _defaults_ are reflected in the commented out settings.

```yaml
## Use a file in the container rather than a secret
#circonus-api-key-file: ""
## App name associated with Circonus API Token (or ensure token permission set to allow)
#circonus-api-app: "circonus-kubernetes-agent"
## Circonus API URL
#circonus-api-url: "https://api.circonus.com"
## Circonus API ca file if not using public https certificate
#circonus-api-ca-file: ""
## Turn on API debugging
#circonus-api-debug: "false"
## broker to use when creating a new httptrap check
#circonus-check-broker-cid: "/broker/35"
## broker ca file if not available from circonus api
#circonus-check-broker-ca-file: ""
## create a check, if one cannot be found using the target
#circonus-check-create: "true"
## or, turn create off, and specify a check which has already been created
#circonus-check-bundle-cid: ""
## comman delimited list of k:v tags to add to the check
#circonus-check-tags: ""
## Use a static target to ensure that the agent can find the check
## the next time the pod starts. Otherwise, the pod's hostname will
## be used and a new check would be created each time the pod is
## created when create is enabled.
circonus-check-target: ""
## set a custom display title for the check when it is created
#circonus-check-title: ""
## comma delimited list of k:v streamtags to add to every metric
#circonus-default-streamtags: ""
## set a name identifying the cluster, to be used in the check
## title when it is created
kubernetes-name: ""
## kubernetes api server url
#kubernetes-api-url: "https://kubernetes"
## kubernetes api ca file
#kubernetes-api-ca-file: "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"
## kubernetes service account token
#kubernetes-bearer-token-file: "/var/run/secrets/kubernetes.io/serviceaccount/token"
## collect event metrics
kubernetes-enable-events: "false"
## collect metrics from kube-state-metrics if running
kubernetes-enable-kube-state-metrics: "false"
## kube-state-metrics metrics port name, default from https://github.com/kubernetes/kube-state-metrics/blob/master/examples/standard/service.yaml
kubernetes-ksm-metrics-port-name: "http-metrics"
## kube-state-metrics telemetry port name, default from https://github.com/kubernetes/kube-state-metrics/blob/master/examples/standard/service.yaml
kubernetes-ksm-telemetry-port-name: "telemetry"
## collect metrics from api-server
kubernetes-enable-api-server: "true"
## collect node metrics
kubernetes-enable-nodes: "true"
## expression to use for node labelSelector
kubernetes-node-selector: ""
## collect kublet /stats/summary performance metrics (e.g. cpu, memory, fs)
kubernetes-enable-node-stats: "true"
## collect kublet /metrics observation metrics
kubernetes-enable-node-metrics: "true"
## enable kubelet cadvisor metrics
kubernetes-enable-cadvisor-metrics: "false"
## enable kube-dns metrics
kubernetes-enable-kube-dns-metrics: "false"
## include pod metrics, requires nodes to be enabled
kubernetes-include-pod-metrics: "true"
## include only pods with this label key, blank = all pods
kubernetes-pod-label-key: ""
## include only pods with label key and value, blank = all pods with label key
kubernetes-pod-label-val: ""
## include container metrics, requires nodes+pods to be enabled
kubernetes-include-container-metrics: "false"
## collection interval, how often to collect metrics (note if a previous
## collection is still in progress another will NOT be started)
#kubernetes-collection-interval: "1m"
## api request timelimit
#kubernetes-api-timelimit: "10s"
```

### Metric filters

The metric filters control which metrics the broker will keep and forward on to Circonus. Kubernetes offers a large amount of metrics, not all of which are used in the default dashboard. These filters allow through only the metrics used within the default dashobard. If additional metrics are needed for custom visuals, add any additional _allow_ rules. This list is the master list of rules. The rules on the check will be overwritten by this list every time the agent pod is started.

```yaml
## Metric filters control which metrics are passed on by the broker
## NOTE: This list is applied to the check every time the agent pod starts.
##       Updates through any other method will be overwritten by this list.
metric-filters.json: |
{
    "metric_filters": [
        ["allow","^[rt]x$","tags","and(resource:network,or(units:bytes,units:errors),not(container_name:*),not(sys_container:*))","utilization"],
        ["allow","^(used|capacity)$","tags","and(or(units:bytes,units:percent),or(resource:memory,resource:fs,volume_name:*),not(container_name:*),not(sys_container:*))","utilization"],
        ["allow","^usageNanoCores$","tags","and(not(container_name:*),not(sys_container:*))","utilization"],
        ["allow","^apiserver_request_total$","tags","and(or(code:5*,code:4*))","api req errors"],
        ["allow","^authenticated_user_requests$","api auth"],
        ["allow","^authentication_attempts$","api auth"],
        ["allow","^kube_pod_container_status_(running|terminated|waiting|ready)$","containers"],
        ["allow","^kube_deployment_(created|spec_replicas|status_replicas|status_replicas_updated|status_replicas_available|status_replicas_unavailable)$","deployments"],
        ["allow","^kube_pod_start_time","pods"],
        ["allow","^kube_pod_status_phase$","tags","and(or(phase:Running,phase:Pending,phase:Failed,phase:Succeeded))","pods"],
        ["allow","^kube_pod_status_(ready|scheduled)$","tags","and(condition:true)","pods"],
        ["allow","^kube_(service_labels|deployment_labels|pod_container_info|pod_deleted)$","ksm inventory"],
        ["allow","^(node|kubelet_running_pod_count|Ready)$","nodes"],
        ["allow","^NetworkUnavailable$","node status"],
        ["allow","^(Disk|Memory|PID)Pressure$","node status"],
        ["allow","^capacity_.*$","node capacity"],
        ["allow","^kube_namespace_status_phase$","tags","and(or(phase:Active,phase:Terminating))","namespaces"],
        ["allow","^coredns_.*$","kube-dns"],
        ["allow","^events$","events"],
        ["allow","^collect_.*$","agent collection stats"],
        ["deny","^.+$","all other metrics"]
    ]
}
```

## Settings in `deployment.yaml`

> Note, most settings come from configuration.yaml, what settings are commented out in each of the two files must be kept in sync.

### Command line argument(s)

`--k8s-pool-size` determines how many nodes metrics are collected from concurrently. It is a memory/cpu/performance calibration. The default is `runtime.NumCPU()` for smaller clusters setting it to `1` will reduce memory and cpu.

### Resource settings

Every cluster is different - size, number of pods, what metrics are being collected, etc. By default no resources limits are set. To set them, get the pod running smoothly with regards to collection and submission of all metrics for your needs. Monitor the cpu and memory usage of the pod `kubectl top po` and then set the limits and re-deploy.
