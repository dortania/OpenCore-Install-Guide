**Work In Progress**


So this section is for those who don't have native NVRAM, the most common hardware to not support native NVRAM are the non-Z370 300 series chipsets:

* B360
* B365
* H310
* H370
* Q370
* Z390

# Making nvram.plist

So to make a nvram.plist you'll need 2 things in your config.plist:

* `LegacyEnable`: set to `YES`
* `LegacySchema`: NVRAM variables set(OpenCore compares these to the variables present in nvram.plist)

Once you have those set, make sure to compile the latest version of OpenCore and you'll want to run the `LogoutHook.command` found in OpenCore[insert version number]/Utilities/LogoutHook. This will create a new folder named `dumps` where you'll find a file named nvram.plist. Place this on the root of your EFI and you'll have emulated NVRAM

![Emulated NVRAM](https://i.imgur.com/MOQh6ak.png)


But we're not done yet, we also need to setup a logouthook install to save NVRAM to nvram.plist on shutdown. 

Now grab the 'LogoutHook.command' and place it somewhere safe like within your user directory:

`/Users/(your username)/LogoutHook/LogoutHook.command`

Open up terminal and run the following:

```sudo defaults write com.apple.loginwindow LogoutHook /Users/(your username)/LogoutHook/LogoutHook.command```
