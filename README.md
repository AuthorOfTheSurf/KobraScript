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

    --alternatively, (x : float[]) to take in a float array
    floatfn average_intake (x):
        $ total = 0
        for ($ i = 0; i < x.length; i++):
            total = total + x[i]
        end  
        say(total)
        return total / x.length
    end

A function that does not return anything in KobraScript is called a procedure, written as `proc`. These have a special declaration, shown below.

    proc print_intake (y):
        say(average_intake(y))
    end

#### `if`-`else` Conditions
`If` and `else` conditions follow a similar paradigm as functions. In KobraScript, `if`-`else` conditional statement blocks should conclude with `..` to increase readability.

    if (is_red && is_food):                                 if (is_red && is_food) {
        eat ()                                                  eat ();
    .. else if (is_food && is_mine):                        } else if (is_food && is_mine) {
        add_butter ()                                           add_butter ();
    .. else:                                                } else {
        keep ()                                                 keep();
    end                                                     }

Below is also another legal form of an if, else-if, else conditional statement, but this form is discouraged.

    if (is_red && is_food):                                 if (is_red && is_food) {
        eat ()                                                  eat ();
    end else if (is_food && is_mine):                       } else if (is_food && is_mine) {
        add_butter ()                                           add_butter ();
    end else:                                               } else {
        keep ()                                                 keep();
    end                                                     }

#### `for` and `while` Conditions

For and while loops follow a similar convention to functions: using the `:` and `end` syntax.

    $ a = 0 -- A test variable for loops.               var a = 0; // A test variable for loops.

    for ($ i = 0; i < 4; i++):                          for (var i = 0; i < 4; i++) {
        a++                                                 a++;
    end                                                 }

    while (a < 10):                                     while (a < 10) {
        a++                                                 a++;
    end                                                 }


#### Objects
Objects are very similar in KobraScript to JavaScript. Braces are used specifically for objects, and nothing else.

    $ bicycle = {
        frame = "aluminum" : str,
        year = 2009 : int,
        gears = 10 : int,
        speed = 12.7 : float,
        
        move = proc ():
            Transform.translate(FORWARD * this.speed)
        end,
        upgrade_speed = floatfn ():
            return this.speed = this.speed * 1.1
        end,
        get_frame = strfn (): return this.frame; end
    }

#### Blueprints
Blueprints are special structures in KobraScript. It allows for a robust way to define object properties and methods, and expediate the process of creating a complex object. Blueprints use a different file extension, `.ksb`, due to the fact that blueprints are individual files.

To utilize a blueprint in KobraScript, you "construct" the blueprint in a variable declaration, as you would an object in other languages.
    
    $ p = construct Person(name = "Joe", age = 18)

Blueprints consists of 4 parts:

1. `has`
       * Initialization of Blueprint properties.
       * Specific and dynamic property construction.
           - Specific -> `construct Person (hairColor = "black")`
           - Dynamic  -> `construct Person()`, `construct Person(name = "Joe")`, etc.
       * Default values
           - The value to the right of the `#` is the default value.
               - `haircolor = hairColor : str # "black"`
2. `does`
       * Initialization of Blueprint methods (functions).
       * Methods can be defined from parameters.
            `do_excercise = excercise : proc # running()`
3. `synget`, which allows `get_property()` functions to be created, and
4. `synset`, which allows `set_property()` functions to be created.

Here is an example of a blueprint of a Person.  

    $ blueprint Person (name, age, hairColor, excercise)
    has {
        name = name : str,
        age = age : int,
        hairColor = hairColor : str # "black" 
    }
    does {
        do_excercise = excercise : proc # running,
        running = proc ():
            say("26.2 miles")
        end
    }
    synget {
        name, age, hairColor
    }
    synset {
        hairColor
    }

#### Arrays    
    $ protein_intake = [12, 21.3, 7.2, 20] : float[]    var protein_intake = [12.0, 21.3, 7.2, 20.0];

### Macrosyntax

    PROGRAM ::=  STMT+
            |    BLUPRNT

    DEC     ::=  VARDEC  |  FNDEC
    TYPE    ::=  ('bool' | 'char' | 'int' | 'float' | 'str' | 'bits' | ID)  ('[]')*
    FNTYPE  ::=  TYPE  'fn'

    ASSIGN  ::=  ID  '='  EXP  END
            |    ID  ':=:'  ID  END
    BLOCK   ::=  ':'  STMT+  'end'
            |    ':'  STMT+  '..'
    VARDEC  ::=  '$'  ID  '=' EXP  (':'  TYPE)?  END
            |    '$'  ID  ':'  TYPE  END
            |    '$'  ID  (',' ID)+  ('='  EXP  (','  EXP)?)?  (':'  TYPE)?  END
            |    '$'  (ID  '='  EXP (':'  TYPE)?  ',')*  ID  '='  EXP (':'  TYPE)?  END
    FNDEC   ::=  (FN0  |  FN1  |  FN2)  END
    FN0     ::=  '$'  ID  '='  FNTYPE  PARAMS  BLOCK
    FN1     ::=  '$'  (ID  '='  FNTYPE  PARAMS  BLOCK  ',')*  FN0
    FN2     ::=  FNTYPE  ID  PARAMS  BLOCK

    BLUPRNT ::=  '$'  'blueprint'  ID  HASBLK  DOESBLK  SYNSET?  SYNGET?  'defcc'
            |    '$'  'blueprint'  ID  HASBLK  DOESBLK  SYNGET?  SYNSET?  'defcc'
    HASBLK  ::=  '$'  'has'  '{'  VARDEC?  '}'
    DOESBLK ::=  '$'  'does'  '{'  FNDEC?  '}'
    SYNSET  ::=  '$'  'synset'  '{'  (ID ',')*  ID  '}'
    SYNGET  ::=  '$'  'synget'  '{'  (ID ',')*  ID  '}'

    VAR     ::=  ID
            |    VAR  '['  EXP  ']'
            |    VAR  '.'  ID

    STMT    ::=  DEC
            |    DEC  'if'  EXP
            |    COND
            |    LOOP
            |    RETURN

    LOOP    ::=  'while'  '('  EXP  ')'  BLOCK
            |    'for'  '('  (VARDEC)?  ';'  EXP  ';'  INCREMENT  ')'  BLOCK    

    COND    ::=  (COND0  |  COND1  |  COND2)
    COND0   ::=  'if'  '('  EXP  ')'  BLOCK
    COND1   ::=  COND0  'else if'  '('  EXP  ')'  BLOCK
    COND2   ::=  (COND0  |  COND1)  'else'  BLOCK

    EXP     ::=  EXP1 ('||' EXP1)*
    EXP1    ::=  EXP2 ('&&' EXP2)*
    EXP2    ::=  EXP3 (('<' | '<=' | '==' | '!=' | '>=' | '>') EXP3)?
    EXP3    ::=  EXP4 ([+-] EXP4)*
    EXP4    ::=  EXP5 ([*/] EXP5)*
    EXP5    ::=  EXP6 (('**'  |  '-**')  EXP6)
    EXP6    ::=  '~!'  EXP7 
            |    '~?'  EXP7 
    EXP7    ::=  ('!')?  (EXP7  |  EXP8)
    EXP8    ::=  'true' | 'false' | STR | INT | FLOAT | HEX | ID | '(' EXP ')'

    RETURN  ::=  'return'  EXP  END
    END     ::=  '\x09'  |  ';'

    PARAM   ::=  ID (':' TYPE)?
            |    EXP (':' TYPE)?
    PARAMS  ::=  '('  PARAM  (','  PARAM)*  ')'
    INCR    ::=  VAR  "++"
            |    VAR  "--"
            |    VAR  "+="  int
            |    VAR  "-="  int
            |    VAR  "*="  int

    COMMENT ::=  '--'  TEXT  END
            |    '---'  TEXT  '!--'

### Microsyntax

    BITS    ->  [01]*
    INT     ->  -?[\d]*
    FLOAT   ->  INT.\d*
    HEX     ->  (\d | [a-f] | [A-F])*
    STR     ->  \w+
    BOOL    ->  'true'  |  'false'
    ID      ->  [_a-zA-Z]\w*  --must not be on the banned list (i.e. tokens)










