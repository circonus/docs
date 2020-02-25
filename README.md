# Circonus Documentation Project

This repository generates docs.circonus.com. The associated HTML is generated by processing the contributed markdown files through Hugo.

The following Circonus projects are documented here:
* Circonus
* IRONdb
* CAQL

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

There are several straightforward dependencies to getting this project up and running:
* [Hugo](https://github.com/gohugoio/hugo) - A simple static site generator **(version 0.63.2 required)**
* [GNU Core Utilities](https://www.gnu.org/software/coreutils/) - Often included in Unixlike systems

#### MacOS

On MacOS it is very straightforward to get going. First, install brew:

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Then, install the hugo package:

```
brew install hugo
```

Make sure you have the right version (see above). If your version is newer, [install the older version](https://docs.brew.sh/Tips-N'-Tricks#installing-previous-versions-of-formulae).  If you already have the desired version, `brew pin hugo` will prevent the formula from being upgraded until you unpin it.

GNU Core Utilities is available by default on MacOS, so once the above two packages are installed you can run the Makefile.

#### Linux

On a Circonus development instance, either CentOS 7 or Ubuntu 16.04:

```
yum install circonus-developer-hugo
```
or
```
apt install circonus-developer-hugo
```

The latest version will always be the canonical one that we wish to use.

### Installing

This project can be used as a basic checkout from the GitHub repository. Simply:
```
git clone https://github.com/circonus/docs.git
```

To generate the associated docs HTML, run make from within the project directory:
```
make
```

The above command will create a directory called "public" which contains your generated HTML. Typically users prefer to preview this content in some fashion, to do so:
```
make server
```

## Contributing

To suggest a change to the project, create a dedicated branch. For details regarding the project organization and content formatting, see our 
[Contribution Guidelines](https://docs.circonus.com/contribution-guidelines/).

When you're finished with your work, issue a pull request and assign at least one reviewer. The reviewer will then approve and merge the work or suggest further changes.

## Deployment

Approved contributions will be automatically pulled and deployed to [docs.circonus.com](https://docs.circonus.com/) every few minutes. 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
