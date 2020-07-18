# Supporting the guides

**Note**: This is a community run guide which is not officially endorsed by Acidanthera. Please do not bug Acidanthera with issues about this guide.

Want to help support the guide? Well there's some ways you can help!

* [Contributing via Issues](CONTRIBUTING.md#contributing-via-issues)
* [Contributing via PRs](CONTRIBUTING.md#contributing-via-prs)

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
  * We would also appreciate sources for any bigger commits to make it easier on us to verify the info your provide is valid
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

Best way to test your commits and make sure they are formatted correctly is downloading Node.js then running `npm install` to install dependencies. When you run `npm run dev`, it will set up a local webserver which you can connect to view the changes you made. `npm test` will throw any errors at you about formatting and spellchecking as well. If you want `markdownlint` to automatically attempt to fix linting, run `npm run fix-lint`.

* [Fork this repo](https://github.com/dortania/OpenCore-Install-Guide/fork/)
* Install the required tools:
  * Node.js
* Make your changes.
* Build the site:
  * `npm install` (To install all the required plugins)
  * `npm dev` (Preview the site)
    * Can be found at `http://localhost:8080`
* Check linting and spellcheck:
  * `npm test`
  * `npm run lint` and `npm run spellcheck` (to run them individually)
  * `npm run fix-lint` (To fix any potential issues)

### Tips

Some tools that make contributing a bit easier:

* [Typora](https://typora.io) for real time markdown rendering.
* [TextMate](https://macromates.com) for easy and powerful mass find/replace.
* [Github Desktop](https://desktop.github.com) for more user friendly GUI.
