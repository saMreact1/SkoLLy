const Teacher = require("../models/teacher.model");
const Test = require("../models/test.model");
const Session = require("../models/session.model");
const Term = require("../models/term.model");
const User = require("../models/user.model");
const Class = require("../models/class.model");
const Subject = require("../models/subject.model");
const School = require("../models/school.model");
const Request = require("../models/request.model");
const { isValidObjectId } = require("mongoose");
const path = require("path");
const csv = require("csvtojson");
const fs = require("fs");

exports.createTest = async (req, res) => {
  try {
    const { tenantId, sessionId, id } = req.user;
    const { questions, classId, subjectId } = req.body;

    if (!Array.isArray(questions) || questions.length < 2) {
      return res.status(400).json({ message: "At least 2 questions required" });
    }

    if (!isValidObjectId(classId) || !isValidObjectId(subjectId)) {
      return res.status(400).json({ message: "Invalid class or subject ID" });
    }

    const school = await School.findById(tenantId);
    const session = await Session.findOne({
      _id: sessionId,
      schoolId: tenantId,
      isActive: true,
    });

    if (!school || !session) {
      return res.status(400).json({ message: "Invalid school or session" });
    }

    const term = await Term.findOne({
      _id: { $in: session.terms },
      isActive: true,
    });

    if (!term) {
      return res.status(400).json({ message: "No active term" });
    }

    const classDoc = await Class.findById(classId);
    const subject = await Subject.findById(subjectId);

    if (!classDoc || !subject) {
      return res.status(404).json({ message: "Class or subject not found" });
    }

    const teacher = await Teacher.findOne({
      userId: id,
      tenantId,
      subjectId,
    });

    if (!teacher || !teacher.classes.includes(classId)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to create this test" });
    }

    let createdTest = await Test.findOne({
      sessionId,
      termId: term._id,
      schoolId: tenantId,
    });

    const existingTest = await Test.findOne({
      sessionId,
      termId: term._id,
      schoolId: tenantId,
      allTest: {
        $elemMatch: {
          subjectId,
          classId,
        },
      },
    });

    if (existingTest) {
      return res.status(400).json({
        message: `Test for ${classDoc.name} class and ${subject.name} subject already exist`,
      });
    }

    if (!createdTest) {
      // Create a test
      createdTest = await Test.create({
        schoolId: tenantId,
        schoolName: school.name,
        sessionId,
        sessionName: session.sessionName,
        termName: term.name,
        termId: term._id,
      });
    }

    createdTest.allTest.push({
      subject: subject.name,
      className: classDoc.name,
      teacherName: teacher.fullName,
      subjectCode: subject.code,
      subjectId,
      teacherId: teacher._id,
      classId,
    });

    // sending request to admin for approval
    let existingTestRequest = await Request.findOne({
      sessionId,
      schoolId: tenantId,
      termId: term._id,
    });

    for (const t of createdTest.allTest) {
      if (
        t.subjectId.toString() === subjectId &&
        t.classId.toString() === classId
      ) {
        t.subjectTest.push(...questions);
        if (existingTestRequest) {
          existingTestRequest.testRequest.push(t._id);
        }
        break;
      }
    }

    if (!existingTestRequest) {
      existingTestRequest = await Request.create({
        sessionName: session.sessionName,
        sessionId,
        schoolName: school.name,
        schoolId: tenantId,
        termName: term.name,
        termId: term._id,
        testRequest: [createdTest.allTest[0]._id],
      });
    }

    await createdTest.save();
    await existingTestRequest.save();

    return res
      .status(201)
      .json({ message: "Test Created Successfully", tests: createdTest });
  } catch (error) {
    console.error("Error in the create test controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getTermTestBySubjectAndClass = async (req, res) => {
  try {
    const { t, s, c } = req.query;

    if (!t || !s || !c) {
      return res.status(400).json({
        message: "Term(t), subject(s), and class(c) are required",
      });
    }

    const { tenantId, role, sessionId } = req.user;

    const session = await Session.findOne({
      _id: sessionId,
      schoolId: tenantId,
      isActive: true,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "No active session for your school" });
    }

    const term = await Term.findOne({
      _id: { $in: session.terms },
      name: t.toUpperCase(),
    });

    if (!term) {
      return res.status(404).json({
        message: `No term with the name ${t.toUpperCase()}`,
      });
    }
    const subject = await Subject.findOne({
      nameLower: s.toLowerCase(),
      tenantId,
    });

    const classDoc = await Class.findOne({
      name: c.toUpperCase(),
      schoolId: tenantId,
    });

    if (!subject || !classDoc) {
      return res.status(404).json({ message: "No class or subject found" });
    }

    const testDoc = await Test.findOne({
      schoolId: tenantId,
      sessionId,
      termId: term._id,
    });

    if (!testDoc) {
      return res.status(404).json({
        message: `No ${subject.nameLower} test found for this term (${term.name}) or class (${classDoc.name})`,
      });
    }
    let test = {};
    for (const e of testDoc.allTest) {
      if (e.subject === subject.name && e.className === classDoc.name) {
        if (e.isApproved === false && role !== "admin") {
          return res.status(403).json({
            message: "Test is yet to be approved by admin",
          });
        }
        test = e;
      }
    }

    return res.status(200).json({
      test,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.approveTest = async (req, res) => {
  try {
    const { testId } = req.params;
    if (!isValidObjectId(testId)) {
      return res.status(400).json({ message: "Invalid test id" });
    }
    const { tenantId, sessionId } = req.user;

    const session = await Session.findOne({
      _id: sessionId,
      schoolId: tenantId,
      isActive: true,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "No active session for your school" });
    }

    const term = await Term.findOne({
      _id: { $in: session.terms },
      isActive: true,
    });

    if (!term) {
      return res.status(404).json({
        message: "No active term in this session",
      });
    }
    // checking if test is found in request
    let request = await Request.findOne({
      sessionId,
      termId: term._id,
      schoolId: tenantId,
    });

    if (!request) {
      return res.status(404).json({ message: "No test request found" });
    }

    let foundRequest = false;

    foundRequest = request.testRequest.some((id) => id.toString() === testId);

    if (!foundRequest) {
      return res.status(404).json({
        message: "No test request found with this test id: " + testId,
      });
    }

    const test = await Test.findOne({
      sessionId,
      sessionName: session.sessionName,
      termId: term._id,
      schoolId: tenantId,
      "allTest._id": testId,
    });
    let approvedTest = {};

    for (const e of test.allTest) {
      if (e._id.toString() === testId && e.isApproved === true) {
        return res.status(400).json({
          message: `${e.subject} test is already approved for ${e.className}`,
        });
      }
      if (e._id.toString() === testId) {
        e.isApproved = true;
        approvedTest = e;
      }
    }

    request.testRequest = request.testRequest.filter(
      (id) => id.toString() !== testId
    );

    await request.save();
    await test.save();

    return res.status(200).json({
      message: `Test with Id: ${testId} approved ✅`,
      test: approvedTest,
    });
  } catch (error) {
    console.log("Error approving test request: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTestByClass = async (req, res) => {
  try {
    const { tenantId, sessionId } = req.user;
    let { testClass } = req.params;
    if (!testClass) {
      return res.status(400).json({ message: "Class is required" });
    }
    testClass = testClass.trim().toUpperCase();
    const session = await Session.findOne({
      _id: sessionId,
      schoolId: tenantId,
      isActive: true,
    });
    if (!session) {
      return res
        .status(404)
        .json({ message: "This session is closed for the year" });
    }
    const term = await Term.findOne({
      session: sessionId,
      isActive: true,
    });
    if (!term) {
      return res.status(400).json({ message: "No term is on" });
    }
    const existingClass = await Class.findOne({
      schoolId: tenantId,
      name: testClass,
    });
    if (!existingClass) {
      return res.status(404).json({ message: "Invalid Class name" });
    }
    let tests = await Test.find({
      sessionId,
      schoolId: tenantId,
      termId: term._id,
      "allTest.className": testClass,
    });

    if (tests.length < 1) {
      return res
        .status(404)
        .json({ message: `No test for ${testClass} class.` });
    }
    let classTests = [];
    for (const t of tests) {
      for (const e of t.allTest) {
        if (e.className === testClass && e.isApproved === true) {
          classTests.push(e);
        }
      }
    }
    return res.status(200).json({ testClass, tests: classTests });
  } catch (error) {
    console.log("Error getting test by class: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTestById = async (req, res) => {
  try {
    const { testId } = req.params;
    const { sessionId, role, tenantId } = req.user;
    if (!isValidObjectId(testId)) {
      return res.status(400).json({ message: "Invalid test Id" });
    }
    const session = await Session.findOne({
      _id: sessionId,
      schoolId: tenantId,
      isActive: true,
    });

    if (!session) {
      return res
        .status(404)
        .json({ message: "The session is closed for the year" });
    }

    const term = await Term.findOne({
      _id: { $in: session.terms },
      isActive: true,
    });

    if (!term) {
      return res.status(404).json({
        message: `No active term`,
      });
    }

    let test = {};
    let foundTest = false;

    const tests = await Test.findOne({
      schoolId: tenantId,
      sessionId,
      termId: term._id,
    });

    if (!tests) {
      return res
        .status(404)
        .json({ message: `No test for term (${term.name})` });
    }

    for (const t of tests.allTest) {
      if (t._id.toString() === testId) {
        if (role !== "admin" && t.isApproved === false) {
          return res
            .status(401)
            .json({
              message: `This ${t.subject.toLowerCase()} test is yet to be approved by the admin`,
            });
        }
        foundTest = true;
        test = t;
        break;
      }
    }
    if (!foundTest) {
      return res
        .status(404)
        .json({ message: `No test found with this id: ${testId}` });
    }

    return res.status(200).json({ test });
  } catch (error) {
    console.log("Error getting test by id: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createTestWithCSV = async (req, res) => {
  try {
    const { tenantId, sessionId, id } = req.user;
    const { classId, subjectId } = req.body;

    if (!isValidObjectId(classId) || !isValidObjectId(subjectId)) {
      return res.status(400).json({ message: "Invalid class or subject ID" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const csvFilePath = req.file.path;
    const csvToJson = await csv().fromFile(csvFilePath);
    fs.unlink(csvFilePath, (err) => {
      if (err) console.error("Failed to delete the csv file: ", err);
    });

    const jsonArrayObj = csvToJson.map((row) => ({
      ...row,
      options: safeJsonParse(row.options),
      question_answer: safeJsonParse(row.question_answer),
      question_score: Number(safeJsonParse(row.question_score)),
      number: Number(safeJsonParse(row.number)),
    }));

    const school = await School.findById(tenantId);
    const session = await Session.findOne({
      _id: sessionId,
      schoolId: tenantId,
      isActive: true,
    });

    if (!school || !session) {
      return res.status(400).json({ message: "Invalid school or session" });
    }

    const term = await Term.findOne({
      _id: { $in: session.terms },
      isActive: true,
    });

    if (!term) {
      return res.status(400).json({ message: "No active term" });
    }

    const classDoc = await Class.findById(classId);
    const subject = await Subject.findById(subjectId);

    if (!classDoc || !subject) {
      return res.status(404).json({ message: "Class or subject not found" });
    }

    const teacher = await Teacher.findOne({
      userId: id,
      tenantId,
      subjectId,
    });

    if (!teacher || !teacher.classes.includes(classId)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to create this test" });
    }

    let createdTest = await Test.findOne({
      sessionId,
      termId: term._id,
      schoolId: tenantId,
    });

    const existingTest = await Test.findOne({
      sessionId,
      termId: term._id,
      schoolId: tenantId,
      allTest: {
        $elemMatch: {
          subjectId,
          classId,
        },
      },
    });

    if (existingTest) {
      return res.status(400).json({
        message: `Test for ${classDoc.name} class and ${subject.name} subject already exist`,
      });
    }

    if (!createdTest) {
      // Create a test
      createdTest = await Test.create({
        schoolId: tenantId,
        schoolName: school.name,
        sessionId,
        sessionName: session.sessionName,
        termName: term.name,
        termId: term._id,
      });
    }

    createdTest.allTest.push({
      subject: subject.name,
      className: classDoc.name,
      teacherName: teacher.fullName,
      subjectCode: subject.code,
      subjectId,
      teacherId: teacher._id,
      classId,
    });

    // sending request to admin for approval
    let existingTestRequest = await Request.findOne({
      sessionId,
      schoolId: tenantId,
      termId: term._id,
    });

    for (const t of createdTest.allTest) {
      if (
        t.subjectId.toString() === subjectId &&
        t.classId.toString() === classId
      ) {
        t.subjectTest.push(...jsonArrayObj);
        if (existingTestRequest) {
          existingTestRequest.testRequest.push(t._id);
        }
        break;
      }
    }

    if (!existingTestRequest) {
      existingTestRequest = await Request.create({
        sessionName: session.sessionName,
        sessionId,
        schoolName: school.name,
        schoolId: tenantId,
        termName: term.name,
        termId: term._id,
        testRequest: [createdTest.allTest[0]._id],
      });
    }

    await createdTest.save();
    await existingTestRequest.save();

    return res
      .status(201)
      .json({ message: "Test Created Successfully", tests: createdTest });
  } catch (error) {
    console.error("Error during conversion: ", error);
    res.status(500).json({ message: "Error processing CSV file." });
  }
};

const safeJsonParse = (value, fallback = []) => {
  if (!value || typeof value !== "string") return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};
