<div align="center">
  <a href="https://winget.run/">
    <img src="https://cdn.discordapp.com/attachments/697810943714918430/716269042414911558/wingetdotrun_blue_logo.png" alt="winget.run logo">
  </a>

A modern web-app and API for viewing, finding, and easily installing [winget](https://github.com/microsoft/winget-cli) packages.

[![](https://img.shields.io/website/https/winget.run?style=flat-square)](https://winget.run/)
[![](https://img.shields.io/github/v/release/winget-run/web?style=flat-square)](https://github.com/winget-run/web/releases)
[![](https://img.shields.io/github/workflow/status/winget-run/web/ci-cd/master?style=flat-square)](https://github.com/winget-run/web/actions)
[![](https://img.shields.io/github/issues/winget-run/web?style=flat-square)](https://github.com/winget-run/web/issues)
[![](https://img.shields.io/github/issues-pr/winget-run/web?style=flat-square)](https://github.com/winget-run/web/pulls)
[![](https://img.shields.io/github/license/winget-run/web?style=flat-square)]()

:star: We appreciate your star, it helps!

</div>

## Contents

- [Features](#Features)
- [Api](#Api)
- [Community](#Community)
- [Roadmap](#Roadmap)
- [Contributing](#Contributing)
- [Support us](#Support-us)
- [Authors](#Authors)
- [Acknowledgments](#Acknowledgments)
- [License](#License)

## Features

With [our website](https://winget.run/), you'll never again need to browse the Windows 10 store or look through websites for exe downloads and go through the laborious installation process time and time again (assuming that what you're looking for is [available on winget](https://github.com/microsoft/winget-pkgs) of course). We understand how frustrating this process can be, especially after a fresh Windows install, thus, we made this tool to streamline the process! Below are some of our features with more coming soon!

#### Package navigation

- Access all of Microsoft's Windows 10 packages through a modern interface.
- View the most recently added packages at a glance on our homepage - see if theres anything that interests you!
- Search packages by name, organisation, or even keywords. Don't know exactly what you're looking for? - our search has you covered!
- List packages by organisation; now you can install all those Microsoft packages in one go.
- View detailed package info and versions on our detailed package pages.

#### Easy installation

- Copy the install command with one click and paste it into your terminal - it's that easy!
- Bulk install packages with ease; select everything you want and copy a single install script.
- Works with all package versions

#### Modern design

- Modern and professional design.
- Responsive; works on both desktop and mobile at varying screen sizes.
- Accessibility; our website works with screen-readers and keyboard-only input.

## API

Our API provides the required functionality for our website and allows us to query live package data. All relevant infomation can be found in our [GitHub repo](https://github.com/winget-run/api).

As we are still early in development, our API has not yet been made public and is subject to breaking changes without notice. If you'd like access, please don't hesitate to [contact us]() and we can work something out!

## Community

You can contact us on [Twitter](https://twitter.com/wingetdotrun) and through [Ko-fi](https://ko-fi.com/wingetdotrun).

We'll make our best efforts to post any updates and interact with the community on both platforms so if you're on any one of those then you're set.

## Roadmap

While we think that [winget.run](https://winget.run/) is currently in a usable and complete state, we have many features planned going forward in the hopes of further impoving user experience. That being said, our roadmap is currently fairly limited as the project is still in its infancy; it hasn't even been 2 weeks since the [announcement of winget](https://devblogs.microsoft.com/commandline/windows-package-manager-preview/) as of writing this.

#### Completed

- Basic usable API.
- Basic usable website.
- Automatically importing new packages from Microsoft's [winget repo](https://github.com/microsoft/winget-pkgs).
- CI/CD.
- Hosting and deployments.

#### Current

- Getting more users.
- Donations/funding to cover running costs.
- Code cleanup and refactoring.
- Unit and integration testing.

#### Future features

- Public API.
- Package importer rewrite.
- Database migrations.
- Observability. (devops)
- Blue/green deployments. (devops)
- Canary deployments. (devops)

We will work on improving the roadmap down the line as well as solidifying a release schedule. Community requests are, of course, welcome. If you want to report an issue, request a feature, or even have a question, don't be afraid to [open a ticket](https://github.com/winget-run/wingetdotrun/issues/new)!

## Contributing

Issues and pull requests are welcome. We don't have a contribution guide as of yet but here are some pointers that we'd like to see followed as much as possible:

- There should be no pushes directly to master or develop.
- PRs to master require at least 2 reviews, develop requires at least 1.
- When making contributions, your current working branch should be named as follows: `feature/<ticket_number>_<short-description>`, e.g. `feature/12_api-ratelimiting`
- All PRs should be to develop (and not master).
- All code should pass linting and tests.
- We'd appreciate it if you wrote unit tests for your code, although that's not required for now.

Alongside the contribution guide, we're also currently taking measures in order to make the avid contributor's workflow easier;

- We will be setting up ZenHub boards for the project.
- All issues are currently listed as TODOs in the code, those will be converted to GitHub issues shortly.
- Issue templates will be making an appearance soon™.

Additional guides, such as setting up a development environment, may be provided in our other repos (api/web) with more sepcific information for those parts of the project. For more in-depth information and queries, please contact us on [Twitter](https://twitter.com/wingetdotrun).

## Support us

If you don't know programming and would still like to support the project, please [consider donating](https://ko-fi.com/wingetdotrun)! Servers aren't free, far from it, and at the time of writing, we're running at a loss. Any amount is highly appreciated and will allow us to continue supporting and improving [winget.run](https://winget.run/) into the future.

## Authors

- Lukasz Niezabitowski
- Matthew Watt
- Ryan Larkin

## Acknowledgments

- My beloved coffee machine for making glorious coffee in the morning (and night) and keeping me awake during these 12 hour programming sessions as we rushed to get this released.

## License

We currently don't have a license, but we're working on it and we will shortly!
