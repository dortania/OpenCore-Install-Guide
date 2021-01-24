# Supporting the guides

**Note**: This is a community run guide which is not officially endorsed by Acidanthera. Please do not bug Acidanthera with issues about this guide.

Want to help support the guide? Well there's some ways you can help!

* [Contributing via Issues](#contributing-via-issues)
* [Contributing via PRs](#contributing-via-prs)
* [Contributing via Translations](#contributing-via-translations)

Note: For those wanting to contribute financially, we seriously appreciate it but we're a non-profit organization. We do this to teach, not to make money. If you have some money left over we highly recommend donating it to a charity. [Crohn's and Colitis Canada](https://crohnsandcolitis.donorportal.ca/Donation/DonationDetails.aspx?L=en-CA&G=159&F=1097&T=GENER) is one we recommend if you have none on mind.

## Contributing via Issues

 Contributing via Issues is pretty simple but there are some rules:

* Keep issues tab dedicated to guides issues only, **no personal hackintosh issues**. It is not a place to discuss installation issues.
* If for a typo or better clarification, please indicate what page it was on. Would appreciate not going for a scavenger hunt on where these issues are.

You can find the bugtracker here: [Bugtracker](https://github.com/dortania/bugtracker)

## Contributing via PRs

Some guidelines when contributing via PRs:

* Use your brain (please).
* Proofread your submissions.
* Pull Requests can be denied if we feel it does not fit or has inaccurate information. We will generally tell you why it is rejected though or ask for revisions.
  * We would also appreciate sources for any bigger commits to make it easier on us to verify the info you provide is valid
* Images must be hosted locally in the repo under the `../images/` folder
* Your PR must be run through a markdown lint and have all issues fixed.
* In general, try to avoid using "non-Acidanthera" tools when possible. Generally we want to avoid use of third-party tools  - though if it's impossible otherwise, then you can link it.
  * Tools explicitly banned:
    * UniBeast, MultiBeast and KextBeast
      * More info can be found here: [Tonymacx86-stance](https://github.com/khronokernel/Tonymcx86-stance)
    * TransMac
      * Know for creating borked USB drives
    * Niresh Installers
      * We'd like to avoid piracy with the guides

### How to Contribute

Best way to test your commits and make sure they are formatted correctly is by downloading Node.js then running `npm install` to install dependencies. When you run `npm run dev`, it will set up a local webserver which you can connect to view the changes you made. `npm test` will throw any errors at you about formatting and spellchecking as well. If you want `markdownlint` to automatically attempt to fix linting, run `npm run fix-lint`.

Simple step-by-steps:

* [Fork this repo](https://github.com/dortania/OpenCore-Install-Guide/fork/)
* Install the required tools:
  * [Node.js](https://nodejs.org/)
* Make your changes.
* Build the site:
  * `npm install` (To install all the required plugins)
  * `npm run dev` (Preview the site)
    * Can be found at `http://localhost:8080`
* Check linting and spellcheck:
  * `npm test`
  * `npm run lint` and `npm run spellcheck` (to run the tests individually)
  * `npm run fix-lint` (To fix any potential issues)
  * For words not supported by the default spellcheck, please add them to the [dictionary.txt](./dictionary/dictionary.txt) and run `npm run sort-dict`

### Tips

Some tools that make contributing a bit easier:

* [Visual Studio Code](https://code.visualstudio.com)
* [Typora](https://typora.io) for real time markdown rendering.
* [TextMate](https://macromates.com) for easy and powerful mass find/replace.
* [Github Desktop](https://desktop.github.com) for more user friendly GUI.

## Contributing via Translations

While Dortania's guide are primarily English based, we know there's plenty of other languages in the world and that not everyone is fluent in English. If you want to help translate our guides into different languages, we're more than happy to support you.

Main things to keep in mind:

* Translations must be a dedicated fork and won't be merged into Dortania's guide
* Forks must indicate they're translations of Dortania and are not official
* Forks must also comply with our [License](LICENSE.md)

If the above are met, you're free to host your translation without issue! Dortania's sites are built with [VuePress](https://vuepress.vuejs.org) using [Travis-CI](https://travis-ci.org) and finally hosted on [Github Pages](https://pages.github.com), so there is no cost to hosting your own translation.

If you have any questions or concerns with either translations or hosting, feel free to reach out on our [Bugtracker](https://github.com/dortania/bugtracker).

Current known translations:

* [InyextcionES](https://github.com/InyextcionES/OpenCore-Install-Guide)(Spanish)
* [macOS86](https://macos86.gitbook.io/guida-opencore/)(Italian, no longer maintained)
* [Technopat](https://www.technopat.net/sosyal/konu/opencore-ile-macos-kurulum-rehberi.963661/)(Turkish)
* [ThrRip](https://github.com/ThrRip/OpenCore-Install-Guide)(Chinese)
* [Shijuro](https://github.com/shijuro/OpenCore-Install-Guide)(Russian)

And note that these translations are subject to authors preferences, translation changes and human errors. Please keep this in mind when reading as they're no longer official Dortania guides.
