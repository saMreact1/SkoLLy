const Class = require('../models/class.model');
const mongoose = require('mongoose')

// const defaultClassMap = {
//   nursery: ['KG1', 'KG2'],
//   primary: ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
//   secondary: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
//   college: ['100 Level', '200 Level', '300 Level', '400 Level']
// };

const generateDefaultClasses = async (schoolTypes, schoolId, session) => {
  const defaultClasses = [];

  if (schoolTypes.includes('nursery')) {
    defaultClasses.push({ name: 'KG 1', schoolId: schoolId });
    defaultClasses.push({ name: 'KG 2', schoolId: schoolId });
    defaultClasses.push({ name: 'Nur 1', schoolId: schoolId });
    defaultClasses.push({ name: 'Nur 2', schoolId: schoolId });
  }
  if (schoolTypes.includes('primary')) {
    defaultClasses.push({ name: 'Pry 1', schoolId: schoolId });
    defaultClasses.push({ name: 'Pry 2', schoolId: schoolId });
    defaultClasses.push({ name: 'Pry 3', schoolId: schoolId });
    defaultClasses.push({ name: 'Pry 4', schoolId: schoolId });
    defaultClasses.push({ name: 'Pry 5', schoolId: schoolId });
    defaultClasses.push({ name: 'Pry 6', schoolId: schoolId });
  }
  if (schoolTypes.includes('secondary')) {
    defaultClasses.push({ name: 'JSS 1', schoolId: schoolId });
    defaultClasses.push({ name: 'JSS 2', schoolId: schoolId });
    defaultClasses.push({ name: 'JSS 3', schoolId: schoolId });
    defaultClasses.push({ name: 'SS 1', schoolId: schoolId });
    defaultClasses.push({ name: 'SS 2', schoolId: schoolId });
    defaultClasses.push({ name: 'SS 3', schoolId: schoolId });
  }
  if (schoolTypes.includes('college')) {
    defaultClasses.push({ name: '100 Level', schoolId: schoolId });
    defaultClasses.push({ name: '200 Level', schoolId: schoolId });
    defaultClasses.push({ name: '300 Level', schoolId: schoolId });
    defaultClasses.push({ name: '400 Level', schoolId: schoolId });
  }

  if (defaultClasses.length) {
    await Class.insertMany(defaultClasses, { session });
  }
};


module.exports = generateDefaultClasses;
