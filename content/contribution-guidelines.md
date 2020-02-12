---
title: Contribution Guidelines
---

# Contribution Guidelines

Thank you for taking the time to contribute to Circonus Docs. These guidelines cover project organization and content formatting. When you're ready to contribute, head 
over to our [open source project](https://github.com/circonus/docs) hosted on Github. There, you can suggest updates and additions via pull requests.    

## Project Organization

Circonus Docs uses a website framework called [Hugo](https://gohugo.io/documentation/). With Hugo, raw content is located under the `content` directory. Here, the 
top-level directories correspond to Circonus' main products. Each of these products is then further nested into logical sections. 

### Adding a Section

To add a section, create a directory containing an `_index.md` file. The directory name should correspond to the desired section title, with all letters lowercased and 
spaces converted to hyphens. 

The `_index.md` file defines a section and allows for the specification of yaml front matter (metadata). Front matter should contain the official section title as well 
as a weight specifying the appearance order in relation to sibling sections. Here is front matter within an `_index.md` file for a project named "Tutorials":

```
---
title: Tutorials
weight: 10
---
```

Apart from the front matter, the `_index.md` file need not include any content as it will not be rendered to the page.  

### Adding a Page

To add a page, create a markdown file. The file name should correspond to the desired page title, with all letters lowercased and spaces converted to hyphens.  

While file name determines page URL, the front matter (metadata) within the file itself defines the official page title. In addition to the title, front matter should 
also include a weight indicating where the page should appear in relation to sibling pages. Here is example front matter for a page entitled "Data Analysis":

```
---
title: Data Analysis
weight: 40
---
``` 

After the front matter, the actual page content can be inserted (see below).  

## Content Formatting

For regular pages (not `_index.md` files), inserted page content after the front matter. All content must be contributed as markdown. Here is a basic guide to 
[markdown syntax](https://www.markdownguide.org/basic-syntax). For easier editing, please keep line length below 170 characters.

### Headings

Content should commence with a single h1 heading corresponding to the page title in the front matter. In the markdown that follows, h2, h3, h4, h5, and h6 headings can 
then be logically nested. 

*Please note that headings anchors will be dynamically inserted upon page load and do not need to be included within the markup.*    

### URLs

For URLs and anchors specified within the content markdown, all letters should be lowercased. Additionally, links internal to Circonus Docs should use relative paths. 

### Images

Images referenced within the content markdown should be uploaded to the appropriate product directory inside of `static/images`. Remember to use the relative path to 
the image and include sensible alt text, like so:

```
![Image: 'Metrics Explorer Layout Options'](/images/circonus/metrics_gridview5.png)
``` 