---
home: true
heroImage: /dortania-logo-clear.png
heroText: Dortania's OpenCore Install Guide
actionText: Getting Started→
actionLink: prerequisites.md

meta:
- name: description
  content: Current supported version 0.5.9
---

# What is OpenCore and who is this guide for

OpenCore is what we refer to as a "boot loader", this is a complex piece of software that we use to prepare our systems for macOS. Specifically by injecting new data for macOS such as SMBIOS, ACPI tables and kexts. How this tool differs from others like Clover is that this has been designed with security and quality in mind, allowing us to use many security features found on real macs such as SIP and FileVault. A more in-depth look can be found at here: [Why OpenCore over Clover and others](why-oc.md)

This guide specifically focuses on 2 main things:

* Installing macOS on an X86 based PC
* Teach you what makes your hack work

Because of this, you will be expected to read, learn and even google. This is not a simple 1-click install setup.

Please remember that OpenCore is still new and currently in beta. While quite stable, and arguably much more stable than Clover in pretty much every way, it is still being frequently updated and so chunks of configuration change quite often(ie. New quirks replacing old ones)

Lastly, those having issues can visit both the [r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/) and [r/Hackintosh discord](https://discord.gg/u8V7N5C) for more help.
