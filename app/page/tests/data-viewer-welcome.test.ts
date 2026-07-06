import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getInitialDataViewerContent,
  WELCOME_CONTENT,
} from '../src/components/ui/conanyu/data-viewer-welcome.ts';

test('uses welcome content when cached content is missing', () => {
  assert.equal(getInitialDataViewerContent(null), WELCOME_CONTENT);
});

test('uses welcome content when cached content is blank', () => {
  assert.equal(getInitialDataViewerContent('  \n\t  '), WELCOME_CONTENT);
});

test('keeps cached content when it has data', () => {
  const cached = '{"cached":true}';
  assert.equal(getInitialDataViewerContent(cached), cached);
});

test('welcome content demonstrates supported interactions', () => {
  const parsed = JSON.parse(WELCOME_CONTENT);

  assert.equal(parsed.title, '欢迎使用 Data Viewer');
  assert.equal(parsed.examples.json_object.type, 'JSON');
  assert.match(parsed.examples.json5_string.value, /unquotedKey/);
  assert.match(parsed.examples.yaml_string.value, /name: Data Viewer/);
  assert.match(parsed.examples.base64_string.value, /^[A-Za-z0-9+/=]+$/);
  assert.match(parsed.examples.http_link.value, /^https:\/\/github\.com\/ConanYu\/data-viewer$/);
});

test('welcome content demonstrates app operations', () => {
  const parsed = JSON.parse(WELCOME_CONTENT);

  assert.match(parsed.features.edit_mode.description, /右上角/);
  assert.match(parsed.features.edit_mode.description, /切换模式/);
  assert.match(parsed.features.edit_mode.description, /修改数据/);

  assert.match(parsed.features.shadcn_install.command, /shadcn@latest add/);
  assert.match(parsed.features.shadcn_install.command, /data-viewer\.json/);
  assert.match(parsed.features.shadcn_install.usage, /<DataViewer/);

  assert.deepEqual(parsed.features.copy_transform.formats, [
    '原始内容',
    '压缩 JSON',
    '转义 JSON',
    'JSON5',
    'YAML',
    'JSON Path',
    'JSON Pointer',
  ]);
});
