# Project Notes & Compatibility Fixes

## 1. Backend Compatibility Issue (Node.js 24+)

### Issue

When starting the backend API (`P6JS`) with modern versions of Node.js (specifically Node.js v26.2.0), the application crashed on startup with the following stack trace:

```
TypeError: Cannot read properties of undefined (reading 'prototype')
    at Object.<anonymous> (/home/nicolas/dev/P6JS/node_modules/buffer-equal-constant-time/index.js:37:35)
```

### Cause

The crash was caused by the `buffer-equal-constant-time` library (a dependency of `jwa` -> `jsonwebtoken`). The library attempts to access `SlowBuffer.prototype.equal`. However, `SlowBuffer` was deprecated and has been completely removed in modern Node.js runtimes, making it `undefined` and causing the crash.

### Resolution/Patch

We patched the file `node_modules/buffer-equal-constant-time/index.js` directly to make it compatible with Node.js 24+. The patch guards accesses to `SlowBuffer` and its prototype properties:

```diff
 bufferEq.install = function() {
-  Buffer.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
+  Buffer.prototype.equal = function equal(that) {
     return bufferEq(this, that);
   };
+  if (SlowBuffer) {
+    SlowBuffer.prototype.equal = Buffer.prototype.equal;
+  }
 };

 var origBufEqual = Buffer.prototype.equal;
-var origSlowBufEqual = SlowBuffer.prototype.equal;
+var origSlowBufEqual = SlowBuffer ? SlowBuffer.prototype.equal : undefined;
 bufferEq.restore = function() {
   Buffer.prototype.equal = origBufEqual;
-  SlowBuffer.prototype.equal = origSlowBufEqual;
-};
+  if (SlowBuffer) {
+    SlowBuffer.prototype.equal = origSlowBufEqual;
+  }
+};
```

This safely resolves the startup issue, and the backend server now runs successfully in the background on port `8000`.
