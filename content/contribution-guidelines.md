---
title: Contribution Guidelines
---

# Contribution Guidelines

Thank you for taking the time to contribute to Circonus Docs. These guidelines cover project organization and content formatting. When you're ready to contribute, head 
over to our [open source project](https://github.com/circonus/docs) hosted on Github. There, you can suggest updates and additions. Please keep in mind that all changes 
require a pull request and associated peer review before being merged and deployed to the live site.     

## Project Organization

Circonus Docs uses a website framework called [Hugo](https://gohugo.io/documentation/) which builds HTML pages from content markdown files. All raw content is located 
under the `content` directory. Here, the top-level directories correspond to Circonus' main products. Each of these products is then further nested into logical 
sections. 

### Adding a Section

To add a section, create a directory containing an `_index.md` file. The directory name should correspond to the desired section title, with all letters lowercased and 
spaces converted to hyphens. Hyphens are specifically important as the directory name impacts the URL path of pages within the section and in turn, their SEO.  

The `_index.md` file defines a section and allows for specification of yaml front matter (metadata) for the section. Front matter should contain the official section 
title as well as a weight indicating the appearance order in relation to sibling sections, where lower weight gets higher precedence. 

Here is front matter within an `_index.md` file for a section named "Dashboards":

```
---
title: Dashboards
weight: 10
---
```

If `_index.md` happens to be the only page within the section, the actual page content can be inserted below the front matter (see below for content formatting 
requirements). More commonly, sections include a number of underlying pages and subsections. Here, the `_index.md` page will render navigational boxes for each page 
and subsection and does not need any content beyond the front matter. Please note that the navigational boxes are ordered according to the weight specified in the 
front matter of underlying pages and subsection `_index.md` pages, where lower weight gets higher precedence. 

### Adding a Page

To add a page, create a markdown file (extension `.md`). The file name should correspond to the desired page title, with all letters lowercased and spaces converted to 
hyphens. Keep in mind that the file name will determine the URL path of each page and in turn, its SEO. Choosing a descriptive title and using hyphens, rather than 
underscores, will improve the page's SEO performance.     

Although file name determines page URL, the front matter (metadata) within the file itself defines the official page title. In addition to the title, front matter 
should also include a weight indicating the appearance order in relation to sibling pages, where lower weight gets higher precedence.

Here is example front matter for a page entitled "Creating Worksheets":

```
---
title: Creating Worksheets
weight: 40
---
``` 

After the front matter, the actual page content can be inserted (see below for content formatting requirements).  

## Content Formatting

All content must be contributed as [markdown](https://www.markdownguide.org/basic-syntax). Beyond standard markdown syntax, we have a few additional formatting 
requirements. 

### Line Length

For easier editing, please keep line length within the markdown files below 170 characters.

### Headings

Content should commence with a single h1 heading corresponding to the page title in the front matter. In the markdown that follows, h2, h3, h4, h5, and h6 headings 
can then be sequentially nested; h2s directly beneath h1, h3s directly beneath h2s, and so forth. All headings should be title cased and use the hash (#) markdown 
syntax (rather than underlines). Additionally, an empty new line should be inserted both above and below each heading for optimal distinction from body text. 

*Please note that heading ids and anchors will be dynamically inserted upon page load and do not need to be included within the markdown.*    

### URLs

For URLs and anchors specified within the content markdown, all letters should be lowercased. Additionally, links internal to Circonus Docs should use relative paths. 

### Images

Images referenced within the content markdown should be uploaded to the appropriate product directory inside of `static/images`. Remember to use the relative path to 
the image and include sensible alt text, like so:

```
![Metrics Explorer Layout Options](/images/circonus/metrics_gridview5.png)
``` 

Images should be PNGs or JPGs of reasonable file size (preferably less than 200 KB each). Minimizing image file size is particularly important for pages with several 
images as they will impact the page load time. In terms of dimensions, images should be at least 952 pixels wide, but no wider than 1920 pixels. However, natively 
smaller images should not be stretched to meet the minimum. For UI screenshots, ensure all text is legible at desktop dimensions (952 pixels wide). If needed, link to 
the original, larger version of the image.  