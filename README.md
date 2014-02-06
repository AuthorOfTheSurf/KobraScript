KobraScript
==============
KobraScript is a statically-typed language that compiles to JavaScript. The languages favors explicit declarations.

#### Hello from Kobra!
    say("Hello, world!")                                    console.log("Hello, world!");

#### Variable Declarations
In KobraScript, variable declarations are simplified to one character: `$`. Add more details.

    $ name = "Samson"                                       var name = "Samson";
    $ a, b, c = 5, 12, 13                                   var a = 5, b = 12, c = 13;
Variables with uninitialized values must be type-casted on declaration. The default value is set to undefined.
    $ total : int                                           var total = undefined;


#### Arrays    
    $ protein_intake = [12, 21.3, 7.2, 20] : float[]        var protein_intake = [12.0, 21.3, 7.2, 20.0];