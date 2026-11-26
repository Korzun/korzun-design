import { parseOrThrow } from './parse.mjs';

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

/** Defaults in an object pattern, as written in source, keyed by prop name; keys already set win. */
function patternDefaults(target, tsxSource, result) {
  for (const prop of target.properties) {
    if (prop.type !== 'Property' || prop.value.type !== 'AssignmentPattern') continue;
    const key = prop.key.type === 'Identifier' ? prop.key.name : String(prop.key.value);
    if (Object.hasOwn(result, key)) continue;
    const right = unwrapAssertion(prop.value.right);
    const text = tsxSource.slice(right.start, right.end);
    result[key] = right.type === 'Literal' ? text : text.replace(/\s+/g, ' ');
  }
}

/** Names the props object goes by in the body: the parameter itself, or its `...rest`. */
function propsNames(target) {
  if (target?.type === 'Identifier') return [target.name];
  if (target?.type !== 'ObjectPattern') return [];
  return target.properties
    .filter((p) => p.type === 'RestElement' && p.argument.type === 'Identifier')
    .map((p) => p.argument.name);
}

/**
 * Defaults from the first parameter's object pattern, then from top-level
 * `const { … } = props` destructures in the body (a parameter default wins),
 * as written in source: literals, functions (`() => {}`) and any other
 * expression, with type assertions dropped and whitespace collapsed to single
 * spaces.
 * @param {string} tsxSource
 * @param {string} componentName
 * @returns {Record<string, string>}
 */
export function readDefaults(tsxSource, componentName) {
  const { program } = parseOrThrow('component.tsx', tsxSource, 'tsx');
  const fn = findComponent(program, componentName);
  const pattern = fn?.params?.[0];
  const target = pattern?.type === 'AssignmentPattern' ? pattern.left : pattern;
  const result = {};
  if (target?.type === 'ObjectPattern') patternDefaults(target, tsxSource, result);
  const names = propsNames(target);
  const body = fn?.body?.type === 'BlockStatement' ? fn.body.body : [];
  for (const stmt of body) {
    if (stmt.type !== 'VariableDeclaration') continue;
    for (const d of stmt.declarations) {
      const init = d.init && unwrapAssertion(d.init);
      if (d.id.type !== 'ObjectPattern' || init?.type !== 'Identifier') continue;
      if (names.includes(init.name)) patternDefaults(d.id, tsxSource, result);
    }
  }
  return result;
}
