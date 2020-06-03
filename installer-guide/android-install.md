# Making the installer with an Android Phone

* Supported version: 0.5.9

(This is a joke, you can follow this but you really should just buy a $3 USB)

**Requirements:**

* Rooted Android phone with [DriveDroid](https://softwarebakery.com/projects/drivedroid)
* macOS Recovery files

1. Partition your Drive into 2 parts:

* 200MB partition named EFI
* 4GB partition for macOS install

2. Create a folder on the 4GB partition called `com.apple.recovery.boot` and add the following inside it:

* recovery file(.dmg)
* chunklist file(.chunklist)

3. [Create your OpenCore EFI](/installer-guide/opencore-efi.md)

4. Boot
