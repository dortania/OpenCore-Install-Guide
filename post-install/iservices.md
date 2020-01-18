# Fixing iMessage and other services with OpenCore

This page is for those having iMessage and other iServices issues, this is a very basic guide so will not go as in-depth into the issues as some other guides. This specific guide is a translation and reinterpretation of the AppleLife Guide on fixing iService: [Как завести сервисы Apple - iMessage, FaceTime, iCloud](https://applelife.ru/posts/727913)

## Generate a new Serial

Download [GenSMBIOS](https://github.com/corpnewt/GenSMBIOS) and select option 1 to download MacSerial and next option 3 to generate some new serials. What we're looking for is a valid serial that currently has no registered purchase date.

Tip: `iMacPro1,1 10` will print 10 serials, this will save you some time on generating

![](https://i.imgur.com/cVL7ETT.png)

Now enter the serial into the [Apple Check Coverage page](https://checkcoverage.apple.com/), you will get 1 of 3 responses:

"We’re sorry, but this serial number isn’t valid. Please check your information and try again.":
![](https://i.imgur.com/dvYcpHB.png)


Valid Purchase date:
![](https://i.imgur.com/rh0r28T.png)

Purchase Date not Validated:
![](https://i.imgur.com/oSLMqWa.png)

This last one is what we're after, as we want something genuine but currently not in use by anyone. Now we can translate the rest of the values into our config.plist -> PlatformInfo -> Add:

* Type = SystemProductName
* Serial = SystemSerialNumber
* Board Serial = MLB
* SmUUID = SystemUUID

## Fixing En0

To start, grab Hackintool and head to Info -> Misc

Here under Network Interfaces, look for `En0` under BSD Names and check whether the device has a checkmark under Builtin. If there is a checkmark, skip to Fixing ROM section otherwise continue reading.

> What if I don't have En0 at all?!?

Well, we'll want to reset macOS so it can build the interfaces fresh, open terminal and run the following:
```text
sudo rm /Library/Preferences/SystemConfiguration/NetworkInterfaces.plist
sudo rm /Library/Preferences/SystemConfiguration/preferences.plist
```
Once done reboot and check again.

If this doesn't work, add [NullEthernet.kext](https://bitbucket.org/RehabMan/os-x-null-ethernet/downloads/) and [ssdt-rmne.aml](https://github.com/RehabMan/OS-X-Null-Ethernet/blob/master/ssdt-rmne.aml) to your EFI and config.plist under Kernel -> Add and ACPI -> Add respectively. The SSDT is precompiled so no extra work needed, reminder compiled files have a .aml extension and .dsl can be seen as source code.

![Find if set as Built-in](https://i.imgur.com/SPJCQKw.png)

Now head under the PCI tab of Hackintool and export your PCI DeviceProperties, this will create a pcidevices.plist on your desktop

![Export PCI address](https://i.imgur.com/VAjPfol.png)

Now search through the pcidevices.plist and find the PCIRoot of your ethernet controller. For us, this would be `PciRoot(0x0)/Pci(0x1f,0x6)`

![Copy PCIRoot](https://i.imgur.com/1aTlAC6.png)

Now with the PCIRoot, go into your config.plist -> DeviceProperties -> Add and apply the property of `built-in` with type `Data` and value `01`

![Add to config.plist](https://i.imgur.com/vGwow2X.png)

## Fixing ROM

This is a section many may have forgotten about but this is found in your config.plist under PlatformInfo -> generic -> ROM

To find your actual MAC Address/ROM value, you can find in a couple places:
* BIOS
* System Preferences -> Network -> Ethernet -> Advanced -> MAC Address

Some users have even gone as far as using real Apple MAC Address dumps for their config, for this guide we'll be  using our real MAC Address but note that this is another option

When adding this to your config, `c0:7e:bf:c3:af:ff` should be converted to `c07ebfc3afff` as the `Data` type cannot accept colons(`:`).

![](https://i.imgur.com/vAW6Rkz.png)

## Verifying NVRAM

Please refer to the [Emulated NVRAM](https://khronokernel.github.io/Opencore-Vanilla-Desktop-Guide/post-install/nvram.html) section of the OpenCore Guide for more info.


## Clean out old attempts

This is important for those who've tried setting up iMessage but failed, to start make sure your NVRAM has been cleared. You can enable the option in the boot picker in your config under config.plist -> Misc -> Security -> AllowNvramReset.

Next open terminal and run the following:
```text
sudo rm -rf ~/Library/Caches/com.apple.iCloudHelper* \
            ~/Library/Caches/com.apple.Messages* \
            ~/Library/Caches/com.apple.imfoundation.IMRemoteURLConnectionAgent* \
            ~/Library/Preferences/com.apple.iChat* \
            ~/Library/Preferences/com.apple.icloud* \
            ~/Library/Preferences/com.apple.imagent* \
            ~/Library/Preferences/com.apple.imessage* \
            ~/Library/Preferences/com.apple.imservice* \
            ~/Library/Preferences/com.apple.ids.service* \
            ~/Library/Preferences/com.apple.madrid.plist* \
            ~/Library/Preferences/com.apple.imessage.bag.plist* \
            ~/Library/Preferences/com.apple.identityserviced* \
            ~/Library/Preferences/com.apple.ids.service* \
            ~/Library/Preferences/com.apple.security* \
            ~/Library/Messages
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

An extra tip is adding a payment card to the account, some users found this also helped with iMessage activation.

## Customer Code error

Welp mate, you've done it. you blackmailed your AppleID. The fix is simple but not pretty, **you MUST call Apple**. Otherwise, there is no proceeding besides using a new account, adding a payment card before calling can help legitimise the account so it doesn't seem as much like a bot.

![](https://i.imgur.com/ypDy99L.png)
