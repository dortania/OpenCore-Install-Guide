# Contributing

This is a community ran guide which is not officially endorsed by Acidanthera. Please do not bug Acidanthera with issues about this guide. Some guidelines when contributing:

* Use your brain (please)
* Proofread your submissions
* Pull Requests can be denied if we feel it does not fit or has inaccurate information. We will generally tell you why it is rejected though or ask for revisions.
* In general, try to avoid using "non-Acidanthera" tools when possible. Generally we want to avoid use of third-party tools  - though if it's impossible otherwise, then you can link it.
* Your PR must be ran through a markdown lint and have all issues fixed.

## How to Contribute

Generally through PRs. Best way to test your commits and make sure they are formatted correctly is downloading `nodejs` and getting the [gitbook-cli](https://github.com/GitbookIO/gitbook-cli) tools and [markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli) tool. When you run `gitbook serve`, it will set up a local webserver which you can connect to to view the changes you made. `markdownlint *` will throw any errors at you about formatting as well, and `markdownlint -f *` will attempt to fix these.



* Clone this repo
* Install the required tools:
   * `npm install -g markdownlint-cli`
   * `npm install -g gitbook-cli`
* Make your changes
* Build the site:
  * `gitbook install` (To install all the required gitbook plugins)
  * `gitbook serve` (Preview the site)
* Check markdown format:
  * `markdownlint -f *` (To fix any potential issues)

## Tips

Some tools that make contributing a bit easier:

* [Typora](https://typora.io) for real time markdown rendering
* [TextMate](https://macromates.com) for easy and powerful mass find/replace
* [Github Desktop](https://desktop.github.com) for more user friendly GUI 