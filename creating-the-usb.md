# Creating the USB

## Creating the USB

Creating the USB is simple. All you need to do is format it as MacOS Journaled with GUID partition map. There is no real size requirement for the USB as OpenCore's entire EFI will generally be less than 5MB.

![Formatting the USB](https://i.imgur.com/5uTJbgI.png)

Next we'll want to mount the EFI partition on the USB with either mountEFI or Clover Configurator.

![mountEFI](https://i.imgur.com/4l1oK8i.png)

You'll notice that once we open the EFI partition, it's empty. This is where the fun begins.

![Empty EFI partition](https://i.imgur.com/EDeZB3u.png)

## Base folder structure

To setup OpenCore’s folder structure, you’ll want to grab those files from OpenCorePkg and construct your EFI to look like the one below:

![base EFI folder](https://i.imgur.com/YvRWHgI.png)

Now you can place your necessary .efi drivers from AppleSupportPkg and AptioFixPkg into the _drivers_ folder and kexts/ACPI into their respective folders. Please note that UEFI drivers are not supported with OpenCore!

Here's what mine looks like(For the majority of users you can ignore TOOLS but it can be useful like of for clearing NVRAM and other such things):

![Populated EFI folder](https://i.imgur.com/ymeHycR.png)

