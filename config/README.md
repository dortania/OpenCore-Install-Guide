# Setting up the Config.plist

The OpenCore Config.plist can be a bit daunting at first!
This page will walk you through the configuration process though, and help boil it down to the settings that matter for your system.

If you have any questions about what an option does, you can refer to [OpenCore's Configuration PDF](https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf) provided with your download of OpenCore.

This section of the guide will not mention every single configuration option. **If an option is not mentioned, leave it at it's default value**.

::: Error

**DO NOT USE CONFIGURATORS**
Configurators are applications which provide a GUI to configure OpenCore.
These tend to become out of date with OpenCore and there have been cases where the configuration file has been corrupted by them.

:::

## Adding your SSDTs, Kexts and Firmware Drivers

For the rest of this guide, you're gonna need some form of plist editing. And for our guide, we'll be using ProperTree and GenSMBIOS to help automate some of the tedious work:

* [ProperTree](https://github.com/corpnewt/ProperTree)
  * Universal plist editor
* [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS)
  * For generating our SMBIOS data

Next, let's open ProperTree and edit our config.plist:

* `ProperTree.command`
  * For macOS
  * Pro tip: there's a `buildapp.command` utility in the `Scripts` folder that lets you turn ProperTree into a dedicated app in macOS
* `ProperTree.bat`
  * For Windows

Once ProperTree is running, open your config.plist by pressing **Cmd/Ctrl + O** and selecting the `config.plist` file on your USB.

After the config is opened, press **Cmd/Ctrl + Shift + R** and point it at your EFI/OC folder to perform a "Clean Snapshot":

* This will remove all the entries from the config.plist and then adds all your SSDTs, Kexts and Firmware drivers to the config
* **Cmd/Ctrl + R** is another option that will add all your files as well but will leave entries disabled if they were set like that before, useful for when you're troubleshooting but for us not needed right now

![](/images/config/config-universal/before-snapshot.png)

Once done, you'll see your SSDTs, Kexts and firmware drivers populated in the config.plist:

![](/images/config/config-universal/after-snapshot.png)

* **Note:** If you get a pop up "Disable the following kexts with Duplicate CFBundleIdentifiers?", press "Yes". This is to ensure you don't have duplicate kexts being injected, as some kexts may have some of the same plugins(ie. VoodooInput is in both VoodooPS2 and VoodooI2C's plugin folder)

![](/images/config/config-universal/duplicate.png)

If you wish to clean up the file a bit, you can remove the `#WARNING` entries. Though they cause no issues staying there, so up to personal preference.

::: danger
The config.plist **must** match the contents of the EFI folder. If you delete a file but leave it listed in the Config.plist, OpenCore will error and stop booting.

If you make any modifications, you can use the OC snapshot tool (**Cmd/Ctrl + R**) in ProperTree to update the config.plist.
:::
