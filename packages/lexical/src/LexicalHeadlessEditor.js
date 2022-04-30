/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {
  EditorThemeClasses,
  ErrorHandler,
  LexicalEditor,
} from './LexicalEditor';
import type {EditorState} from './LexicalEditorState';
import type {LexicalNode} from './LexicalNode';

import {createEditor} from './LexicalEditor';

export function createHeadlessEditor(editorConfig?: {
  disableEvents?: boolean,
  editorState?: EditorState,
  namespace?: string,
  nodes?: $ReadOnlyArray<Class<LexicalNode>>,
  onError: ErrorHandler,
  parentEditor?: LexicalEditor,
  readOnly?: boolean,
  theme?: EditorThemeClasses,
}): LexicalEditor {
  const editor = createEditor(editorConfig);
  editor._headless = true;

  [
    'registerDecoratorListener',
    'registerRootListener',
    'registerMutationListeners',
    'getRootElement',
    'setRootElement',
    'getElementByKey',
    'focus',
    'blur',
  ].forEach((method) => {
    // $FlowFixMe
    editor[method] = () => {
      throw new Error(`${method} is not supported in headless mode`);
    };
  });

  return editor;
}
