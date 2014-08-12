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
