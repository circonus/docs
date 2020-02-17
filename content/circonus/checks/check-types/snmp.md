---
title: SNMP
---

# SNMP

 * **Category:** general
 * **Dataflow:** pull
 * **Default Port:** 161

This check type performs an Object Identifier (OID) check with the Simple Network Management Protocol (SNMP). The OID consists of the object identifier for an object in a Management Information Base (MIB).

SNMP is a standard that has been around for years and allows monitoring of many types of network equipment, servers, and appliances. There is a good chance you already have SNMP configured on most of your hosts, which would significantly lower the up-front setup time. You’ll need to know the OIDs you want to monitor, but check bundle templates can make this process a little easier.

The SNMP check requires the user to enter the specific OIDs required for collection. Below is a sample for a switch port in which we collect various counters and the text name for the port. As you need to enter more OIDs, click the "Add New OID" link to give yourself more inputs on the form. Make sure your OIDs begin with a "." to properly root them to the beginning of the tree. The Name field should be devoid of spaces and will be the metric name used throughout Circonus.

![Image: 'check_snmp_oids3.png'](/images/circonus/check_snmp_oids3.png)

## SNMPv3

The SNMPv3 protocol builds on the existing SNMPv1 and SNMPv2c protocol implementation. In SNMPv3, User-based Security Model (USM) authentication is implemented along with encryption, allowing you to configure a secure SNMP environment.

The SNMPv3 protocol uses different terminology than the SNMPv1 and SNMPv2c. In the SNMPv1 and SNMPv2c protocols, the terms "agent" and "manager" are used. An agent is the software within an SNMP user while a manager is an SNMP host. In the SNMPv3 protocol, agents and managers are both called "entities." In any SNMPv3 communication, there is an authoritative entity and a non-authoritative entity. The authoritative entity checks the authenticity of the non-authoritative entity. In turn, the non-authoritative entity checks the authenticity of the authoritative entity.

## SNMP Advanced Configuration {#SNMPAdvancedConfiguration}

Note that some of the fields that appear as Advanced Configuration options are only valid if you are running SNMPv3 and set the Version to 3. These are described below:
 * Security Engine - The security engine to use. This should be entered as a hex string without the leading 0x (for example, "`800000020109840301`"). If this is not provided, the SNMP engine will query the target for the engine to use and use that.
 * Context Engine - The context engine to use. This should be entered as a hex string without the leading 0x. If this is not provided, the SNMP engine will query the target for the engine to use and use that.
 * Security Level - The level of security to use. The choices are to use:
  * both authentication and privacy
  * authentication but no privacy
  * no authentication and no privacy.
 * Auth Protocol - The authentication protocol to use. The choices are:
  * MD5
  * SHA.
 * Privacy Protocol - The privacy protocol to use. The choices are:
  * DES
  * AES128
  * AES192
  * AES256
