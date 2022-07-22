/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.height * this.width;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  element(value) {
    if (this.el) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.index > 1) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const result = { ...this };
    if (result.el) {
      result.el += value;
    } else {
      result.el = value;
    }
    result.index = 1;
    return result;
  },

  id(value) {
    if (this.idValue) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.index > 2) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const result = { ...this };
    if (result.idValue) {
      result.idValue += `#${value}`;
    } else {
      result.idValue = `#${value}`;
    }
    result.index = 2;
    return result;
  },

  class(value) {
    if (this.index > 3) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const result = { ...this };
    if (result.classValue) {
      result.classValue += `.${value}`;
    } else {
      result.classValue = `.${value}`;
    }
    result.index = 3;
    return result;
  },

  attr(value) {
    if (this.index > 4) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const result = { ...this };
    if (result.attrValue) {
      result.attrValue += `[${value}]`;
    } else {
      result.attrValue = `[${value}]`;
    }
    result.index = 4;
    return result;
  },

  pseudoClass(value) {
    if (this.index > 5) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const result = { ...this };
    if (result.pseudoClassValue) {
      result.pseudoClassValue += `:${value}`;
    } else {
      result.pseudoClassValue = `:${value}`;
    }
    result.index = 5;
    return result;
  },

  pseudoElement(value) {
    if (this.pseudoElementValue) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.result > 6) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const result = { ...this };
    if (result.pseudoElementValue) {
      result.pseudoElementValue += `::${value}`;
    } else {
      result.pseudoElementValue = `::${value}`;
    }
    result.index = 6;
    return result;
  },

  combine(selector1, combinator, selector2) {
    const result = { ...this };
    if (result.value) {
      result.value += `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    } else {
      result.value = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    }
    return result;
  },

  stringify() {
    if (this.value) {
      return this.value;
    }
    return (this.el ? this.el : '') + (this.idValue ? this.idValue : '') + (this.classValue ? this.classValue : '') + (this.attrValue ? this.attrValue : '') + (this.pseudoClassValue ? this.pseudoClassValue : '') + (this.pseudoElementValue ? this.pseudoElementValue : '');
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
