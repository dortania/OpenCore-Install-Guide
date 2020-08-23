# How to test and build this guide

The **OpenCore Install Guide** has a number of scripts to simplify development and
ensure that the pages are formatted consistently, spell-checked, etc.

## Getting Started

To get started with this project, download or `git clone` this repository to a local directory.
You will need all the tools required for Node.js development: Node, npm, etc.
There are any number of resources on the internet that describe how to install these tools.

Then `npm install` to pull in all the required modules.
*Note: npm may give errors during the install process.
You can also use Yarn - `yarn install`.
If you use `yarn`, substitute it for `npm` in the commands below.*

## Test/Build Commands

There are several `npm` (or `yarn`) commands to facilitate the process of writing the Guide:

`npm dev` - Run a development web server to display the current state of the Guide.
Watch all the files of the repo and rebuild pages on-the-fly.
Changes are immediately reflected in the browser at [http://localhost:8080/OpenCore-Install-Guide/](http://localhost:8080/OpenCore-Install-Guide/)

`npm run lint` - Run the linter on all the source files to ensure the markdown is well formatted.

`npm run fix-lint` - Attempt to automatically correct the problems detected by lint.

`npm run spellcheck` - Run a spell checker on all the source files, and point out errors.
The text is checked against the files in `dictionary/`.
Add words to those files to prevent them from being flagged.

`npm run test` - Run both the linter and spell checker.

`npm run sort-dict` - Sort the directory files in `directory/`
Useful after adding words to a directory file.

`npm run build` - Create a "distribution" of all the HTML files in the `.vuepress/dist` directory.
