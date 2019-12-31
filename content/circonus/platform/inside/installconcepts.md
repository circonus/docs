## Installation Concepts {#InstallationConcepts}
The installation of system components (other than the broker) is driven by a system called "Hooper" which is built atop Opscode's Chef product.  Circonus Inside uses chef-solo, so there is no need to have an external chef server and integration with external chef facilities is not supported.  The install and configuration system is self-contained and should be treated as a black box with no user-serviceable parts.

The installation of Hooper delivers Chef and all the necessary Chef cookbooks, LWRPs, and recipes required to install Circonus Inside.  If you don't know what these Chef pieces are, that's okay. It is intended to be operated as an appliance.

The running of Hooper happens in two phases:

 1. Self identification
 1. Self configuration

All of the configuration aspects of Circonus inside are driven from a single, JSON formatted, master configuration file called `site.json`.  If you are familiar with Chef, you will recognize this as a `data_bag`.  It contains a master list of all the machines in your target installation topology, a list of all of the Circonus Inside components and their required or desired configuration parameters, and a mapping of the component roles to your systems.

Hooper processes `site.json` in the context of a particular server, installing and configuring all of the services for which that server is responsible.


### File Locations {#FileLocations}
In general, application code will be deployed to `/opt/circonus`.  Notable exceptions are `/www` for Web hosts and `/wdb` for the Metadata Database.

Every host will have a `/var/log/circonus` directory.  Aside from databases, everything will log here.

If you are using OmniOS, then generated data such as database data, web logs, etc., should be on separate ZFS datasets.  Hooper will take care of creating the necessary datasets.


### No DNS Required {#NoDNSRequired}
Hooper will use the hosts listed in `machinfo` and `additional_hosts` stanzas
to build an `/etc/hosts` file containing all the active hosts and their IPs
(except for the host on which it's currently running, which it maps to
`127.0.0.1`)  This eliminates the potential for breakage due to a
mis-configured DNS in the infrastructure where Circonus Inside is deployed.
Inter-component communication within the Circonus Inside deployment will use
the short hostnames specified in the hosts file.

However, clients accessing the API, Web UI, and Web Stream services will need
to connect to the appropriate hostnames for those services. If you are not
running any kind of DNS resolution in your infrastructure, clients will need
their own local hosts-file entries in order to reach Circonus services.
Connecting to services by IP address is not supported.

### Public Key Infrastructure (PKI) {#PublicKeyInfrastructurePKI}
Circonus Inside relies heavily on PKI to enable secure communication between components.  One of the components that ships with Circonus is a private Certificate Authority (CA) that manages the signing of requests for and distribution of certificates to the various components in the system.  Each system component must trust the others.

While an internal Circonus Inside controlled CA makes sense for system components that must communicate with each other, this may not work for components that must communicate with end-user devices. As such, the various certificate requirements within Circonus Inside fall into two categories:

 * **private** - PKI that is managed by Circonus Inside
 * **public** - PKI that is the responsibility of the operator to provision and control

Public PKI certificates are used for services that are directly accessed by end-user browsers.  We recommend using a globally trusted Certificate Authority such as Verisign or Geotrust.  Some organizations have existing PKI infrastructure that is already trusted by the systems (and browsers) used by employees. While this will work fine, Circonus may have less insight into problems arising from mis-configuration or misuse of these services.
