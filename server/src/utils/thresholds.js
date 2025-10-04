module.exports = {
  do: { comparator: (v) => v < 5, threshold: 5, direction: 'below', unit: 'mg/L' },
  bod: { comparator: (v) => v > 3, threshold: 3, direction: 'above', unit: 'mg/L' },
  nitrate: { comparator: (v) => v > 10, threshold: 10, direction: 'above', unit: 'mg/L' },
  fecal_coliform: { comparator: (v) => v > 2500, threshold: 2500, direction: 'above', unit: 'CFU/100mL' },
  rainfall: { comparator: (v) => v > 60, threshold: 60, direction: 'above', unit: 'mm' },
  flow: { comparator: (v) => v > 800, threshold: 800, direction: 'above', unit: 'm3/s' }
};

