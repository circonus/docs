---
title: CIM
---

# CIM {#CIM}

 * **Category:** general
 * **Dataflow:** pull
 * **Default Port:** 5988

This check type checks your Common Interface Model (CIM) system. This will require server authorization (Username and Password) for the target host.

"Advanced Configuration" allows you to specify fields to pull data from the CIM server classes (for example: "HealthState", or "Operational Status"). These fields are optional; if no fields are specified, all available fields will be returned.

You can also have the option to upgrade the TCP connection to use SSL.
