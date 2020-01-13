# Cozi2Takehome

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Strategy

The strategy I used was based off a fairly literal interpretation of the example text.  I start by separating the inputted message by the return character (\n) based off the assumption that no one would declare a variable on the same line they were writing something else.  This separates all variables from the rest of the message, and then utilizing RegExp I can search for the notation used to declare them.  Now that I have isolated a variable declaration, I can produce an object containing the variable name, and it's value.  I then parse through the entire message replacing any uses of said variable name denoted with the @ and @{} symbols, and replace that with the value.  After I have replaced all inserts of a given variable, then I go on to the next variable.  This also keeps the user from delcaring a variable after it has been used, I do not retroactively parse the text to insert the value.  After all of this, I join separate lines back together, spit them out onto the page, and using the CSS white-space tool, it is displayed how it was inputted, minus the variable declarations.  No fancy NodeJS and Express server this time, I kept it just about the tool. 

## Extra

As a side note, all of this code could be taken and put into a separate javascript module, rather than just be inserted directly into the component.  This would allow me to utilize NodeJS when trying to paste in the contents of a file, as Node has a better time parsing line by line.  I would have used this strategy for the File Upload bonus segment, but honestly, it took me some time to figure out what strategy I wanted to use just for the base functionality.  