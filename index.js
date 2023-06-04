const inspect = require('util').inspect;

class OOAnalyzer {
  constructor(moduleName) {
    this.module = require(moduleName);
  }

  getClasses() {
    return Object.entries(this.module).filter(([_, value]) => typeof value === 'function');
  }

  dit(cls) {
    let depth = 0;
    while (cls.__proto__ !== null && cls.__proto__ !== Object) {
      depth++;
      cls = cls.__proto__;
    }
    return depth;
  }

  noc(cls) {
    let count = 0;
    const classes = this.getClasses();

    for (const [_, memberCls] of classes) {
      if (memberCls.__proto__ === cls) {
        count++;
      }
    }

    return count;
  }

  _getMethods(cls) {
    const methods = [];

    if (cls.prototype && typeof cls.prototype === 'object') {
      for (const key of Reflect.ownKeys(cls.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(cls.prototype, key);
        if (descriptor && typeof descriptor.value === 'function') {
          methods.push([key, descriptor.value]);
        }
      }
    }

    return methods;
  }

  _getAttributes(cls) {
    const attributes = [];

    if (cls.prototype && typeof cls.prototype === 'object') {
      for (const key of Reflect.ownKeys(cls.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(cls.prototype, key);
        if (descriptor && typeof descriptor.value !== 'function') {
          attributes.push([key, descriptor.value]);
        }
      }
    }

    return attributes;
  }

  _getVisibility(member) {
    return member.toString().startsWith('_') ? 'private' : 'public';
  }

  mif() {
    let inheritedMethodsCount = 0;
    let totalMethodsCount = 0;
    const classes = this.getClasses();

    for (const [_, cls] of classes) {
      const baseMethods = this._getMethods(cls.__proto__);
      const classMethods = this._getMethods(cls);
      totalMethodsCount += classMethods.length;

      for (const [baseMethodName] of baseMethods) {
        for (const [classMethodName] of classMethods) {
          if (baseMethodName === classMethodName) {
            inheritedMethodsCount++;
            break;
          }
        }
      }
    }

    return totalMethodsCount !== 0 ? inheritedMethodsCount / totalMethodsCount : 0;
  }

  mhf() {
    let privateMethodsCount = 0;
    let totalMethodsCount = 0;
    const classes = this.getClasses();

    for (const [_, cls] of classes) {
      const classMethods = this._getMethods(cls);
      totalMethodsCount += classMethods.length;

      for (const [methodName] of classMethods) {
        if (this._getVisibility(methodName) === 'private') {
          privateMethodsCount++;
        }
      }
    }

    return totalMethodsCount !== 0 ? privateMethodsCount / totalMethodsCount : 0;
  }

  ahf() {
    let privateAttributesCount = 0;
    let totalAttributesCount = 0;
    const classes = this.getClasses();

    for (const [_, cls] of classes) {
      const classAttributes = this._getAttributes(cls);
      totalAttributesCount += classAttributes.length;

      for (const [attributeName] of classAttributes) {
        if (this._getVisibility(attributeName) === 'private') {
          privateAttributesCount++;
        }
      }
    }

    return totalAttributesCount !== 0 ? privateAttributesCount / totalAttributesCount : 0;
  }

  aif() {
    let inheritedAttributesCount = 0;
    let totalAttributesCount = 0;
    const classes = this.getClasses();

    for (const [_, cls] of classes) {
      const baseAttributes = this._getAttributes(cls.__proto__);
      const classAttributes = this._getAttributes(cls);
      totalAttributesCount += classAttributes.length;

      for (const [baseAttributeName] of baseAttributes) {
        for (const [classAttributeName] of classAttributes) {
          if (baseAttributeName === classAttributeName) {
            inheritedAttributesCount++;
            break;
          }
        }
      }
    }

    return totalAttributesCount !== 0 ? inheritedAttributesCount / totalAttributesCount : 0;
  }

  pof() {
    let publicOverriddenMethodsCount = 0;
    let totalPublicMethodsCount = 0;
    const classes = this.getClasses();

    for (const [_, cls] of classes) {
      const baseMethods = this._getMethods(cls.__proto__);
      const classMethods = this._getMethods(cls);

      for (const [classMethodName] of classMethods) {
        if (this._getVisibility(classMethodName) === 'public') {
          totalPublicMethodsCount++;
        }
      }

      for (const [baseMethodName] of baseMethods) {
        for (const [classMethodName] of classMethods) {
          if (baseMethodName === classMethodName && this._getVisibility(classMethodName) === 'public') {
            publicOverriddenMethodsCount++;
            break;
          }
        }
      }
    }

    return totalPublicMethodsCount !== 0 ? publicOverriddenMethodsCount / totalPublicMethodsCount : 0;
  }
}

const analyzer = new OOAnalyzer('./module');
const classes = analyzer.getClasses();

for (const [name, cls] of classes) {
  console.log(`Class: ${name}`);
  console.log(`  DIT: ${analyzer.dit(cls)}`);
  console.log(`  NOC: ${analyzer.noc(cls)}`);
}

console.log(`MIF: ${analyzer.mif()}`);
console.log(`MHF: ${analyzer.mhf()}`);
console.log(`AHF: ${analyzer.ahf()}`);
console.log(`AIF: ${analyzer.aif()}`);
console.log(`POF: ${analyzer.pof()}`);
