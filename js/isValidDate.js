"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDate = void 0;
function isValidDate(d) {
  return d instanceof Date && !isNaN(d.getTime());
}
exports.isValidDate = isValidDate;
exports.default = isValidDate;
