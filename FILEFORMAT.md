# JSON Package File (JPF)
Document and template files for neo are serialized as valid JSON files, but must contain certain elements in a fixed order to be valid:

```
[
	"https://github.com/smeans/neo#NeoStoryFile",
	{
		"type": "metadata",
		"title": "A Soft Life"
	},
	... 
]
```

A valid JPF must contain an array as its top-level element. The array must start with a single string value, which is the URL/URN defining the specific JPF file type. This allows utilities to quickly parse the first few bytes of any JPF and determine what type of data it contains. The initial string array element is the only requirement for a valid JPF.

The JPF must also be formatted with newlines after each element and with array and dictionary delimiters ('[', ']', '{', and '}') appearing on lines by themselves (other than whitespace or commas).

For a valid neo document, all array elements after the JPF type URL must be dictionaries. All dictionaries must contain a "type" key that indicates what that element represents. The first element following the URL/URN string must be of type "metadata" and contains information about the story that can be used to display it in the neo Bookshelf.