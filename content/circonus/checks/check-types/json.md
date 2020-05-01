---
title: JSON
---

# JSON

 * **Category:** custom
 * **Dataflow:** pull or push (see [HTTPTrap](/circonus/checks/check-types/httptrap))
 * **Default Port:** 80 for pull, 43191 for push

This check type monitors statistics formatted in JSON, using either push or pull methodology.

The JSON Pull check type gathers metric formatted in JSON using the Resmon check.

The JSON Push(HTTPTrap) check type pushes JSON data to Circonus via an HTTP PUT Request. See the [HTTPTrap](/circonus/checks/check-types/httptrap) check type described above.
