module.exports={
  "valid": true,
  "raw": {
    "program": "program_1+",
    "block": "'\\{' program_1* '\\}'",
    "program_1": "expression ';'?",
    "expression": "tryblock | forloop | ifblock | whileblock | whenblock | function_builder | eval | ternary | call | deop | arithmatic | unaryarithmatic | assignment | crementor | is | paranexp | constant | var",
    "exporblock": "block | expression",
    "constant": "numberconstant | stringconstant | tableconstant",
    "numberconstant": "'-?(0(x[0-9A-Fa-f]+|b[01]+)|\\d*\\.\\d+(e\\d+)?|\\d+(e\\d+)?)'",
    "stringconstant": " '\"([^\\\\\"]|\\\\(.|[^a]))*\"' | \"'([^\\\\']|\\\\(.|[^a]))*'\" | '\\[(=*)\\[(?:.|[^a])*?\\]\\1\\]' | templatestring",
    "templatestring": "@0 templatestring_start templatestring_chunk? templatestring_chunks* templatestring_end ",
    "templatestring_start": " '`' ",
    "templatestring_end": " '`' ",
    "templatestring_chunk": " '([^`[\\\\]|\\\\(.|[^a]))*' ",
    "templatestring_literal": "@1 '\\[' expression '\\]' ",
    "templatestring_chunks": "templatestring_literal templatestring_chunk?",
    "tableconstant": "'\\{' tablefill* '\\}'",
    "tablefill": "var '=' expression ','? | constant '=' expression ','? | expression ','?",
    "paranexp": " '\\(' expression '\\)' ",
    "assignment": "expression: operator? '=' expression",
    "crementor": "expression: '\\+\\+' | '\\+\\+' expression | expression: '--' | '--' expression",
    "call": "expression: '\\(' call_1* '\\)' | expression: stringconstant | expression: splat_call | expression: deop",
    "call_1": "splat_call ','? | expression ','?",
    "splat_call": "'\\.\\.\\.' expression",
    "var": "expression: index | local? '[a-zA-Z_]\\w*'",
    "local": "'local' | 'var'",
    "index": "'\\[' expression '\\]' | '\\.' '[a-zA-Z_]\\w*' | '::' '[a-zA-Z_]\\w*'",
    "function_builder": "function var? arg_list exporblock | function var exporblock | arg_list '=>' exporblock | var '=>' exporblock",
    "function": "'func' 'tion'?",
    "arg_list": "'\\(' arg_fill* splat_arg? '\\)'",
    "splat_arg": "'\\.\\.\\.' var",
    "arg_fill": "assignment ','? | var ','?",
    "eval": "'eval' expression",
    "tryblock": "'try' exporblock trycatch?",
    "trycatch": "'catch' catch_name? exporblock",
    "catch_name": "'\\('? var '\\)'?",
    "forloop": "'for' var? 'in' expression exporblock | 'for' '\\('? program_1{,3} '\\)'? exporblock",
    "ifblock": "'if' expression exporblock elif?",
    "elif": "'else' exporblock",
    "whileblock": "'while' expression exporblock",
    "whenblock": "'when' expression exporblock",
    "ternary": "expression: '\\?' expression elset",
    "elset": "':' expression",
    "is": "var 'is' '\\*' | var 'is' expression",
    "deop": "'@' operator | '@' unoperator | '@' expression",
    "arithmatic": "expression: operator expression",
    "unaryarithmatic": "unoperator expression",
    "operator": "add | sub | mult | intdiv | div | pow | mod | and | or | concat | bitor | bitand | bitxor | bitshiftl | bitshiftr | le | lt | ge | gt | eq | ne",
    "add": "'\\+'",
    "sub": "'-'",
    "mult": "'\\*'",
    "div": "'/'",
    "intdiv": "'//'",
    "pow": "'\\^'",
    "mod": "'\\%'",
    "and": "'and' | '&&'",
    "or": "'or' | '\\|\\|'",
    "concat": "'\\.\\.'",
    "bitor": "'\\|'",
    "bitand": "'&'",
    "bitxor": "'~'",
    "bitshiftl": "'<<'",
    "bitshiftr": "'>>'",
    "lt": "'<'",
    "le": "'<='",
    "gt": "'>'",
    "ge": "'>='",
    "eq": "'=='",
    "ne": "'!='",
    "unoperator": "unm | not | len | bitnot",
    "not": "'!'",
    "len": "'#'",
    "bitnot": "'~'",
    "unm": "'-'"
  },
  "compiled": {
    "program": [
      [
        {
          "prefix": false,
          "count": [
            1,
            -1
          ],
          "type": "token",
          "text": "program_1"
        }
      ]
    ],
    "block": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\{"
        },
        {
          "prefix": false,
          "count": [
            0,
            -1
          ],
          "type": "token",
          "text": "program_1"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\}"
        }
      ]
    ],
    "program_1": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": ";"
        }
      ]
    ],
    "expression": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "tryblock"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "forloop"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "ifblock"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "whileblock"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "whenblock"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "function_builder"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "eval"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "ternary"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "call"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "deop"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "arithmatic"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "unaryarithmatic"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "assignment"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "crementor"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "is"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "paranexp"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "constant"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "var"
        }
      ]
    ],
    "exporblock": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "block"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "constant": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "numberconstant"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "stringconstant"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "tableconstant"
        }
      ]
    ],
    "numberconstant": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "-?(0(x[0-9A-Fa-f]+|b[01]+)|\\d*\\.\\d+(e\\d+)?|\\d+(e\\d+)?)"
        }
      ]
    ],
    "stringconstant": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\"([^\\\\\"]|\\\\(.|[^a]))*\""
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "'([^\\\\']|\\\\(.|[^a]))*'"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\[(=*)\\[(?:.|[^a])*?\\]\\1\\]"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "templatestring"
        }
      ]
    ],
    "templatestring": [
      {
        "prefix": false,
        "count": [
          0,
          0
        ],
        "type": "forceWS",
        "text": "false"
      },
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "templatestring_start"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "templatestring_chunk"
        },
        {
          "prefix": false,
          "count": [
            0,
            -1
          ],
          "type": "token",
          "text": "templatestring_chunks"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "templatestring_end"
        }
      ]
    ],
    "templatestring_start": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "`"
        }
      ]
    ],
    "templatestring_end": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "`"
        }
      ]
    ],
    "templatestring_chunk": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "([^`[\\\\]|\\\\(.|[^a]))*"
        }
      ]
    ],
    "templatestring_literal": [
      {
        "prefix": false,
        "count": [
          0,
          0
        ],
        "type": "forceWS",
        "text": "true"
      },
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\["
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\]"
        }
      ]
    ],
    "templatestring_chunks": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "templatestring_literal"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "templatestring_chunk"
        }
      ]
    ],
    "tableconstant": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\{"
        },
        {
          "prefix": false,
          "count": [
            0,
            -1
          ],
          "type": "token",
          "text": "tablefill"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\}"
        }
      ]
    ],
    "tablefill": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "var"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "="
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": ","
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "constant"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "="
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": ","
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": ","
        }
      ]
    ],
    "paranexp": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\("
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\)"
        }
      ]
    ],
    "assignment": [
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "operator"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "="
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "crementor": [
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\+\\+"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\+\\+"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ],
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "--"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "--"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "call": [
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\("
        },
        {
          "prefix": false,
          "count": [
            0,
            -1
          ],
          "type": "token",
          "text": "call_1"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\)"
        }
      ],
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "stringconstant"
        }
      ],
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "splat_call"
        }
      ],
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "deop"
        }
      ]
    ],
    "call_1": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "splat_call"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": ","
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": ","
        }
      ]
    ],
    "splat_call": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\.\\.\\."
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "var": [
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "index"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "local"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "[a-zA-Z_]\\w*"
        }
      ]
    ],
    "local": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "local"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "var"
        }
      ]
    ],
    "index": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\["
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\]"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\."
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "[a-zA-Z_]\\w*"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "::"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "[a-zA-Z_]\\w*"
        }
      ]
    ],
    "function_builder": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "function"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "var"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "arg_list"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "function"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "var"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "arg_list"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "=>"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "var"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "=>"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ]
    ],
    "function": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "func"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": "tion"
        }
      ]
    ],
    "arg_list": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\("
        },
        {
          "prefix": false,
          "count": [
            0,
            -1
          ],
          "type": "token",
          "text": "arg_fill"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "splat_arg"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\)"
        }
      ]
    ],
    "splat_arg": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\.\\.\\."
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "var"
        }
      ]
    ],
    "arg_fill": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "assignment"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": ","
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "var"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": ","
        }
      ]
    ],
    "eval": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "eval"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "tryblock": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "try"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "trycatch"
        }
      ]
    ],
    "trycatch": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "catch"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "catch_name"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ]
    ],
    "catch_name": [
      [
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": "\\("
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "var"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": "\\)"
        }
      ]
    ],
    "forloop": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "for"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "var"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "in"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "for"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": "\\("
        },
        {
          "prefix": false,
          "count": [
            0,
            "3"
          ],
          "type": "token",
          "text": "program_1"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "regex",
          "text": "\\)"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ]
    ],
    "ifblock": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "if"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        },
        {
          "prefix": false,
          "count": [
            0,
            1
          ],
          "type": "token",
          "text": "elif"
        }
      ]
    ],
    "elif": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "else"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ]
    ],
    "whileblock": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "while"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ]
    ],
    "whenblock": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "when"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "exporblock"
        }
      ]
    ],
    "ternary": [
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\?"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "elset"
        }
      ]
    ],
    "elset": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": ":"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "is": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "var"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "is"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\*"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "var"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "is"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "deop": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "@"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "operator"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "@"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "unoperator"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "@"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "arithmatic": [
      [
        {
          "prefix": true,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "operator"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "unaryarithmatic": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "unoperator"
        },
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "expression"
        }
      ]
    ],
    "operator": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "add"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "sub"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "mult"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "intdiv"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "div"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "pow"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "mod"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "and"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "or"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "concat"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "bitor"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "bitand"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "bitxor"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "bitshiftl"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "bitshiftr"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "le"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "lt"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "ge"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "gt"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "eq"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "ne"
        }
      ]
    ],
    "add": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\+"
        }
      ]
    ],
    "sub": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "-"
        }
      ]
    ],
    "mult": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\*"
        }
      ]
    ],
    "div": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "/"
        }
      ]
    ],
    "intdiv": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "//"
        }
      ]
    ],
    "pow": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\^"
        }
      ]
    ],
    "mod": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\%"
        }
      ]
    ],
    "and": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "and"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "&&"
        }
      ]
    ],
    "or": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "or"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\|\\|"
        }
      ]
    ],
    "concat": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\.\\."
        }
      ]
    ],
    "bitor": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "\\|"
        }
      ]
    ],
    "bitand": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "&"
        }
      ]
    ],
    "bitxor": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "~"
        }
      ]
    ],
    "bitshiftl": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "<<"
        }
      ]
    ],
    "bitshiftr": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": ">>"
        }
      ]
    ],
    "lt": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "<"
        }
      ]
    ],
    "le": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "<="
        }
      ]
    ],
    "gt": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": ">"
        }
      ]
    ],
    "ge": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": ">="
        }
      ]
    ],
    "eq": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "=="
        }
      ]
    ],
    "ne": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "!="
        }
      ]
    ],
    "unoperator": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "unm"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "not"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "len"
        }
      ],
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "token",
          "text": "bitnot"
        }
      ]
    ],
    "not": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "!"
        }
      ]
    ],
    "len": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "#"
        }
      ]
    ],
    "bitnot": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "~"
        }
      ]
    ],
    "unm": [
      [
        {
          "prefix": false,
          "count": [
            1,
            1
          ],
          "type": "regex",
          "text": "-"
        }
      ]
    ]
  },
  "prefixes": {
    "expression": {
      "assignment": [
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              0,
              1
            ],
            "type": "token",
            "text": "operator"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "regex",
            "text": "="
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          }
        ]
      ],
      "crementor": [
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "regex",
            "text": "\\+\\+"
          }
        ],
        [
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "regex",
            "text": "\\+\\+"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          }
        ],
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "regex",
            "text": "--"
          }
        ],
        [
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "regex",
            "text": "--"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          }
        ]
      ],
      "call": [
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "regex",
            "text": "\\("
          },
          {
            "prefix": false,
            "count": [
              0,
              -1
            ],
            "type": "token",
            "text": "call_1"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "regex",
            "text": "\\)"
          }
        ],
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "stringconstant"
          }
        ],
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "splat_call"
          }
        ],
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "deop"
          }
        ]
      ],
      "var": [
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "index"
          }
        ],
        [
          {
            "prefix": false,
            "count": [
              0,
              1
            ],
            "type": "token",
            "text": "local"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "regex",
            "text": "[a-zA-Z_]\\w*"
          }
        ]
      ],
      "ternary": [
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "regex",
            "text": "\\?"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "elset"
          }
        ]
      ],
      "arithmatic": [
        [
          {
            "prefix": true,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "operator"
          },
          {
            "prefix": false,
            "count": [
              1,
              1
            ],
            "type": "token",
            "text": "expression"
          }
        ]
      ]
    }
  }
}