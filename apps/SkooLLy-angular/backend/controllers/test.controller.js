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

    let testDoc = await Test.findOne({
      schoolId: tenantId,
      sessionId,
      termId: term._id,
    });

    if (!testDoc) {
      testDoc = await Test.create({
        schoolId: tenantId,
        schoolName: school.name,
        sessionId,
        sessionName: session.sessionName,
        termId: term._id,
        termName: term.name,
        subjects: [],
      });
    }

    if (testDoc.isApproved) {
      return res.status(403).json({ message: "Term is locked for editing" });
    }

    let subjectBlock = testDoc.subjects.find(
      (s) => s.subjectId.toString() === subjectId
    );

    if (!subjectBlock) {
      subjectBlock = {
        teacherId: teacher._id,
        teacherName: teacher.fullName,
        subjectId,
        subjectName: subject.name,
        subjectCode: subject.code,
        classes: [],
      };
      testDoc.subjects.push(subjectBlock);
    }

    const classExists = subjectBlock.classes.find(
      (c) => c.classId.toString() === classId
    );

    if (classExists) {
      return res.status(400).json({
        message: "Test already exists for this subject and class",
      });
    }

    subjectBlock.classes.push({
      classId,
      className: classDoc.name,
      questions,
    });

    // let existingRequest = await Request.findOne({
    //   sessionId,
    //   schoolId: tenantId,
    //   termId: term._id,
    //   test: testDoc._id
    // });

    // if(existingRequest) {
    //   return res.status(401).json({ message: "" })
    // }

    await testDoc.save();

    res.status(201).json({
      message: "Test created successfully",
      test: testDoc,
    });
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
      return res.status(404).json({ message: "No test found for this term" });
    }

    if (role !== "admin" && testDoc.isApproved === false) {
      return res.status(403).json({
        message: "Test is not yet available",
      });
    }

    const subjectBlock = testDoc.subjects.find(
      (sb) => sb.subjectId.toString() === subject._id.toString()
    );

    if (!subjectBlock) {
      return res.status(404).json({
        message: "No test found for this subject in the selected term",
      });
    }

    const classBlock = subjectBlock.classes.find(
      (cb) => cb.classId.toString() === classDoc._id.toString()
    );

    if (!classBlock) {
      return res.status(404).json({
        message: "No test found for this class and subject",
      });
    }

    return res.status(200).json({
      term: term.name,
      subject: subject.name,
      class: classDoc.name,
      isApproved: testDoc.isApproved,
      test: {
        teacherId: subjectBlock.teacherId,
        teacherName: subjectBlock.teacherName,
        subjectCode: subjectBlock.subjectCode,
        questions: classBlock.questions,
      },
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
      return res.status(400).json({message: "Invalid test id"});
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
    const testRequest = await Test.findById(testId);
    if (!testRequest) {
      return res.status(404).json({ message: "No term test found with this ID" });
    }
    if (testRequest.isApproved === true) {
      return res.status(404).json({ message: "Test is already approved" });
    }
    testRequest.isApproved = true;

    await testRequest.save();

    res.status(200).json({
      message: "Test approved for the term",
      request: testRequest,
    });
  } catch (error) {
    console.log("Error approving test request: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


