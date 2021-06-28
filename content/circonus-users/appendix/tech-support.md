---
title: Technical Support
weight: 10
---

# Technical Support

Please refer to your [Circonus Software End User Agreement](https://login.circonus.com/terms) for specific support details.

File a ticket with the [Support Help Desk](https://support.circonus.com/helpdesk) to
contact the Circonus Support Team with technical support questions. You can also reach us at support@circonus.com.

## Sending Files to Circonus Support

If you need to transfer files to Circonus Support while troubleshooting issues, you may do so by following these general steps.  Uploaded files are transferred via HTTPS and are visible only to Circonus personnel.

 1. Use the following command:
  * `curl -T </path/to/local/file> https://upload.circonus.com/cores/`
 1. Notify Circonus Support of the file name(s) sent.

For each file transferred, you will see a response like the following:
```
Thank you.
<num_bytes> bytes received.
MD5:  <md5_hash>
SHA1: <sha1_hash>
```
