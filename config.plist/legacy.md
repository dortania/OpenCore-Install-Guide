# Config setup for Legacy Hardware

While this guide will not cover the entirety of config setup for hardware not included in this guide, we will however give some pointers as to the specifics of installing with older hardware.

Note that critical thinking and google will be required, as I won't be holding your hand compared to other systems.

* [Penryn(Core2 Series)](../config.plist/legacy/penryn.md)
* [Nehalem (First Gen i-series)](../config.plist/legacy/nehalem.md)
* [Sandy Bridge(Second Gen i-series)](../config.plist/legacy/sandy-bridge.md)
* [Sandy and Ivy Bridge-E(HEDT)](../config.plist/legacy/sandy-bridge-e.md)

## Adding older SMBIOS to OpenCore

OpenCore by default will only include 2012 and newer SMBIOS when using the [`Automatic`](https://github.com/acidanthera/OpenCorePkg/blob/master/AppleModels/DataBase.md) feature, for the majority of users this won't bother but for us we're using legacy hardware.

To add support for older SMBIOS, we'll need to edit and recompile OpenCore:

1. Edit [update_generated.py line L305](https://github.com/acidanthera/OpenCorePkg/blob/master/AppleModels/update_generated.py#L305) from `2012` to `2010`
2. Run [`update_generated.py`](https://github.com/acidanthera/OpenCorePkg/blob/master/AppleModels/update_generated.py)
3. Run [`build_oc.tool`](https://github.com/acidanthera/OpenCorePkg/blob/master/build_oc.tool)
4. Grab the compiled files under the `Binaries` folder
