// end a session and creates a new session
const cron = require("node-cron");
const Term = require("../models/term.model");
const Session = require("../models/session.model");

cron.schedule("* * * * *", async () => {
    console.log("💥 Running end session cron job.....")
    try {
        const date = new Date();
        const currentYear = date.getFullYear();
        const endedSessions = await Session.find({
            endYear: {$lt : currentYear + 1}
        });
        // ending all active sessions
        for (const session of endedSessions) {
            const {sessionName, schoolName, schoolId} = session;
            // check if current term is the last term, if not, skip ending the session
            const currentTerm = await Term.findOne({
                _id: {$in: session.terms},
                isActive: true,
            });
            if (currentTerm && currentTerm.name !== "THIRD") {
                console.log(`--- Skipping ending ${sessionName} for ${schoolName} as current term is not the last term ---\n`);
                continue;
            }
            if (!currentTerm?.endDate) continue;
            if (currentTerm.endDate > date) {
                console.log(`--- Skipping ending ${sessionName} for ${schoolName} as current term is not yet ended ---\n`);
                continue;
            }
            
            session.isActive = false;
            await session.save();
            console.log(`--- Closing ${sessionName} for ${schoolName}---\n`);
            // create a new session
            const startYear = currentYear;
            const endYear = startYear + 1;
            await createNewSession(startYear, endYear, schoolId, schoolName);
        }
    } catch (error) {
        console.log("❌ Error occured in end session cron job", error)
    }
});

async function createNewSession (startYear, endYear, schoolId, schoolName) {
    try{
        if (!startYear || !endYear || !schoolId || !schoolName) {
            throw new Error ("All fields are required to create a new session");
        }
        let sessionName = `${startYear}/${endYear}`;
        const sessionExists = await Session.exists({
            schoolId,
            schoolName,
            startYear: startYear
        });
        if (sessionExists) return;
        const newSession = new Session({
            startYear,
            endYear,
            schoolId,
            schoolName,
            sessionName,
            isActive: true,
        });
        
        // create a new term first
        const firstTerm = new Term({
            session: newSession._id,
            name: "FIRST",
            isActive: false
        });
        newSession.terms.push(firstTerm._id);
        await newSession.save();
        await firstTerm.save();
        
        console.log(`${sessionName} Session created for ${schoolName} with First Term`);
    } catch (error) {
        throw new Error(error);
    }
}