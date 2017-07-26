'use strict';

/**
 *  Sample module with neo coding standards.
 *
 *  @module standard
 */

/** Module name. */
export const name = 'standard';

/** Class example. */
class ClassName {
  /** Constructors should take arguments for constructing a new object with
  a parameter list or with a JSON object (for serialization). */
  constructor(o) {
    if (typeof o != 'object') {
      return;
    }

    if (typeof o == 'string') {
      this.StringValue = o;
    } else {
      Object.assign(this, o);
    }
  }
}

/** Singleton example. */
export var Singleton = null;
