**Work In Progress**

Wanting a more clean booting experience with macOS without all that verbose text while booting? Well you need a couple things:


UEFI/Protocols:
* `ConsoleControl` set to True

UEFI/Quirks:
* `ProvideConsoleGop` set to True
* `IgnoreTextInGraphics`: set to Graphics
* `SanitiseClearScreen`: set to True

Misc/Boot:
* `ConsoleBehaviourOs`: set to Graphics
* `ConsoleBehaviourUi`: set to Graphics
