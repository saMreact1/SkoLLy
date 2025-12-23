const Session = require("../models/session.model");
const School = require("../models/school.model");
const Term = require("../models/term.model");
const moment = require("moment");
const { isValidObjectId } = require("mongoose");
const { checkSpecificDateFormat } = require("../utils/dateFormatChecker");


exports.getAllSessions = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const sessions = await Session.find({ schoolId: tenantId })
      .sort({ startYear: -1 })
      .populate("terms");

    return res.status(200).json({ sessions });
  } catch (error) {
    console.log("Error getting sessions:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTermsBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!isValidObjectId(sessionId))
      return res.status(400).json({ message: "Invalid session ID" });

    const terms = await Term.find({ session: sessionId }).sort({ createdAt: 1 });

    return res.status(200).json({ terms });
  } catch (error) {
    console.log("Error getting terms:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSessionsWithTerms = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const sessions = await Session.find({ schoolId: tenantId })
      .populate("terms");

    return res.status(200).json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCurrentSessionWithTerms = async (req, res) => {
  try {
    const { tenantId } = req.user;
    
    const currentSession = await Session.findOne({
      schoolId: tenantId,
      isActive: true,
    }).populate('terms');

    if (!currentSession) {
      return res.status(404).json({ 
        message: "No session is on for your school at the moment" 
      });
    }

    return res.status(200).json(currentSession);
  } catch (error) {
    console.log("An error occurred in getCurrentSessionWithTerms: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { sessionId } = req.params;

    if (!isValidObjectId(sessionId)) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const session = await Session.findOne({
      _id: sessionId,
      schoolId: tenantId
    }).populate('terms');

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json(session);
  } catch (error) {
    console.log("An error occurred in getSessionById: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.closeSession = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { sessionId } = req.body;
    if (!isValidObjectId(sessionId))
      return res.status(400).json({ message: "Invalid session id" });
    const school = await School.findById(tenantId, "name email -_id");
    if (!school)
      return res.status(400).json({
        message: "You need to have a school in order to create a term",
      });
    const sessionExists = await Session.findById(sessionId).populate("terms");
    if (!sessionExists)
      return res.status(400).json({ message: "Session ID does not exist" });
    if (sessionExists.schoolId.toString() !== tenantId)
      return res.status(401).json({
        message:
          "Unauthorized - You can't close this session as it is doesn't belong to your school",
      });

    if (sessionExists.isActive === false)
      return res.status(400).json({
        message: `${sessionExists.sessionName} session is already closed`,
        session: sessionExists,
      });
    // deactivate all terms
    await Term.updateMany(
      { _id: { $in: sessionExists.terms } },
      { isActive: false }
    );

    sessionExists.isActive = false;
    await sessionExists.save();

    res.status(200).json({
      message: `${sessionExists.sessionName} session closed successfully 🎉🎉.`,
      session: sessionExists,
    });
  } catch (error) {
    console.log("An error occured in the close session controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const school = await School.findById(tenantId, "name email -_id");
    if (!school)
      return res.status(400).json({
        message: "You need to have a school in order to create a term",
      });
    // if there is a school, then check if there is an active session
    const sessionExists = await Session.findOne({
      schoolId: tenantId,
      schoolName: school.name,
      isActive: true,
    });
    if (sessionExists)
      return res.status(400).json({
        message: `${sessionExists.sessionName} session is on, so you cannot create a new session`,
      });
    // if no session is active
    const currentYear = new Date().getFullYear();
    const startYear = currentYear;
    const endYear = startYear + 1;
    const sessionName = `${startYear}/${endYear}`;
    const schoolName = school.name;
    const schoolId = tenantId;
    const isActive = true;

    // checking for duplicate names
    const duplicateSessionName = await Session.findOne({
      schoolId,
      schoolName,
      sessionName,
    });

    if (duplicateSessionName)
      return res.status(400).json({
        message:
          "You can't create a new session at the moment. You may have to wait till next year 😔",
      });

    const newSession = await Session.create({
      schoolName,
      schoolId,
      sessionName,
      startYear,
      endYear,
      isActive,
    });

    return res.status(201).json({
      message: "New session created",
      session: newSession,
    });
  } catch (error) {
    console.log("An error occured in the create session controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createTerm = async (req, res) => {
  try {
    let { name, startDate, endDate, sessionId } = req.body;
    const terms = ["FIRST", "SECOND", "THIRD"];
    // remove whitespaces
    name = name.trim();
    startDate = startDate.trim();
    endDate = endDate.trim();
    sessionId = sessionId.trim();
    // VALIDATIONS
    if (!name || !startDate || !endDate)
      return res.status(404).json({ message: "All fields are required" });
    if (!terms.includes(name.toString().toUpperCase()))
      return res.status(400).json({
        message: "Invalid term name",
      });

    if (!checkSpecificDateFormat(startDate))
      return res.status(400).json({ message: "Invalid start date format" });
    if (!checkSpecificDateFormat(endDate))
      return res.status(400).json({ message: "Invalid end date format" });
    if (startDate === endDate)
      return res
        .status(400)
        .json({ message: "Start Date and End date cannot be the same" });
    // check if session exists
    if (!isValidObjectId(sessionId))
      return res.status(400).json({ message: "Invalid Session ID" });

    const sessionExists = await Session.findById(
      sessionId,
      "sessionName schoolName startYear endYear terms isActive"
    );
    if (!sessionExists)
      return res.status(404).json({ message: "No session found with this ID" });
    if (sessionExists.isActive === false)
      return res
        .status(401)
        .json({ message: "This session is closed, hence it is over" });

    // if session exists and is active

    // avoiding duplicate terms
    const allTerms = await Session.findById(sessionId).populate("terms");
    // return res.status(200).json({allTerms})
    const termExists = allTerms.terms.filter(
      (term) => term.name === name.toUpperCase()
    );
    if (termExists.length > 0)
      return res
        .status(400)
        .json({ message: `${name.toUpperCase()} Term already exists` });

  
    if (sessionExists.terms.length >= 3)
      return res.status(400).json({
        message: "Error - You cannot create another term after third term",
      });

    // if term doesn't exists, create one
    // turn other terms inactive
    await Term.updateMany(
      { _id: { $in: sessionExists.terms } },
      { isActive: false }
    );

  
    const newTerm = await Term.create({
      name: name.toUpperCase(),
      startDate: new Date(`${startDate}T00:00:00Z`),
      endDate: new Date(`${endDate}T23:59:59Z`),
      session: sessionId,
    });

    // save the term to the current session
    sessionExists.terms.push(newTerm._id);
    await sessionExists.save();
    await allTerms.save();

    return res.status(201).json({
      message: "New Term Created",
      term: newTerm,
      session: sessionExists,
    });
  } catch (error) {
    console.log("An error occured in the create term controller: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCurrentSession = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const currentSession = await Session.findOne({
      schoolId: tenantId,
      isActive: true,
    });
    if (!currentSession)
      return res
        .status(404)
        .json({ message: "No session is on for your school at the moment" });
    return res.status(200).json({
      session: currentSession.sessionName,
      startYear: currentSession.startYear,
      endYear: currentSession.endYear,
    });
  } catch (error) {
    console.log(
      "An error occured in the get current session controller: ",
      error
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getCurrentTerm = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const currentSession = await Session.findOne({ schoolId: tenantId, isActive: true });
    if (!currentSession)
      return res
        .status(404)
        .json({ message: "No session is on for your school at the moment" });
    const currentTerm = await Term.findOne({
      session: currentSession._id,
      isActive: true,
    });
    if (!currentTerm)
      return res
        .status(404)
        .json({ message: "No term is on for your school at the moment" });
    return res.status(200).json({
      term: currentTerm.name,
      startDate: currentTerm.startDate,
      endDate: currentTerm.endDate,
      session: currentSession.sessionName,
    });
  } catch (error) {
    console.log(
      "An error occured in the get current session controller: ",
      error
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
