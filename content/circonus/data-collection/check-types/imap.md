---
title: IMAP
---

## IMAP {#IMAP}
 * **Category:** general
 * **Dataflow:** pull
 * **Default Port:** 143

This check type checks mail retrieval with the Internet Message Access Protocol (IMAP). This will require server authorization (Username and Password) for the target host.

"Advanced Configuration" allows you to specify the folder that should be examined, an optional IMAP SEARCH operation to execute after EXAMINE. You can also specify which Folder to examine.

If SSL is used, you can also specify a list of ciphers to be used in the SSL protocol and the expected certificate name to check for in SSL certificates.
