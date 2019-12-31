# Role Distribution

The optimal layout of service roles will vary for a given number of machines.
More machines will improve performance and resilience. The ideal layout is one
role per machine or VM instance, though limitations of hardware and/or
management resources may require overlap. Contact Circonus Support for
assistance in determining the best layout for your needs.

## Conflicts
Hooper enforces a rule preventing a host from assuming multiple roles in some
cases that would create conflicts.

The following are conflicts among service roles that will cause Hooper to show
errors:
 * API and Web Frontend: both listen on port 8080.
 * Fault Detection, CAQL Broker, and Stratcon roles: all listen on port 43191.

## Typical Setups

These setup examples represent the distribution of roles, exclusive of
[Enterprise
Brokers](https://login.circonus.com/resources/docs/user/Administration/Brokers.html)
and IRONdb (`data_storage`), which has its own [clustering
requirements](https://login.circonus.com/resources/docs/irondb/cluster-sizing.html).

### Small

Hosts: 3

This layout represents the minimum number of hosts for a functional
installation. It has no redundancy, and so is most appropriate for evaluation,
development, or other similarly time- or resource-limited deployments.

| Host | Roles |
|:-:|---|
| 1 | ca, fault\_detection, mq, web\_db, web\_frontend |
| 2 | api, caql\_broker, notification |
| 3 | stratcon, hub, web\_stream |

### Medium

Hosts: 7

A medium-sized install has modest scale, some redundancy, and is appropriate
for small to mid-size enterprises, or a single group within a large enterprise.
Depending on hardware capability, this layout can handle up to 1MM active
metrics per minute.

| Host | Roles |
|:-:|---|
| 1 | ca, mq, web\_db (primary) |
| 2 | caql\_broker, web\_frontend (1), web\_stream (1) |
| 3 | hub, stratcon |
| 4 | api (1), fault\_detection |
| 5 | web\_db (replica) |
| 6 | api(2), notification |
| 7 | web\_frontend (2), web\_stream (2) |

### Large

Hosts: 20

Large installs separate all roles to dedicated hosts, have maximum redundancy
and can scale to meet the needs of large enterprises. Redundant roles are
typically split across failure domains such as availability zones, equipment
racks/cages, or datacenters. Additionally, the IRONdb cluster is configured
across the same failure domain using a [sided
configuration](https://login.circonus.com/resources/docs/irondb/installation.html#split-clusters).

| Host | Roles |
|:-:|---|
|  1 | web\_db (primary) |
|  2 | ca (primary) |
|  3 | mq (1) |
|  4 | web\_frontend (1) |
|  5 | api (1) |
|  6 | stratcon (1) |
|  7 | notification (primary) |
|  8 | fault\_detection (primary) |
|  9 | web\_stream (1) |
| 10 | caql\_broker |
| 11 | hub |
| 12 | web\_db (replica) |
| 13 | ca (cold standby) |
| 14 | mq (2) |
| 15 | web\_frontend (2) |
| 16 | api (2) |
| 17 | stratcon (2) |
| 18 | notification (cold standby) |
| 19 | fault\_detection (warm standby) |
| 20 | web\_stream (2) |

