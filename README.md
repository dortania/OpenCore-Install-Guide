---
home: true
heroImage: /dortania-logo-clear.png
heroText: Guia de instalación de OpenCore de Dortania (Adaptación no oficial al español)
actionText: Comenzando →
actionLink: prerequisites.md

meta:
- name: description
  content: Versión soportada actualmente 0.5.9
---

# ¿Qué es Opencore? Y, ¿para quién es esta guía?

* **Español**: Esta es una traducción no oficial la cual no está afiliada a Dortania, y puede quedar obsoleta fácilmente. La misma está acompañada por la [traducción de la sección post-instalación de rvstry](https://github.com/rvstry/OpenCore-Post-Install).

* **English**: This is an unofficial translation that is not affiliated with Dortania, and is likely to become outdated soon. This tranlastion is accompanied by [rvstry's translation of the OpenCore Post-Install Guide](https://github.com/rvstry/OpenCore-Post-Install).

OpenCore es a lo que nos referimos como un "gestor de arranque", ésta es una complicada pieza de software que utilizamos para preparar a nuestros sistemas para macOS. Específicamente inyectando ciertos datos a macOS como SMBIOS, tablas de ACPI y kexts (extensiones del kernel). Lo distinto de esta herramienta es que ha sido diseñada teniendo en cuenta tanto seguridad como calidad, permitiéndonos utilizar muchas herramientas de seguridad usadas en macs reales, como el SIP y FileVault. Una explicación más profunda puede ser encontrada aquí: [¿Por qué OpenCore encima de Clover y otros?](why-oc.md)

Esta guía se centrará en dos temas:

* Instalar macOS en computadoras basadas en X86
* Enseñarte qué es lo que hace funcionar a tu hack

Debido a esto, esperamos que leas, aprendas y hasta busques en google. Recuerda que esto no es una simple instalación de un click.

Cabe mencionar que OpenCore sigue siendo nuevo y se encuentra actualmente en Beta. Por más que sea bastante estable, y posiblemente más estable que Clover en prácticamente todos los sentidos, está siendo actualizado regularmente, por lo que partes de la configuración son cambiadas frecuentemente (por ejemplo que se incorporen los llamados "quirks" y que estos subplanten a otros anteriores).

Por último, aquellos que tengan problemas pueden visitar [El subreddit de Hackintosh](https://www.reddit.com/r/hackintosh/) y [Nuestro servidor de discord](https://discord.gg/u8V7N5C) para recibir ayuda. 
**Nota: Tanto el Subreddit como el servidor de Discord sólo admiten posts en inglés.** 
