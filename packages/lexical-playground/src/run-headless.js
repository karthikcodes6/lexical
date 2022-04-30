const {
  createHeadlessEditor,
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  ParagraphNode,
} = require('lexical');

const {
  v2: {createMarkdownImport, createMarkdownExport, TRANSFORMERS},
} = require('@lexical/markdown');
const {HeadingNode} = require('@lexical/rich-text');
const {ListNode, ListItemNode} = require('@lexical/list');
const {LinkNode} = require('@lexical/link');

const importMarkdown = createMarkdownImport(...TRANSFORMERS);
const exportMarkdown = createMarkdownExport(...TRANSFORMERS);

const editor = createHeadlessEditor({
  nodes: [HeadingNode, ListNode, ListItemNode, LinkNode],
  onError: (e) => {
    throw e;
  },
});

const update = async (callback) => {
  return new Promise((resolve) => {
    editor.update(callback, {onUpdate: resolve});
  });
};

const MARKDOWN = `# Lexical from Node.js!
- Have a list
    - And nested too!
Some **styles** and *[links](https://lexical.dev)*!
`;

async function run() {
  editor.registerUpdateListener(() => {
    // eslint-disable-next-line no-console
    console.log('Update listener');
  });

  editor.registerNodeTransform(ParagraphNode, () => {
    // eslint-disable-next-line no-console
    console.log('Node transform');
  });

  await update(() => {
    importMarkdown(MARKDOWN);
  });

  await update(() => {
    $getRoot().append(
      $createParagraphNode().append(
        $createTextNode('It '),
        $createTextNode('works').toggleFormat('bold'),
        $createTextNode('!'),
      ),
    );
  });

  await update(() => {
    // eslint-disable-next-line no-console
    console.log('\n\n' + exportMarkdown());
  });
}

run();
