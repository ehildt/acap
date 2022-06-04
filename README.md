# Visual Studio Code Setup

## .vscode/settings

```json
{
  "eslint.enable": true,
  "editor.formatOnSave": true,
  "diffEditor.codeLens": true,
  "editor.formatOnPaste": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.formatOnSaveMode": "modifications",
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "json.format.enable": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": true,
    "source.sortMembers": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "[shellscript]": {
    "editor.defaultFormatter": "foxundermoon.shell-format"
  },
  "[dotenv]": {
    "editor.defaultFormatter": "foxundermoon.shell-format"
  }
}
```

## TypeScript Import Sorter

This is an extension to help you sort your import statement in an easy convenient way.

Create the `import-sorter.json` and adopt the rules as follows:

```json
{
  "importStringConfiguration": {
    "trailingComma": "multiLine",
    "tabSize": 4,
    "quoteMark": "single",
    "maximumNumberOfImportExpressionsPerLine": {
      "count": 80,
      "type": "newLineEachExpressionAfterCountLimitExceptIfOnlyOne"
    }
  },
  "sortConfiguration": {
    "joinImportPaths": true,
    "removeUnusedImports": true,
    "removeUnusedDefaultImports": true,
    "importMembers": {
      "order": "caseInsensitive",
      "direction": "asc"
    },
    "importPaths": {
      "order": "caseInsensitive",
      "direction": "asc"
    },
    "customOrderingRules": {
      "defaultNumberOfEmptyLinesAfterGroup": 0
    }
  },
  "generalConfiguration": {
    "sortOnBeforeSave": true
  }
}
```

For more sorting rules see [documentation](https://marketplace.visualstudio.com/items?itemName=mike-co.import-sorter)!

## Todo Tree

Add these lines of code to .vscode/settings.json

```json
   "todo-tree.filtering.ignoreGitSubmodules": true,
    "todo-tree.filtering.useBuiltInExcludes": "file and search excludes",
    "todo-tree.general.enableFileWatcher": true,
    "todo-tree.general.tags": [
        "DIRTY",
        "BUG",
        "FIX",
        "NOTE",
        "TEST",
        "TODO",
        "REFINE",
        "[ ]",
        "[x]",
        "?",
        "!"
    ],
    "todo-tree.tree.groupedByTag": true,
    "todo-tree.highlights.customHighlight": {
        "BUG": {
            "foreground": "#db3272",
            "gutterIcon": true,
            "icon": "bug",
            "iconColour": "#db3272"
        },
        "DIRTY": {
            "foreground": "#8b63e7",
            "gutterIcon": true,
            "icon": "octoface",
            "iconColour": "#8b63e7"
        },
        "FIX": {
            "foreground": "#f1ad55",
            "gutterIcon": true,
            "icon": "alert",
            "iconColour": "#f1ad55"
        },
        "NOTE": {
            "foreground": "#e971e9",
            "gutterIcon": true,
            "icon": "note",
            "iconColour": "#e971e9"
        },
        "TODO": {
            "foreground": "#e6e343",
            "gutterIcon": true,
            "icon": "gear",
            "iconColour": "#e6e343"
        },
        "REFINE": {
            "foreground": "#E0B0FF",
            "gutterIcon": true,
            "icon": "heart",
            "iconColour": "#E0B0FF"
        },
        "TEST": {
            "foreground": "#6399e9",
            "gutterIcon": true,
            "icon": "beaker",
            "iconColour": "#6399e9"
        },
        "[ ]": {
            "foreground": "#CCCCFF",
            "gutterIcon": true,
            "icon": "square",
            "iconColour": "#CCCCFF",
            "type": "tag-and-subTag",
            "hideFromTree": true
        },
        "[x]": {
            "foreground": "#CCCCFF",
            "gutterIcon": true,
            "icon": "square-fill",
            "iconColour": "#CCCCFF",
            "type": "tag-and-subTag",
            "hideFromTree": true
        },
        "?": {
            "foreground": "#CCCCFF",
            "gutterIcon": true,
            "icon": "question",
            "iconColour": "#CCCCFF",
            "type": "tag-and-subTag",
            "hideFromTree": true
        },
        "!": {
            "foreground": "#CCCCFF",
            "gutterIcon": true,
            "icon": "info",
            "iconColour": "#CCCCFF",
            "type": "tag-and-subTag",
            "hideFromTree": true
        }
    },
    "todo-tree.regex.regex": "([/*]|//|#){1,}\\s($TAGS)\\s\\w+",
    "todo-tree.regex.subTagRegex": "([/*]|//|#){1,2}(\\[\\s\\]|\\[x\\]|\\!|\\?)\\w+",
    "todo-tree.tree.sort": true,
    "todo-tree.regex.enableMultiLine": true,
    "todo-tree.tree.filterCaseSensitive": true,
    "todo-tree.tree.flat": true,
    "todo-tree.tree.labelFormat": "${tag} : ${after}",
    "todo-tree.tree.sortTagsOnlyViewAlphabetically": true,
    "todo-tree.filtering.excludeGlobs": [
        "**/node_modules",
        "dist",
        ".clinic"
    ],
    "todo-tree.tree.scanMode": "workspace",
```

## .env

Recommended vscode extension is `DotEnv` as the linter with `shell-format` as the default formatter.

For command line `dotenv-cli` is recommended.

```json
{
  "example": "values-go-here"
}
```

## .husky

You don't need to do anything special here. Just `npm i` and you should be good to go.  
Otherwise see [wiki](https://typicode.github.io/husky/#/) for troubleshoot.

## git conventions

## dependency-cruiser

The **dependency-cruiser** lints orphan files within the src directory.  
If you want to generate graphs with the **dependency-cruiser** you need to `sudo apt install graphviz`

## ts-unused-exports

The **ts-unused-exports** lints unused exports within the src directory.  
See [wiki](https://github.com/pzavolinsky/ts-unused-exports) for troubleshoot.

## npm-check-updates (ncu)

## clinic

## docker workflow
