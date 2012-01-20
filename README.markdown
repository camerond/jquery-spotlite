#jQuery.spotlite

## Usage

Call `$.spotlite()` on the element (usually an `<li>` or `<dd>`) containing your text input. Spotlite will position a list of search results directly after the text input.

## Requirements

Include jQuery and [jquery.spotlite.js](https://github.com/camerond/jquery-spotlite/blob/master/public/javascript/jquery-spotlite.js), then style the output however you like (or feel free to pull the styles from the demo).

## Options

- `pool` (array or URL): this is your data source to search against. (If you're firing Spotlite on a `select` tag you don't need this.) It can either be a simple array of strings or an array of objects (in which case you'll need to define an Output function as well). You can either define the data directly in the function call or via a URL that will deliver the data.
- `multiselect` (defaults to `true`): either add multiple items to a result list or fill the text input with the user's choice.
- `$result_list` (jQuery object, defaults to nearest `<ul>` or will create one if none is found): where your user's chosen items will reside (if `multiselect` is set to `true`).
- `match_limit` (defaults to 10): how many items are displayed in the dropdown of matches. Displays all matches if set to 0.
- `threshold` (defaults to 1): how many characters the user must type before Spotlite starts searching for matches.
- `display_matches_on_focus` (boolean): always display match list when input is focused, even if nothing has been typed yet.
- `class_prefix` (defaults to `'spotlite'`): the CSS prefix for all of Spotlite's elements.
- `exclude_characters` (regex, defaults to `\\W` (non-word characters)): anything in this regex will be treated as whitespace for match-finding purposes (useful when your pool items include odd characters like parentheses and such).
- `bypass` (string): comma-delimited list of object attributes to not search against (if your pool contains objects)
- `output` (function): returns the matched string or object as a jQuery object. Defaults to returning a `<li>` containing the matched item's full text. (Make sure to use $.html() to preserve Spotlite's phrase highlighting.)
- `before_match_display` (function): callback to expose the `<ul>` of matches for adjustment before display.
- `ajax` (boolean): tells the plugin to load its results via Ajax. If set to true, the ajax_opts object is required. The ajax request made sends the value of the associated input as a parameter named search. The expected return is a JSON object with the array of filtered or non-filtered results in the format of:
`{ "matches": ["John Doe", "Jane Doe"] }`
where "matches" is the required object key that the results are assigned to.
- `ajax_opts` (object, required if ajax is true): an object containing the basic options given to a jQuery Ajax call. The only required property is url; success, complete, and error ar optional callbacks that are fired after the internal methods are run. Every optional callback receives the jQuery input object as its context and matching arguments to the jQuery.ajax method callback arguments.

## Features

The best way to see the breadth of what Spotlite can handle is to check out the [test suite](http://jquery-spotlite.heroku.com/test).

However, Spotlite's most interesting feature deserves a quick example: the ability to search through an array of Javascript objects. This is tremendously useful in situations where you want to spice up your search results (with images or specific CSS classes, for example) or create hidden inputs to pass back to the server for form submission.

Here's a contrived example. Say your pool is full of objects like this:

    {
      name: "Frances McDormand",
      location: "San Diego Sports Arena",
      image: "/images/frances.jpg"
    }

In this case, you'll probably want to search on name only, and display the location and thumbnail image in your dropdown menu & results. Just set the `bypass` option to `"location, image"`, and redefine the `output` function to something like this:

    output: function(e) {
      return $("<li />")
        .text(e.name)
        .append($("<small />", { src: e.location })
        .append($("<img />", { "src": e.image }));
    }

This is just a basic example - the ability to directly control all of your users' matches and results gives you plenty of design flexibility.

__New in 0.2.1:__ Now handles multi-layered JSON objects, thanks to none other than [Durran Jordan](https://twitter.com/#!/modetojoy) of [Mongoid](http://mongoid.org) fame.

__New in 0.3:__ Now supports Ajax calls for search results and can be called on a `select` tag instead of an input with JSON.

## Questions & Comments

We use Spotlite in a number of projects at [Hashrocket](http://hashrocket.com), and I'm working on an extended article detailing why & how Spotlite came about. In the meantime, feel free to [contact me](http://camerondaigle.com/about) with questions or feature requests (I'll politely answer your questions and (probably) politely decline your feature requests).

