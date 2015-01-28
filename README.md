<p align="center">
  <img src="ks-logo.jpg" alt="KobraScript Logo"/>
</p>
==============
KobraScript is a language that harvests the power of JavaScript with an incredibly intuitive syntax.

#### Kobra Demands Respect (Hello, world!)
Say my name...

    say "Kobra!"                                           console.log("Kobra!");

#### Variable Declarations
In KobraScript, variable declarations are simplified to one character: `$`  
Also: no semicolons, *ever*.

    $ name = "Samson"                                       var name = "Samson";

    $ likesMusic = true,                                    var likesMusic = true,
      likesJazz                                                 likesJazz = undefined;

    $ isRed = true,                                         var isRed = true,
      isFood = false,                                           isFood = false,
      isMine = true                                             isMine = true;

Variables with uninitialized values are set to undefined.

    $ total                                                 var total = undefined;

#### Functions
Declare a function easily with `fn`. Open the block with `:` and close using `end`, or `..`

    fn average_intake (x):                                  function averageIntake (x) {
        $ total = 0                                             var total = 0;
        for ($ i = 0; i < x.length; i++):                       for (var i = 0; i < x.length; i++) {
            total = total + x[i]                                    total = total + x[i]
        end                                                     }
        say total                                               console.log(total)
        return total / x.length                                 return total / x.length
    end                                                     }

    $ getSoup = fn (): return Res.soupOfTheDay() ..,        var getSoup = function () {return Res.soupOfTheDay()},
      getDrink = fn (): return Res.specdrinks ..,               getDrink = function () {return Res.spacdrinks},
      placeOrder = fn (item, quantity):                         placeOrder = function (item, quantity) {
          Kitchen.addOrder(item, quantity)                          Kitchen.addOrder(item, quantity)
          return true                                               return true
      end                                                       };

A function that does not return anything in KobraScript is called a procedure, written as `proc`. All other subroutines are functions, `fn`, and may optionally have a return statement. Subroutines are first-class in KobraScript. Also note that the return statement always expects an expression -- return `null` if you have no value to return.

    proc print_intake (y):                                  function printIntake (y) {
        say average_intake(y)                                   console.log(averageIntake(y))
    end                                                     }

Similar to Javascript, anonymous self-calling functions are in KobraScript, written as `anon`.

    anon ():                                                (function() {
      $ x = 10                                                  var x = 10;
      say x                                                     console.log(x);
    end                                                     }())

#### Blocks
Blocks in KobraScript are beautiful. Start a multiline block with `:` and terminate it with the clear `end`, or the elegantly-flowing `..`  
Fearlessly create a single-statement block by pointing `->` to it. Nice.

    while (i--):                                            while (i--) {
        say "Countdown ... " + i                                console.log("Countdown ... " + i)
    end                                                     }

    fn numResponse (x):                                     function numResponse (x) {
        if (x == 1) -> say "that's one!"                        if (x === 1) console.log("that's one!");
        else if (x == 2) -> say "that's two!"                   else if (x === 2) console.log("that's two!");
        else -> say "that's somthin' else!"                     else console.log("that's somthin' else!");
    ..                                                      }

    proc on (socket) -> this.active[socket] = true          function on (socket) this.active[socket] = true;

#### Conditional Statement
In KobraScript the `if` statement is written with a preference to `..` between conditional blocks. An `end` after the final block signals the conclusion of the statement. Kobra is cold as ice.

    if (is_red && is_food):                                 if (is_red && is_food) {
        eat()                                                   eat ();
    .. else if (is_food && is_mine):                        } else if (is_food && is_mine) {
        add_butter()                                            add_butter ();
    .. else:                                                } else {
        keep()                                                  keep();
    end                                                     }

#### Only If Statement
Bite first, ask for booleans later. Kobrascript allows a lightning-quick, conditional alternative to the garden-variety `if` statement.

    only:                                                   if (feelingLucky) {
      rollDice() .. if (feelingLucky)                           rollDice()
                                                            }
    only -> abandonShip() if (sinking)                      if (sinking) {
    else -> justKeepSwiming()                                 abandonShip()
                                                            } else {
                                                              justKeepSwimming()
                                                            }


#### Exchange Statement
KobraScript utilizes a Go/Python-inspired statement in order to exchange `:=:` the values of two variables.
    
    $ a = 2,                                                var a = 2,
      b = 3                                                     b = 3;
    a :=: b                                                 var swap = a; a = b; b = swap; // Awful.
    say a   >> 3                                            console.log(a);  // 3
    say b   >> 2                                            console.log(b);  // 2

#### `for` and `while` loops
For and while loops look beautiful as expected; keyword, condition, block, nice.

    $ a = 0 >> A test variable for loops.                   var a = 0; // A test variable for loops.

    for ($ i = 0; i < 4; i++):                              for (var i = 0; i < 4; i++) {
        a++                                                     a++;
    end                                                     }

    while (a < 10):                                         while (a < 10) {
        a++                                                     a++;
    end                                                     }

#### Objects
Objects are easily specified and finely readable in KobraScript. Braces are used specifically for objects in this language, `{}` is an object (the one with no properties).

    $ bicycle = {                                           var bicycle = {
        frame: "aluminum",                                          frame: "aluminum",
        year: 2009,                                                 year: 2009,
        gears: 10,                                                  gears: 10,
        speed: 12.7,                                                speed: 12.7,
        move: proc ():                                              move: function () {
            Transform.translate(FORWARD * this.speed)                   Transform.translate(FORWARD * this.speed)
        ..,                                                         },
        upgrade_speed: fn ():                                       upgradeSpeed: function () {
            return this.speed = this.speed * 1.1                        return this.speed = this.speed * 1.1
        ..,                                                         },
        get_frame: fn (): return this.frame end                     getFrame: function () {return this.frame}
    }                                                       }

#### Blueprints [Not fully functional]
Blueprints are special structures in KobraScript. They allow for a robust way to define object properties and methods, and expedite the process of creating a complex object. Blueprints use a different file extension, `.ksb`, due to the fact that blueprints are individual files.

To utilize a blueprint in KobraScript, you "construct" the blueprint in a variable declaration, as you would an object in other languages. Parameters to construction can be specified specificly or dynamically.
- Specific: `construct Person (hairColor="black")`
- Dynamic:  `construct Person()` or `construct Person("Joe")`


    $ p1 = construct Person("Joe", 18)         var p1 = new Person("Joe", 18)
    $ p2 = construct Person(age=18)            var p2 = new Person(undefined, 18)

A Blueprint consists of 3 parts:

1. `has`
       * Specify Blueprint properties.
       * The `#` operator can be used to specify a default value.
            `haircolor = hairColor # "black"`
       * These properties are private
2. `does`
       * Specify Blueprint methods (functions).
       * Methods can be defined from parameters
            `do_exercise = exercise # running()`
3. `syn` `:` `<branch_name>`
       * Allows for flexible and organized creation of branches from the main object
       * Access these properties as `Object.<branch_name>.<property>` e.g. `Person.get.name`
       * Synthesized branches cannot be nested, but you may have as many as you like. `set` and `get` are common branches to include.

Here is an example of a blueprint of a Person.  

    $ blueprint Person (name, age, hairColor, exercise)

    @has
        name: name,
        age: age,
        hairColor: hairColor # "black"

    @does
        do_exercise: exercise # running,
        running: proc ():
            say("26.2 miles")
        end

    @syn:get
        name = fn (): return name..,
        age = fn (): return age ..,
        hairColor = fn (): return hairColor ..

    @syn:set
        newHairColor = proc (color): hairColor = color ..

    defcc

#### Arrays
Arrays in KobraScript follow normal scripting language convention.

    $ protein_intake = [12, 21.3, 7.2, 20]                  var protein_intake = [12.0, 21.3, 7.2, 20.0];
    $ enigma = [{code: '8878'}, [], false]                  var enigma = [{code: '8878'}, [], false];

### Macrosyntax
    **/
    * This is regarded as the the most up to date specification of KS
    * KobraScript Syntax v.1.8
    * 
    */

    ### Macrosyntax

        UNIT    ::=  PROGRAM
                |    BLUPRNT

        PROGRAM ::=  STMT+  (as BLOCK)

        BLOCK   ::=  FREEBLK
                |    SINGLE
        FREEBLK ::=  ':'  STMT+  ('end' | '..')
        SINGLE  ::=  '->'  STMT

        STMT    ::=  VARDEC
                |    FNDEC
                |    'if'  '('  EXP  ')'  BLOCK
                     ('else'  'if'  '('  EXP  ')'  BLOCK)*
                     ('else'  '('  EXP  ')'  BLOCK)?
                |    'only'  BLOCK  'if'  '('  EXP  ')'
                     ('else'  BLOCK)?
                |    'for'  '('  (VARDEC | ASSIGN (','))?  ';'  EXP  ';'  INCREMENT  ')'  OPENBLK  'end'
                |    'while'  '('  EXP  ')'  BLOCK
                |    'return'  EXP
                |    EXP

        VARDEC  ::=  '$'  ID  '='  EXP  (','  ID  '='  EXP)*
        FNDEC   ::=  FNTYPE  ID  PARAMS  BLOCK
        FNTYPE  ::=  'proc' | 'fn'
        PARAMS  ::=  '('  ID  (','  ID)*  ')'

        EXP     ::=  EXP0 (('=' | '+=' | '-=' | '*=' | '/=' | '%=' | ':=:') EXP0)?
        EXP0    ::=  EXP1 (('||' | '#') EXP1)*
        EXP1    ::=  EXP2 ('&&' EXP2)*
        EXP2    ::=  EXP3 ('==' | '~=' | '!='  EXP3)?
        EXP3    ::=  EXP4 (('<' | '<=' | '>=' | '>'  EXP4)?
        EXP4    ::=  EXP5 ([+-] EXP5)*
        EXP5    ::=  EXP6 ([%*/] EXP6)*
        EXP6    ::=  EXP7 (('**' | '-**')  EXP7)
        EXP7    ::=  ('~!' | '~?')?  EXP8
        EXP8    ::=  ('!' | '++' | '--')?  EXP9
        EXP9    ::=  EXPRT ('++' | '--' | '.' ID | '[' EXP ']' | '(' EXP (',' EXP)* ')')*
        EXPRT   ::=  UNDEFLIT | NULLLIT | BOOLIT | STRLIT | NUMLIT | ID | CONST | FNVAL | ARRAY | OBJECT | '(' EXP ')'

        CONST   ::=  'construct'  ID  '('  ((ID  '='  EXP  ',')*  ID  '='  EXP | (ID  ',')*  ID)?  ')'
        FNVAL   ::=  FNTYPE  PARAMS  BLOCK

        ARRAYLIT::=  '['  (EXP  (','  EXP)*)?  ']'
        OBJLIT  ::=  '{'  (PROP  (','  PROP)*)?  '}'
        PROP    ::=  ID  ':'  EXP

        BLUPRNT ::=  'blueprint'  ID  PARAMS  BLUBLK  'defcc'
        BLUBLK  ::=  ':'  HASBLK  DOESBLK  SYNCHILD*
        HASBLK  ::=  '@'  'has'  (PROP  (','  PROP)*)?
        DOESBLK ::=  '@'  'does'  (PROP  (','  PROP)*)?
        SYNCHLD ::=  '@'  'syn'  ':'  ID  (PROP  (','  PROP)*)?

### Microsyntax

        NUMLIT  ::=  -?(?:[1-9]\d*|0)(?:.\d+)?(?:[eE][+-]?\d+)?
        STRLIT  ::=  (\"|\')(\\[bfnrtv0\"\']|\\c[a-zA-z]|\\u[a-fA-F0-9]{4}|\\x[a-fA-F0-9]{2}|.)*\1
        BOOLIT  ::=  'true' | 'false'
        UNDEFLIT::=  'undefined'
        NULLLIT ::=  'null'
        ID      ::=  [_a-zA-Z]\w*
        COMMENT ::=  '>>'  TEXT  '\n'
                |    '>|'  TEXT  '|<'
