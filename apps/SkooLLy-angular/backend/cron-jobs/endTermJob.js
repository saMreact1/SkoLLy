const cron = require("node-cron");
const Term = require("../models/term.model");
const Session = require("../models/session.model");

// run every 2 mins
cron.schedule("* * * * *", async () => {
    console.log("⏰ Running End of Term Job....");
    const todaysDate = new Date();
    try {
        const endedTerms = await Term.find({
            isActive: true,
            endDate: { $lt: todaysDate }
        });
    // looping through all the school sessions with active terms
    for (const term of endedTerms) {
        const currentSession = await Session.findOne({
            terms: term._id,
        });
        console.log(`⏳ Closing ${currentSession.schoolName}'s ${term.name} term for ${currentSession.sessionName} session`);
        term.isActive = false;
        await term.save();

        const session = await Session.findById(term.session);
        if (!session) continue;

        if(term.name === "FIRST") await createNextTerm("SECOND", session._id);
        else if (term.name === "SECOND") await createNextTerm("THIRD", session._id);
        else if (term.name === "THIRD") {
            session.isActive = false;
            await session.save();
            console.log(`🎉 Session ${session.sessionName} for ${session.schoolName} is now closed`);
        }
    }
    } catch (error) {
        console.log("❌ Error occured in end term cron job", error)
    }
});

async function createNextTerm(termName, sessionId) {
    if (!termName || !sessionId) return;

    const currentSession = await Session.findOne({ _id: sessionId, isActive: true });
    if (!currentSession) return;

    // Atomic creation: create term only if it doesn't exist
    const newTerm = await Term.findOneAndUpdate(
        { session: sessionId, name: termName.toUpperCase() }, // filter
        {
            $setOnInsert: { 
                name: termName.toUpperCase(),
                session: sessionId,
                isActive: false
            }
        },
        { upsert: true, new: true }
    );

    // Ensure the term is in session.terms array
    if (!currentSession.terms.includes(newTerm._id)) {
        currentSession.terms.push(newTerm._id);
        await currentSession.save();
    }

    console.log(`✅ Created ${termName} term`);
}
