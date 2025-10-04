const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema({
  commonName: String,
  scientificName: String,
  status: { type: String, enum: ['Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered', 'Critically Endangered'] },
  category: { type: String, enum: ['Fish', 'Bird', 'Mammal', 'Reptile', 'Amphibian', 'Plant', 'Invertebrate', 'Other'] }
}, { _id: false });

const biodiversitySchema = new mongoose.Schema({
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true, unique: true },
  species: [speciesSchema]
}, { timestamps: true });

module.exports = mongoose.model('Biodiversity', biodiversitySchema);

