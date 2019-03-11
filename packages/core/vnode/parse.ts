import { parseTag } from './parse-tag';
import { Vnode } from './vnode';

export type ParseOptions = {
  components: string[];
  directives: string[];
};

/**
 * vnode main method, parse a template HTML string to Vnode[]
 *
 * html tag regex: (<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>)
 * html comment tag regex: ((?:[^>]\s|^)<!--(?!<!)[^\[>][\s\S]*?-->)
 *
 * @export
 * @param {string} template
 * @param {ParseOptions} [options={ components: [], directives: [] }]
 * @returns {Vnode[]}
 */
export function parseTemplateToVnode(template: string, options: ParseOptions = { components: [], directives: [] }): Vnode[] {

  const tagRegex = /(<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>)|((?:[^>]\s|^)<!--(?!<!)[^\[>][\s\S]*?-->)/g;

  const result: Vnode[] = [];
  let current: Vnode = null;
  let level = -1;
  const arr: Vnode[] = [];
  const byTag = {};
  let inComponent = false;

  // todo 不知道为什么？
  // template.replace(tagRegex, (tag: string, index: number): string => {
  template.replace(tagRegex, (tag: string, tag2: number, unknow: any, index: number): string => {
    if (inComponent) {
      if (tag !== `</${current.tagName}>`) return;
      else inComponent = false;
    }

    const isOpen = tag.charAt(1) !== '/';
    const start = index + tag.length;
    const nextChar = template.charAt(start);
    let parent = null;

    // todo 增加注释类型
    if (/((?:[^>]\s|^)<!--(?!<!)[^\[>][\s\S]*?-->)/.test(tag)) {
      const aa = {
        type: 'comment',
        nodeValue: tag.replace(/^\s*<!--/, '').replace(/-->\s*$/, ''),
        parentVnode: current,
        template: tag,
        voidElement: true,
      };
      console.log(4444444, aa, start, tag);
      return;
    }

    if (isOpen) {
      level++;

      current = parseTag(tag, options.directives);
      if (current.type === 'tag' && options.components.indexOf(current.tagName) !== -1) {
        current.type = 'component';
        inComponent = true;
      }

      if (!current.voidElement && !inComponent && nextChar && nextChar !== '<' && !/^\s*$/.test(template.slice(start, template.indexOf('<', start)))) {
        current.childNodes.push({
          type: 'text',
          nodeValue: template.slice(start, template.indexOf('<', start)),
          parentVnode: current,
          template: template.slice(start, template.indexOf('<', start)),
          voidElement: true,
        });
      }

      (byTag as any)[(current as any).tagName] = current;

      // if we're at root, push new base node
      if (level === 0) result.push(current);

      parent = arr[level - 1];

      if (parent && parent.tagName !== 'router-render') {
        current.parentVnode = parent;
        parent.childNodes.push(current);
      }

      arr[level] = current;
    }

    if (!isOpen || current.voidElement) {
      level--;
      if (!inComponent && nextChar !== '<' && nextChar) {
        // trailing text node
        // if we're at the root, push a base text node. otherwise add as
        // a child to the current node.
        // parent = level === -1 ? result : arr[level].childNodes;
        parent = level === -1 ? null : arr[level];

        // calculate correct end of the content slice in case there's
        // no tag after the text node.
        const end = template.indexOf('<', start);
        const nodeValue = template.slice(start, end === -1 ? undefined : end);
        // if a node is nothing but whitespace, no need to add it.
        if (!/^\s*$/.test(nodeValue) && !parent) result.push({
          type: 'text',
          nodeValue: nodeValue,
          parentVnode: parent,
          template: nodeValue,
          voidElement: true,
        });
        if (!/^\s*$/.test(nodeValue) && parent && parent.tagName !== 'router-render') arr[level].childNodes.push({
          type: 'text',
          nodeValue: nodeValue,
          parentVnode: parent,
          template: nodeValue,
          voidElement: true,
        });
      }
    }
    return null;
  });
  console.log(9999999, result);
  return result;
}
