#jQuery.spotlite

## Usage

Call `$.spotlite()` on the element (usually an `<li>` or `<dl>`) containing your text input. Spotlite will position a list of search results directly after the text input.

## Requirements

Include jQuery and [jquery.spotlite.js](https://github.com/camerond/jquery-spotlite/blob/master/public/javascript/jquery-spotlite.js), then style the output however you like.

## Options

- `input_field` (jQuery object): pretty self-explanatory. Spotlite automatically finds the first input field inside the container on which you called `$.spotlite`.
- `pool` (required): this is your data source to search against. It can either be a simple array of strings or an array of objects (in which case you'll need to define an Output function as well).
- `multiselect` (defaults to `true`): either add multiple items to a result list or fill the text input with the user's choice.
- `result_list` (jQuery object): where your user's chosen items will reside (if `multiselect` is set to `true`). Spotlite looks for a `<ul>` right after the text input, and if it doesn't find one it makes one with a class of `spotlite-results`.
- `match_limit` (defaults to 10) how many items are displayed in the dropdown of matches.
- `threshold` (defaults to 1) how many characters the user must type before Spotlite starts searching for matches.
- `class_prefix` (defaults to `'spotlite'`): the CSS prefix for all of Spotlite's elements.
- `exclude_characters` (regex, defaults to `\\W` (non-word characters)): anything in this regex will be treated as whitespace for match-finding purposes (useful when your pool items include odd characters like parentheses and such).
- `bypass` (string): comma-delimited list of object attributes to not search against (if your pool contains objects)
- `output` (function): returns the matched string or object as a jQuery object. Defaults to returning a `<li>` containing the matched item's full text.

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

## Questions & Comments

We use Spotlite in a number of projects at [Hashrocket](http://hashrocket.com), and I'm working on an extended article detailing why & how Spotlite came about. In the meantime, feel free to [contact me](http://camerondaigle.com/about) with questions or feature requests (I'll politely answer your questions and (probably) politely decline your feature requests).