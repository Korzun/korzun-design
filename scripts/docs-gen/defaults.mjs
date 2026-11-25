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

function isLiteral(node) {
  switch (node.type) {
    case 'Literal':
      return true;
    case 'UnaryExpression':
      return (node.operator === '-' || node.operator === '+') && node.argument.type === 'Literal';
    case 'ArrayExpression':
      return node.elements.length === 0;
    case 'ObjectExpression':
      return node.properties.length === 0;
    default:
      return false;
  }
}

/**
 * Literal defaults from the first parameter's object pattern, as written in source.
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
    const right = prop.value.right;
    if (isLiteral(right)) result[key] = tsxSource.slice(right.start, right.end);
  }
  return result;
}
