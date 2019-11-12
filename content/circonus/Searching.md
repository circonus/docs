.

.

.

# Warning: {#Warning}
> This is archived historical content deprecated by [Search v2](/SearchingV2.md).

.

.

.



## Searching {#Searching}
Searches in Circonus operate on an analyzed field that is typically a combination of the object name, any notes/descriptions, and tags.

Searching does not operate on partial words, but does allow **wildcards**. The symbol * is used for wildcards. When the wildcard symbol is used in a search, any string of characters can stand in for the wildcard. Note that wildcards can only be used at the beginning or end of a search term and will not function if used in the middle. See the examples below.

Quotation marks (" ") can be used to search for an exact phrase in which the words appear in an exact order. See the examples below.


### Example Search Terms {#ExampleSearchTerms}
The following are examples of search terms to enter into the search field to produce the results described.

Search for items containing the word "foo":
 * foo

Search for items with a name beginning with "foo":
 * foo*

Search for items containing a word that contains the character string "foo":
 * *foo*

Search for items containing the words "foo" and "bar" in any order and in any place in the name:
 * foo bar

Search for items containing the term "foo" followed by the term "bar":
 * "foo bar"

Search for a specific IP or hostname (using quotation marks to search for the exact name):
 * "192.168.1.1"
 * "www.circonus.com"

Search for all tags in the application category:
 * application:*

Search for all tags in the application category with a name beginning with "baz":
 * application:baz*

This will return no results because the wildcard character is used in the middle:
 * foo*bar


### Filtering Search Results with Tags {#FilteringSearchResultswithTags}
Circonus also allows you to use tags to filter your search results directly from the search box, provided you know the exact tag name. You can do this by using a special format: "tags:...".

For example, to search for items with the word "foo" that are tagged with "application:bar", you would enter the following search terms:
 * foo (tags:application:bar)

To filter your search results using multiple tags, separate the tags with commas (,). For example:
 * foo (tags:application:bar,os:omnios)
