# Fixing iMessage and other services with OpenCore

* Supported version: 0.5.9

Table of Contents:

* [Generate a new Serial](/post-install/iservices.md#generate-a-new-serial)
* [Fixing En0](/post-install/iservices.md#fixing-en0)
* [Fixing ROM](/post-install/iservices.md#fixing-rom)
* [Verifying NVRAM](/post-install/iservices.md#verifying-nvram)
* [Clean out old attempts](/post-install/iservices.md#clean-out-old-attempts)
* [Cleaning up your AppleID](/post-install/iservices.md#cleaning-your-appleid)
* [Customer Code error](/post-install/iservices.md#customer-code-error)

This page is for those having iMessage and other iServices issues, this is a very basic guide so will not go as in-depth into the issues as some other guides. This specific guide is a translation and reinterpretation of the AppleLife Guide on fixing iServices: [Как завести сервисы Apple - iMessage, FaceTime, iCloud](https://applelife.ru/posts/727913)

**Note**: You and you alone are responsible for your AppleID, read the guide carefully and take full responsibility if you screw up. Dortania and other guides are not held accountable for what **you** do.

## Generate a new Serial

Download [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS) and select option 1 to download MacSerial and next option 3 to generate some new serials. What we're looking for is a valid serial that currently has no registered purchase date.

Tip: `iMacPro1,1 10` will print 10 serials, this will save you some time on generating

![](/images/post-install/iservices-md/serial-list.png)

Now enter the serial into the [Apple Check Coverage page](https://checkcoverage.apple.com/), you will get 1 of 3 responses:

We’re sorry, but this serial number isn’t valid |  Valid Purchase date | Purchase Date not Validated
:-------------------------:|:-------------------------:|:-------------------------:
![](/images/post-install/iservices-md/not-valid.png) | ![](/images/post-install/iservices-md/valid.png) |  ![](/images/post-install/iservices-md/no-purchase.png)

This last one is what we're after, as we want something genuine but currently not in use by anyone. Now we can translate the rest of the values into our config.plist -> PlatformInfo -> Generic:

* Type = SystemProductName
* Serial = SystemSerialNumber
* Board Serial = MLB
* SmUUID = SystemUUID

**Note**:  "We’re sorry, but this serial number isn’t valid. Please check your information and try again." works for many users as well, do note though if you've had a bad track record with Apple/iServices you many need one that's "Purchase Date not Validated". Otherwise there may be suspicion

**Note 2**: Using a "Purchase Date not Validated:" can cause issues down the line if another machine of the same serial ever gets activated, for initial setup it can help alleviate issues with your account but in the long run an invalid serial can be a safer choice.

**Note3**: Checking too many serials may result in your access being denied to Apple Check Coverage page, to bypass this limitation it's advised to use a VPN or [tor browser](https://www.torproject.org/download/) or any other service that allows you to change/mask your IP address.

## Fixing En0

To start, grab [Hackintool](https://www.tonymacx86.com/threads/release-hackintool-v3-x-x.254559/) ([Github link](https://github.com/headkaze/Hackintool)) and head to System -> Peripherals (Info -> Misc on older versions of Hackintool)

Here under Network Interfaces (network card icon), look for `en0` under `BSD` and check whether the device has a check mark under Builtin. If there is a check mark, skip to Fixing ROM section otherwise continue reading.

> What if I don't have En0 at all?!?

Well, we'll want to reset macOS so it can build the interfaces fresh, open terminal and run the following:

```text
sudo rm /Library/Preferences/SystemConfiguration/NetworkInterfaces.plist
sudo rm /Library/Preferences/SystemConfiguration/preferences.plist
```

Once done reboot and check again.

If this doesn't work, add [NullEthernet.kext](https://bitbucket.org/RehabMan/os-x-null-ethernet/downloads/) and [ssdt-rmne.aml](https://github.com/RehabMan/OS-X-Null-Ethernet/blob/master/ssdt-rmne.aml) to your EFI and config.plist under Kernel -> Add and ACPI -> Add respectively. The SSDT is precompiled so no extra work needed, reminder compiled files have a .aml extension and .dsl can be seen as source code.

![Find if set as Built-in](/images/post-install/iservices-md/en0-built-in-info.png)

Now head under the PCI tab of Hackintool and export your PCI DeviceProperties, this will create a pcidevices.plist on your desktop

![Export PCI address](/images/post-install/iservices-md/hackintool-export.png)

Now search through the pcidevices.plist and find the PciRoot of your ethernet controller. For us, this would be `PciRoot(0x0)/Pci(0x1f,0x6)`

![Copy PciRoot](/images/post-install/iservices-md/find-en0.png)

Now with the PciRoot, go into your config.plist -> DeviceProperties -> Add and apply the property of `built-in` with type `Data` and value `01`

![Add to config.plist](/images/post-install/iservices-md/config-built-in.png)

## Fixing ROM

This is a section many may have forgotten about but this is found in your config.plist under PlatformInfo -> generic -> ROM

To find your actual MAC Address/ROM value, you can find in a couple places:

* BIOS
* macOS: System Preferences -> Network -> Ethernet -> Advanced -> MAC Address
* Windows: Settings -> Network & Internet -> Ethernet -> Ethernet -> Physical MAC Address

Some users have even gone as far as using real Apple MAC Address dumps for their config, for this guide we'll be using our real MAC Address but note that this is another option.

When adding this to your config, `c0:7e:bf:c3:af:ff` should be converted to `c07ebfc3afff` as the `Data` type cannot accept colons(`:`).

![](/images/post-install/iservices-md/config-rom.png)

## Verifying NVRAM

Something that many forget about iServices is that NVRAM is crucial to getting it working correctly, the reason being is that iMessage keys and such are stored in NVRAM. Without NVRAM, iMessage can neither see nor store keys.

So we'll need to verify NVRAM works, regardless if "it should work" as some firmwares can be more of a pain than others.

Please refer to the [Emulated NVRAM](/post-install/nvram.md) section of the OpenCore Guide for both testing if you have working NVRAM and emulating it if you don't.

## Clean out old attempts

This is important for those who've tried setting up iMessage but failed, to start make sure your NVRAM has been cleared. You can enable the option in the boot picker in your config under config.plist -> Misc -> Security -> AllowNvramReset.

Next open terminal and run the following:

```text
sudo rm -rf ~/Library/Caches/com.apple.iCloudHelper*
sudo rm -rf ~/Library/Caches/com.apple.Messages*
sudo rm -rf ~/Library/Caches/com.apple.imfoundation.IMRemoteURLConnectionAgent*
sudo rm -rf ~/Library/Preferences/com.apple.iChat*
sudo rm -rf ~/Library/Preferences/com.apple.icloud*
sudo rm -rf ~/Library/Preferences/com.apple.imagent*
sudo rm -rf ~/Library/Preferences/com.apple.imessage*
sudo rm -rf ~/Library/Preferences/com.apple.imservice*
sudo rm -rf ~/Library/Preferences/com.apple.ids.service*
sudo rm -rf ~/Library/Preferences/com.apple.madrid.plist*
sudo rm -rf ~/Library/Preferences/com.apple.imessage.bag.plist*
sudo rm -rf ~/Library/Preferences/com.apple.identityserviced*
sudo rm -rf ~/Library/Preferences/com.apple.ids.service*
sudo rm -rf ~/Library/Preferences/com.apple.security*
sudo rm -rf ~/Library/Messages
```

## Verifying your work one last time

Grab [macserial](https://github.com/acidanthera/MacInfoPkg/releases) and run the following:

```text
path/to/macserial -s
```

This will provide us with a full rundown of our system, verify that what is presented matches up with your work.

## Cleaning up your AppleID

* Remove all devices from your AppleID: [Manage your devices](https://appleid.apple.com/account/manage)
* Enable 2 Factor-Auth
* Remove all iServices from Keychain, some examples:

```text
ids: identity-rsa-key-pair-signature-v1
ids: identity-rsa-private-key
ids: identity-rsa-public-key
ids: message-protection-key
ids: message-protection-public-data-registered
ids: personal-public-key-cache
iMessage Encryption Key
iMessage Signing Key
com.apple.facetime: registrationV1
etc ...
```

And a final layer of precaution is to make a new AppleID to play with, this makes sure that if you do end up blacklisting your account that it's not your main.

**Tip**:  Adding a payment card to the account and having a decent amount of purchases can also help. While not concrete, you can think of an AppleID as a credit score where the better an Apple customer you are the more likely they won't have activation issues or get an easier pass with AppleSupport

## Customer Code error

Welp mate, you've done it. You blackmailed your AppleID. The fix is simple but not pretty, **you MUST call Apple**. Otherwise, there is no proceeding besides using a new account. Adding a payment card before calling can help legitimize the account so it doesn't seem as much like a bot.

![](/images/post-install/iservices-md/blacklist.png)
