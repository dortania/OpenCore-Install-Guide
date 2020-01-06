# Converting a clover fakeID to OpenCore

With OpenCore, GPU FakeIDs are handled a bit differently. Specifcally that you need to have the PCIRoot path to apply the properties. Luckily FakeIDs are not required to boot, instead only needed for proper GPU acceleration so this can be done in post-install.


## Finding the PCIRoot of your GPU

To find the PCIRoot, you'll want to grab gfxutil and run the following in terminal:

```
path/to/gfxutil -f GFX0
```
This should give you something like this:
```
PciRoot(0x20)/Pci(0x0,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)/Pci(0x0,0x0)
```
Note: GFX0 can be replaced with GFX1, etc if the GPU you're fakeIDing isn't the first/main GPU. And machine running with CSM enabled and Windows8.1/10 mode(WHQL) disabled may find that the GPU is named `display` so adjust the above command accodingly.

## Apply the fakeID

So lets grab a clover fakeID and go through how we'd convert it, for use we'll choose `0x67981002` which is the ID associated with the R9 280x and is commonly used by R9 280/380 users.

Looking through clover's source code we find that fakeIDs are converted into the following properties:


AMD GPUs:
```
device-id
ATY,DeviceID
@0,compatible
vendor-id
ATY,VendorID
```
To convert them, we'll need to do byte swap. This is due to Endianness:

* DeviceID: 67 98 -> 98 67
* VendorID: 1002 -> 02 10

Now we can apply the properties:

|Key|Type|Value|
|:-|:-|:-|
|device-id|Data|98670000|
|ATY,DeviceID|Data|9867|
|vendor-id|Data|02100000|
|ATY,VendorID|Data|0210|

You may notice we excluded `@0,compatible`, the reasoning for this is thatit actually interferes with WhateverGreen and macOS's ability to properly setup the GPU. See [here](https://github.com/acidanthera/WhateverGreen/blob/master/Manual/FAQ.Radeon.en.md) for more info.

Now navigate into your config.plist under DeviceProperties -> Add where you can apply these properties:

![](https://i.imgur.com/e7UYS75.png)
