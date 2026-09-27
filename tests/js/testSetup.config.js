// @flow
import '@testing-library/jest-dom';

const SUPPRESSED = [
    'has already been declared as an observer component',
    'reactive render of an observer class component',
];

const originalWarn = console.warn.bind(console);
const originalError = console.error.bind(console);
const shouldSuppress = (args) => SUPPRESSED.some((text) => String(args[0] || '').includes(text));

console.warn = (...args) => {
    if (!shouldSuppress(args)) originalWarn(...args);
};
console.error = (...args) => {
    if (!shouldSuppress(args)) originalError(...args);
};
