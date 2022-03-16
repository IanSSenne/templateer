# fb-add-template

a template constructor cli

## usage

usage: `add-template <template-name>`

## template example

```
.template
  <template-name>
    .meta.(json|js)
    <template-files>
```

## .meta file

```ts
interface MetaFile {
  insertAt: string;
  files: string[];
  postCreationActions?: string[];
  prompts: Array<prompts.PromptObject>;
  defaultPlaceholders?: Record<string, any>;
}
```

you can find prompts at https://www.npmjs.com/package/prompts
