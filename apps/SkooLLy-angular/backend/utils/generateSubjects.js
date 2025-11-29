const Subject = require('../models/subject.model');
const defaultSubjects = require('../config/defaultSubjects');

function flattenSecondary(def) {
  if (!def) return [];
  if (Array.isArray(def)) return def; // already flat
  const { core = [], electives = [] } = def;
  return [...core, ...electives];
}

async function generateDefaultSubjects(schoolType, tenantId, session) {
  let subjectsList = [];

  // Ensure schoolType is always an array
  const schoolTypesArray = Array.isArray(schoolType) ? schoolType : [schoolType];

  for (const type of schoolTypesArray) {
    if (type === 'senior_secondary') {
      subjectsList.push(...flattenSecondary(defaultSubjects[type]));
    } else {
      subjectsList.push(...(defaultSubjects[type] || []));
    }
  }

  // Remove duplicates based on subject name
  const seen = new Set();
  subjectsList = subjectsList.filter(s => {
    const name = s?.name?.trim().toLowerCase();
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });

  if (!subjectsList.length) return;

  const ops = subjectsList.map(({ name, code }) => {
    const nameLower = name.toLowerCase().trim();
    return {
      updateOne: {
        filter: { tenantId, nameLower },
        update: {
          $setOnInsert: {
            tenantId,
            name,
            nameLower,
            code,          // ✅ save the code too
            compulsory: true
          }
        },
        upsert: true
      }
    };
  });

  await Subject.bulkWrite(ops, { session });
}

module.exports = { generateDefaultSubjects };
