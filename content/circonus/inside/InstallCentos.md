## Installing on CentOS
Perform each of the following procedures to install Circonus on CentOS 6 or 7:

 1. Install the [machine](/InstallCentos.md#InstalltheMachine).
 1. Configure the Circonus Inside [yum repository](/InstallCentos.md#ConfiguretheCirconusInsideyumRepository).
 1. Install [Hooper](/InstallCentos.md#InstallHooper).

Procedures for each of these steps are described in the subsections below.

Once these procedures are complete, proceed to the [General Installation](/InstallGeneral.md) section and follow the steps there.


### Install the Machine {#InstalltheMachine}
First, perform a Basic Server install of CentOS x86\_64. Refer to instructions for CentOS.

**Warning:**
>The installation of Circonus Inside on CentOS requires many packages from the upstream CentOS distribution, so running a "minimal set" or a custom mirror of CentOS with some packages culled may cause serious issues that will prevent the successful installation or operation of the product.

#### Install ZFS

The ZFS filesystem is **required** for nodes in the `data_storage` role (which
is also limited to EL7), and optional for all other roles.  It is not included
in the RHEL or CentOS distributions, so additional configuration is required.
See the [installation instructions](https://github.com/zfsonlinux/zfs/wiki/RHEL-and-CentOS)
provided by the ZFS On Linux project.

Additionally, the
[IRONdb manual](https://login.circonus.com/resources/docs/irondb/zfs-guide.html) has
an appendix giving a brief tutorial on ZFS setup. Note, however, that the final
step of the appendix, which refers to IRONdb setup, is not required for
Circonus Inside. Do not install any IRONdb packages.

### Configure the Circonus Inside yum Repository {#ConfiguretheCirconusInsideyumRepository}
Place the following contents in `/etc/yum.repos.d/Circonus.repo` to configure the Circonus Inside yum repository:

#### EL7 Repo
```
[circonus]
name=circonus
enabled=1
baseurl=http://updates.circonus.net/centos/7/x86_64/
gpgcheck=0
metadata_expire=30m
```

> Note: starting with the 2019-07-29 release, it is possible to pin your repo
> configuration to a specific release. This allows you to install or update to
> a release that is not the latest.

To specify a release, modify the `baseurl` value above to be:

```
http://updates.circonus.net/centos/7/release-YYYYMMDD/x86_64/
```

where `YYYYMMDD` matches the date of the desired release, e.g. `20190729`.

Ensure that you make this change _prior_ to first-time installation or
performing an update, and that you specify a release _later_ than what you are
currently running. See the [Changelog
page](https://login.circonus.com/resources/docs/operation/Changelog.html) of
the Operations Manual for how to determine what release you are running.

**Downgrades are not supported.**

#### EL6 Repo
```
[circonus]
name=circonus
enabled=1
baseurl=http://updates.circonus.net/centos/6/x86_64/
gpgcheck=0
metadata_expire=30m
```

### Install Hooper {#InstallHooper}
Run the following command to install Hooper:
```
yum -y install circonus-field-hooper
```

Once this is complete, proceed to the [General Installation](/InstallGeneral.md) section and follow the steps there.
