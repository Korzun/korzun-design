import { parseSync } from 'oxc-parser';

/** Find the function node declared as `function Name` or `const Name = (...) =>`. */
function findComponent(program, name) {
  for (const stmt of program.body) {
    const decl =
      stmt.type === 'ExportNamedDeclaration' || stmt.type === 'ExportDefaultDeclaration'
        ? stmt.declaration
        : stmt;
    if (!decl) continue;
    if (decl.type === 'FunctionDeclaration' && decl.id?.name === name) return decl;
    if (decl.type === 'VariableDeclaration') {
      for (const d of decl.declarations) {
        if (d.id?.name !== name || !d.init) continue;
        let init = d.init;
        // unwrap forwardRef(...) / memo(...)
        while (init.type === 'CallExpression' && init.arguments[0]) init = init.arguments[0];
        if (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression') {
          return init;
        }
      }
    }
  }
  return null;
}

// `Type.Default as TypeValue` reads as `Type.Default`: the assertion is for TypeScript.
function unwrapAssertion(node) {
  let n = node;
  while (n.type === 'TSAsExpression' || n.type === 'TSSatisfiesExpression') n = n.expression;
  return n;
}

/**
 * Defaults from the first parameter's object pattern, as written in source:
 * literals, functions (`() => {}`) and any other expression, with type
 * assertions dropped and whitespace collapsed to single spaces.
 * @param {string} tsxSource
 * @param {string} componentName
 * @returns {Record<string, string>}
 */
export function readDefaults(tsxSource, componentName) {
  const { program } = parseSync('component.tsx', tsxSource, { lang: 'tsx' });
  const fn = findComponent(program, componentName);
  const pattern = fn?.params?.[0];
  const target = pattern?.type === 'AssignmentPattern' ? pattern.left : pattern;
  const result = {};
  if (target?.type !== 'ObjectPattern') return result;
  for (const prop of target.properties) {
    if (prop.type !== 'Property' || prop.value.type !== 'AssignmentPattern') continue;
    const key = prop.key.type === 'Identifier' ? prop.key.name : String(prop.key.value);
    const right = unwrapAssertion(prop.value.right);
    const text = tsxSource.slice(right.start, right.end);
    result[key] = right.type === 'Literal' ? text : text.replace(/\s+/g, ' ');
  }
  return result;
}
