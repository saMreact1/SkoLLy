const Session = require("../models/session.model");
const School = require("../models/school.model");
const Term = require("../models/term.model");
const moment = require("moment");
const { isValidObjectId } = require("mongoose");
const { checkSpecificDateFormat } = require("../utils/dateFormatChecker");


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

exports.createTerm = async (req, res) => {
  try {
    let { name, startDate, endDate, sessionId } = req.body;
    const terms = ["FIRST", "SECOND", "THIRD"];
    name = name.trim();
    startDate = startDate.trim();
    endDate = endDate.trim();
    sessionId = sessionId.trim();
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
      "An error occured in the get current term controller: ",
      error
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateTermBySession = async (req, res) => {
  try {
    const {sessionId} = req.params;
    const { startDate, endDate, termId } = req.body;

    // startDate = startDate.trim();
    // endDate = endDate.trim()
    // sessionId = sessionId.trim();

    if(!isValidObjectId(sessionId)) return res.status(400).json({ message: "Invalid session Id" });
    if(!isValidObjectId(termId)) return res.status(400).json({ message: "Invalid term Id" });
    if (!termId) return res.status(400).json({ message: "Term Id is required"});
    if (!checkSpecificDateFormat(startDate))
      return res.status(400).json({ message: "Invalid start date format" });
    if (!checkSpecificDateFormat(endDate))
      return res.status(400).json({ message: "Invalid end date format" });

    const session = await Session.findOne({
      _id: sessionId
    });
    if(!session) return res.status(404).json({ message: "No session found with this ID: " + sessionId });
    if (session.isActive === false) return res.status(401).json({ message: "Session is closed, You can't add update the term at the moment" });
    
    const term = await Term.findById(termId);
    if (!term) return res.status(404).json({ message: "No term found with this ID: " + termId });

    if (startDate) term.startDate = new Date(`${startDate}T00:00:00Z`);
    if (endDate) term.endDate = new Date(`${endDate}T23:59:59Z`);

    await term.save();
    res.status(200).json({ message: "Term updated successfully!", term});
  } catch (error) {
    console.log(
      "An error occured in the update term controller: ",
      error
    );
    return res.status(500).json({ message: "Internal Server Error" });
  }
}