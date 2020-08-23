---
home: true
heroImage: /dortania-logo-clear.png
heroText: Dortania's OpenCore Install Guide
actionText: Getting Started→
actionLink: prerequisites.md

meta:
- name: description
  content: Current supported version 0.6.0
---

# What is OpenCore

OpenCore is software that allows non-Mac hardware to run macOS.
It does this by injecting certain software at boot time (such as SMBIOS, ACPI tables and kexts) to provide the facilities that macOS requires.

OpenCore has been designed with security and robustness in mind,
and to preserve security features found on real Macs such as SIP and FileVault.
It uses fewer tricks to install the required software at boot time, and thus is more stable.
A more in-depth comparison between OpenCore and other systems can be found here:
[Why OpenCore over Clover and others](why-oc.md)

# Who this guide is for

This guide specifically focuses on two main things:

* Installing macOS on an X86 based PC
* Providing background about how this works

Because of this, you will be expected to read, learn, and especially Google for answers.
This is not a simple 1-click install setup.

Please remember: although OpenCore is currently in beta, it is quite stable and widely used.
It is arguably much more stable than other Hackintosh methods (such as Clover) in pretty much every way.
That said, OpenCore is still being frequently updated and so chunks of configuration can change
(ie. new quirks replacing old ones)

Lastly, you can always visit both the [r/Hackintosh subreddit](https://www.reddit.com/r/hackintosh/) and [r/Hackintosh discord](https://discord.gg/u8V7N5C) for more help.
