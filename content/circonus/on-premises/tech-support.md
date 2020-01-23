---
title: Technical Support
weight: 140
---

# Technical Support {#TechnicalSupport}
Please refer to your [Circonus Software End User Agreement](https://login.circonus.com/terms) for specific support details.

Contact support@circonus.com with technical support questions.

If Circonus Support asks you to transfer files to them while they assist with troubleshooting issues, instructions for sending files can be found under the "
[Sending Files to Circonus Support](/SendingFilestoCirconusSupport.md)" section.

## Sending Files to Circonus Support {#SendingFilestoCirconusSupport}
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
