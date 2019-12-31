---
title:
draft: true
---

# Tags {#Tags}
Tags let you group and filter your items in Circonus. Many items in the app support tagging, and support for additional items will be coming in the future. When using tags, you can choose to use categories to create logical groupings of tags, or you may use only uncategorized tags, if you prefer. In the tags dialogs, uncategorized tags appear under the category "Uncategorized," but in the interface & API they will be without a category. When you're working with tags in text form (like in the API), note that categories and tags are separated with colons (e.g. "os:windows"), and are always lowercase. 

## Adding Tags {#AddingTags}
To add tags to an item, open the "Add Tag" dialog in the Check Details page by clicking on the "Tags +" button.

![Image: 'tags-addtag3.png'](/images/circonus/tags-addtag3.png)

In the dialog, choose an existing category or enter a new category by choosing the "+ ADD" option in the category select dropdown. If you choose an existing category, any tags it contains will then be populated into the tag select dropdown. Choose an existing tag or enter a new tag (again by choosing the "+ ADD" option), and then click "Add Tag +" to add the tag to the item. Upon page reload, any unused categories and tags will not be shown in the dropdowns (except for a few pre-created categories which are always shown), although you may re-enter them again if you wish to use them again in the future.

When tags are displayed, it will automatically be assigned a color based on its category; we cycle through a series of colors which have been preselected to be easily distinguishable from one another.

## Removing Tags {#RemovingTags}
To remove a tag, look for the small "x" button at the right end of the tag in the tag bar. Click that button and the tag will be immediately removed.

