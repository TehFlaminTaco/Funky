module.exports={
  "valid": true,
  "raw": {
    "program": "program_1+",
    "block": "'\\{' program_1* '\\}'",
    "program_1": "expression ';'?",
    "expression": "forloop | ifblock | whileblock | function_builder | ternary | call | unaryarithmatic | arithmatic | assignment | crementor | paranexp | constant | var",
    "constant": "numberconstant | stringconstant | tableconstant",
    "numberconstant": "'-?(0(b[01]+|x[0-9A-Fa-f]+)|\\d+(\\.\\d+)?)'",
    "stringconstant": " '\"[^\"]*?\"' | \"'[^']*?'\" | '`[^`]*?`' ",
    "tableconstant": "'\\{' tablefill* '\\}'",
    "tablefill": "expression ','?",
    "paranexp": " '\\(' expression '\\)' ",
    "assignment": "var '=' expression",
    "crementor": "var '\\+\\+' | '\\+\\+' var | var '--' | '--' var",
    "call": "expression: '\\(' call_1* '\\)'",
    "call_1": "expression ','?",
    "var": "expression: index | 'local'? '[a-zA-Z_]\\w*'",
    "index": "'\\[' expression '\\]' | '\\.' '[a-zA-Z_]\\w*'",
    "function_builder": "function var? arg_list function_body | function var function_body | arg_list '=>' function_body | var '=>' function_body",
    "function": "'func' 'tion'?",
    "arg_list": "'\\(' arg_fill* '\\)'",
    "function_body": "block | expression",
    "arg_fill": "assignment ','? | var ','?",
    "forloop": "'for' '\\('? program_1{,3} '\\)'? block",
    "ifblock": "'if' expression block elif? | 'if' expression expression elif?",
    "elif": "'else' block | 'else' expression",
    "whileblock": "'while' expression block | 'while' expression expression",
    "ternary": "expression: '\\?' expression elset?",
    "elset": "':' expression",
    "arithmatic": "expression: operator expression",
    "unaryarithmatic": "unoperator expression",
    "operator": "add | sub | mult | div | intdiv | pow | mod | and | or | bitor | bitand | bitxor | le | lt | ge | gt | eq | ne",
    "add": "'\\+'",
    "sub": "'-'",
    "mult": "'\\*'",
    "div": "'/'",
    "intdiv": "'//'",
    "pow": "'\\*\\*'",
    "mod": "'\\%'",
    "and": "'and'",
    "or": "'or'",
    "bitor": "'\\|'",
    "bitand": "'&'",
    "bitxor": "'\\^'",
    "lt": "'<'",
    "le": "'<='",
    "gt": "'>'",
    "ge": "'>='",
    "eq": "'=='",
    "ne": "'!='",
    "unoperator": "not | len | bitnot",
    "not": "'!'",
    "len": "'#'",
    "bitnot": "'~'"
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
          "text": "-?(0(b[01]+|x[0-9A-Fa-f]+)|\\d+(\\.\\d+)?)"
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
          "text": "\"[^\"]*?\""
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
          "text": "'[^']*?'"
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
          "text": "`[^`]*?`"
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
        }
      ]
    ],
    "crementor": [
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
          "text": "var"
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
          "text": "var"
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
          "type": "regex",
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
          "text": "function_body"
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
          "text": "function_body"
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
          "text": "function_body"
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
          "text": "function_body"
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
            1,
            1
          ],
          "type": "regex",
          "text": "\\)"
        }
      ]
    ],
    "function_body": [
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
          "text": "block"
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
          "text": "block"
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
      ],
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
          "text": "expression"
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
          "text": "expression"
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
          "text": "expression"
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
            0,
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
          "text": "\\*\\*"
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
          "text": "\\^"
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
    ]
  }
}