# Legacy macOS: Online method

This method allows us to download legacy versions of macOS including 10.7 to current, however these are only recovery installers so require an internet connection inside the installer itself

To start, you'll want to use macrecovery.py instead. This tool is actually already bundled in OpenCorePkg:

![](../images/installer-guide/legacy-mac-install-md/macrecovery.png)

Instructions for running are quite simple, choose from one of the below commands depending on which OS you want to download:

```sh
# Lion(10.7):
python ./macrecovery.py -b Mac-2E6FAB96566FE58C -m 00000000000F25Y00 download
python ./macrecovery.py -b Mac-C3EC7CD22292981F -m 00000000000F0HM00 download

# Mountain Lion(10.8):
python ./macrecovery.py -b Mac-7DF2A3B5E5D671ED -m 00000000000F65100 download

# Mavericks(10.9):
python ./macrecovery.py -b Mac-F60DEB81FF30ACF6 -m 00000000000FNN100 download

# Yosemite(10.10):
python ./macrecovery.py -b Mac-E43C1C25D4880AD6 -m 00000000000GDVW00 download

# El Capitan(10.11):
python ./macrecovery.py -b Mac-FFE5EF870D7BA81A -m 00000000000GQRX00 download

# Sierra(10.12):
python ./macrecovery.py -b Mac-77F17D7DA9285301 -m 00000000000J0DX00 download

# High Sierra(10.13)
python ./macrecovery.py -b Mac-7BA5B2D9E42DDD94 -m 00000000000J80300 download
python ./macrecovery.py -b Mac-BE088AF8C5EB4FA2 -m 00000000000J80300 download

# Mojave(10.14)
python ./macrecovery.py -b Mac-7BA5B2DFE22DDD8C -m 00000000000KXPG00 download

# Catalina(10.15)
python ./macrecovery.py -b Mac-00BE6ED71E35EB86 -m 00000000000000000 download

# Latest version
# ie. Big Sur(11)
python ./macrecovery.py -b Mac-E43C1C25D4880AD6 -m 00000000000000000 download
```

From here, run one of those commands in terminal and once finished you'll get an output similar to this:

![](../images/installer-guide/legacy-mac-install-md/download-done.png)

Once this is done, format your USB as FAT32 with GUID Partition Scheme:

![](../images/installer-guide/legacy-mac-install-md/fat32-erase.png)

And finally, create folder on the root of this drive called `com.apple.recovery.boot` and place the newly downloaded BaseSystem/RecoveryImage files in:

![](../images/installer-guide/legacy-mac-install-md/dmg-chunklist.png)

### Once you're finished, you can head to [Setting up OpenCore's EFI environment](./mac-install.md#setting-up-opencore-s-efi-environment)
