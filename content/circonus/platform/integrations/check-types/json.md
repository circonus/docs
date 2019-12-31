---
title:
draft: true
---

## JSON {#JSON}
 * **Category:** custom
 * **Dataflow:** pull or push (see [HTTPTrap](/Data/CheckTypes.md#HTTPTrap))
 * **Default Port:** 80 for pull, 43191 for push

This check type monitors statistics formatted in JSON, using either push or pull methodology.

The JSON Pull check type gathers metric formatted in JSON using the Resmon check. The Support Portal includes a [video demo](https://support.circonus.com/solution/articles/6000046146-video-adding-a-json-pull-check) for adding a JSON Pull check.

The JSON Push(HTTPTrap) check type pushes JSON data to Circonus via an HTTP PUT Request. See the [HTTPTrap](/Data/CheckTypes/HTTPTrap.md) check type described above.
