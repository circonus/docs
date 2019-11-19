# Documentation Project

This 

One Paragraph of project description goes here

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

There are several straightforward dependencies to getting this project up and running:
* [Hugo](https://github.com/gohugoio/hugo) - A simple static site generator
* [s3deploy](https://github.com/bep/s3deploy) - A simple tool to deploy static websites to Amazon S3
* [GNU Core Utilities](https://www.gnu.org/software/coreutils/) - Often included in Unixlike systems

On MacOS it is very straightforward to get going. With brew, simply:
```brew install Hugo```

and

```brew install s3deploy```

GNU Core Utilities is available by default on MacOS, so once the above two packages are installed you can run the Makefile.

### Installing

This project can be used as a basic checkout from the GitHub repository. Simply:
```
https://github.com/circonus/docs.git
```

To generate the associate docs HTML, run make from within the project directory:
```
make
```

The above command will create a directory called "public" which contains your generated HTML. Typically users prefer to preview this content in some fashion, to do so:
```
make server
```

## Deployment

The intended deployment environment for the resulting generated HTML is S3. To deploy there, configure the appropriate AWS variables in your Makefile and:
```
make upload
```

Which will push all the contents of the /public directory up to the root of the configured AWS S3 Bucket.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
