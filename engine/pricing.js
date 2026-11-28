'use strict';
const PipiPricing = Object.freeze({
  base: Object.freeze({ 60: 19.9, 120: 29.9, 180: 49.9 }),
  digitalExtra: 5,
  digitalThreshold: 16,
});
if (typeof module !== 'undefined') module.exports = PipiPricing;
