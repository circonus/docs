## DHCP {#DHCP}
 * **Category:** general
 * **Dataflow:** pull
 * **Default Port:** 67

This check type monitors your DHCP system. This check will only operate on Enterprise Brokers.

You will need to provide the hardware address of the DHCP client, in "`00:00:00:00:00:00`" format.

"Advanced Configuration" gives you the option to specify the port to which DHCP requests are sent, the IP address of the agent running the DHCP check, and to select a request type, such as DHCPDiscover or DHCPInform.
