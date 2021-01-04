---
home: true
heroImage: /dortania-logo-clear.png
heroText: Dortania's OpenCore Install Guide
actionText: Getting Started→
actionLink: prerequisites.md

meta:
- name: description
  content: Current supported version 0.6.5
---

# What is OpenCore and who is this guide for

OpenCore is what we refer to as a "boot loader" – it is a complex piece of software that we use to prepare our systems for macOS – specifically by injecting new data for macOS such as SMBIOS, ACPI tables and kexts. How this tool differs from others like Clover is that it has been designed with security and quality in mind, allowing us to use many security features found on real Macs, such as SIP and FileVault. A more in-depth look can be found here: [Why OpenCore over Clover and others](why-oc.md)

This guide specifically focuses on two main things:

* Installing macOS on an X86-based PC
* Teaching you what makes your Hack work

Because of this, you will be expected to read, learn and even use Google. This is not a simple one-click install setup.

Please remember that OpenCore is still new and currently in beta. While quite stable, and arguably much more stable than Clover in pretty much every way, it is still being frequently updated, so chunks of configuration change quite often (i.e. new quirks replacing old ones).

Lastly, those having issues can visit both the [r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/) and [r/Hackintosh Discord](https://discord.gg/u8V7N5C) for more help.
