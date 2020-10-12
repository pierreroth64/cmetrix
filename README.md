# cmetrix

[![Build Status](https://github.com/pierreroth64/cmetrix/workflows/CI/badge.svg)](https://github.com/pierreroth64/cmetrix/actions?query=workflow%3ACI)

_CLI to build code metrics chart for your projects_

## Purpose

Your team is working on several projects. Each project is composed of several repositories.
You would like to have an overview of the amazing work that has been done.

Run `cmetrix` and you will get beautiful charts (thanks to [cloc](https://github.com/AlDanial/cloc) and [apexcharts](https://apexcharts.com/) used under the hood)

## Installation

- Install [NodeJS](https://nodejs.org/)
- Install [cloc](https://github.com/AlDanial/cloc)
- Then run `npm install -g cmetrix` ou run it through npx: `npx cmetrix --help`

## Usage

First, you have to describe your projects in a configuration file.
Then, just run `cmetrix charts -c <configuration-file>.json`

(`cmetrix charts --help` for more options)

### Authentication

You can pass authentication tokens to `cmetrix` when accessing private repositories through `https://` using the following environment variables: `CMETRIX_GITHUB_TOKEN`, `CMETRIX_GITLAB_TOKEN`, `CMETRIX_BITBUCKET_TOKEN`. 
⚠️ Do not fill your configuration file with tokens: `cmetrix` will do the job for you.

## Development

```
  npm run build
  npm start -- charts --help
```