KobraScript
==============
KobraScript is a statically-typed language that compiles to JavaScript. The languages favors explicit declarations.

#### Kobra Demands Respect (Hello, world!)
Say my name...

    say("Kobra!")                                    console.log("Kobra!");

#### Variable Declarations
In KobraScript, variable declarations are simplified to one character: `$`. Add more details.

    $ name = "Samson"                                       var name = "Samson";

    $ a, b, c = 5, 12, 13                                   var a = 5, b = 12, c = 13;

    $ is_red = true,                                        var is_red = true,
      is_food = false,                                          is_food = false,
      is_mine = true                                            is_mine = true;
Variables with uninitialized values must be type-casted on declaration. The default value is set to undefined.

    $ total : int                                           var total = undefined;

#### Functions
Functions in KobraScript take some inspiration from Java. Type of return is written in front of `fn` complying with the statically typed paradigm of KobraScript. Within the parameter of the function, a type can be specified or omitted for dynamic parameter input.

    floatfn average_intake (x):  --alternatively, (x : float[]) to take in a float array
        $ total = 0
        for ($ i = 0; i < x.length; i++)
            total = total + x[i]
        }  
        say(total)
        return total / x.length
    }

#### `if`-`else` Conditions
`If` and `else` conditions follow a similar paradigm as functions. In KobraScript, `if`-`else` conditional statement blocks should conclude with `..` to increase readability.

    if (is_red && is_food):                                 if (is_red && is_food) {
        eat ()                                                  eat ()
    .. else if (is_food && is_mine):                        } else if (is_food && is_mine)
        add_butter ()
    .. else:
        keep ()
    end

    --  Legal if, else-if, else (discouraged)
    if (is_red && is_food):
        eat ()
    end else if (is_food && is_mine):
        add_butter ()
    end else:
        keep ()
    end


#### Objects
Objects are very similar in KobraScript to JavaScript. Braces are used specifically for objects, and nothing else.

    $ bicycle = {
        frame = "aluminum" : str,
        year = 2009 : int,
        gears = 10 : int,
        speed = 12.7 : float
        
        move = proc ():
            Transform.translate(FORWARD * this.speed)
        end,
        upgrade_speed = floatfn ():
            return this.speed = this.speed * 1.1
        end,
        get_frame = strfn (): return this.frame; end
    }

#### Blueprints (Classes)

#### Arrays    
    $ protein_intake = [12, 21.3, 7.2, 20] : float[]    var protein_intake = [12.0, 21.3, 7.2, 20.0];


#### `for` and `while` Conditions

For and while loops follow a similar convention to functions: using the `:` and `end` syntax, and ...

    $ a = 0 -- A test variable for loops.               var a = 0; // A test variable for loops.

    for ($ i = 0; i < 4; i++):                          for (var i = 0; i < 4; i++) {
        a++                                                 a++;
    end                                                 }

    while (a < 10):                                     while (a < 10) {
        a++                                                 a++;
    end                                                 }

### Macrosyntax

### Microsyntax








