---
title: Reassigning IP Addresses
weight: 120
---

# Reassigning IP Addresses

**Warning:**
> Changing existing IP addresses for operational CI systems is not a typical exercise and has not been tested by Circonus, so if you run into any issues during this work, please notify Support (support@circonus.com).

In the event that you need to reassign the IP for your Circonus install, update the site.json, [rerun hooper](/circonus/on-premises/installation/installation#installation-sequence) (the Circonus Inside management tool) for each zone, and then restart each service. Because change IPs is not commonly done, after running hooper and rebooting each zone it is prudent to verify that all the nodes are working. These procedures are outlined step-by-step below:

 1. Stop the broker zone.
 1. Shutdown that host.
 1. Shutdown all other hosts (to power off).
 1. Set up the network.
 1. Start the host with the broker zone.
 1. Repair the IP address settings in both zones.
 1. Edit the the active topology files for the data\_storage node to update each IP Address. Copy these changes to all other nodes.
 1. Start each other host and repair the IP address settings.
 1. The Chef data bag (`site.json`) requires one attribute update. The "`web-db`" service role has an attribute called "`allowed_subnets`".  Change the value of this attribute to match the new network address and CIDR mask.
  * If you are changing the subnet masks on the interfaces for the Circonus nodes, no further changes to the `site.json` should be necessary. If you are changing the actual IP addresses as well as the netmasks, then there are additional changes needed in `site.json`:
   * "ip_address" - Should be set on all entries in `machinfo` and `additional_hosts`.
   * "domain" - Should be set to the new address of the web-frontend node
   * "stream_service_name" on `web-stream` - Should be set to the same IP as the `web-frontend` node
 1. Once the `allowed_subnets` attribute has been updated and the `site.json` has been distributed to all the non-broker nodes, run Hooper on each node, in a specific order, based on the service role:
  1. `web-db` - This is the only service role affected by the size of the subnet, but the best practice is to update all nodes if when any one node needs to be updated.
  1. `ca`
  1. `mq`
  1. `web-frontend`
  1. Any remaining nodes in no particular order.

**Note:**
>If your installation has multiple roles on each non-broker node, review the `site.json` and make note of which node has each role to find the correct ordering.

Run Hooper on each node using the following command, where "`<nodename>`" is the short name as defined in `site.json` in the "`machinfo`" section:
```
/opt/circonus/bin/run-hooper <nodename>
```

## Reassigned IP Address Troubleshooting

Potential issues may arise when reassigning IP Addresses.

The system needs to know the broker's new IP address in order to connect to it. Use the following procedures:
 1. Once the `web-frontend` system is back online, navigate to https://10.124.147.154/admin/broker
 1. Log in using a super-admin account.
 1. Use the Search button to pull a list of all brokers.
 1. From this screen, you can change the IP for the broker(s) in question.

Refer to the "Brokers" sections in this manual for more information on [administering](/circonus/administration/enterprise-brokers/) [brokers](/circonus/on-premises/roles-services/broker).

Finally, if historical graphs do not appear after reassigning IP addresses, this could be the result of an issue with Snowth. The Snowth topology is initially set by Hooper but then never touched once it exists, to protect the cluster.

The topology file is an input to a setup process that produces a file in `/opt/circonus/etc/snowth-topo/`, which is named for the SHA256 digest of the topology file.  It is this file that `snowthd` actually uses.

The topology digest is constructed only from the uuid and weight attributes of each node, so changing only the IPs won't result in a new digest.  For completeness, you should change both `/opt/circonus/etc/topology` and `/opt/circonus/etc/snowth-topo/<digest>` on each node.  Do this while the service is stopped. If necessary, you can do a rolling update, but it safest to perform the procedure while the whole cluster shut down.

**Warning:**
>It is **very** important that you set each new IP on the correct node - the node uuid in the topology file corresponds to the `"node_id"` attribute in the `machinfo` section of the `site.json` file.
