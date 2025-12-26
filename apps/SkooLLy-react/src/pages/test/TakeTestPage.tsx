import {
  useEffect,
  useState,
  type JSXElementConstructor,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
  type Key,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTestById } from "../../hooks/useStudents";
import { useTestStore } from "../../store/authStore";
import Loader2 from "../../components/shared/Loader2";
import { LoaderIcon } from "react-hot-toast";

type AnswerString = string;
const TakeTestPage = () => {
  const { testId } = useParams();
  console.log(testId);
  const navigate = useNavigate();
  const { data: testData, isLoading: testDataLoading } = useTestById(
    testId as string
  );
  const currentTest = useTestStore((state) => (state.setTest = testData?.test));
  // console.log(currentTest);

  const STORAGE_KEY = `test_state_${testId}`;
  const TEST_DURATION = currentTest?.subjectTest.length * 60; // 20 minutes in seconds
  console.log({ TEST_DURATION });

  const [step, setStep] = useState<"intro" | "test" | "review">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerString>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [showBeginTestBtn, setShowBeginTestBtn] = useState(false);

  /* ---------------- LOAD SAVED STATE ---------------- */
  useEffect(() => {
    const loadSavedState = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      if (parsed.submitted) return navigate("/tests");

      setAnswers(parsed.answers || {});
      setStep(parsed.started ? "test" : "intro");

      const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
      setTimeLeft(TEST_DURATION - elapsed);
    };
    loadSavedState();
  }, [navigate, STORAGE_KEY, TEST_DURATION]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (step !== "test") return;

    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  /* ---------------- NAVIGATION LOCK ---------------- */
  useEffect(() => {
    const block = (e: BeforeUnloadEvent) => {
      if (step === "test") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", block);
    return () => window.removeEventListener("beforeunload", block);
  }, [step]);

  /* ---------------- HELPERS ---------------- */
  const saveState = (extra = {}) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        started: step !== "intro",
        startTime: Date.now(),
        answers,
        submitted: false,
        ...extra,
      })
    );
  };

  const formatTime = (s: number) =>
    s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "";

  /* ---------------- ACTIONS ---------------- */
  const startTest = () => {
    saveState();
    setStep("test");
  };

  const selectOption = (option: string) => {
    const questionKey = String(
      Number(currentTest.subjectTest[current].number) - 1
    );

    setAnswers((prev) => {
      const updated = { ...prev, [questionKey]: option };
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          started: true,
          startTime: Date.now(),
          answers: updated,
          submitted: false,
        })
      );
      return updated;
    });
  };

 useEffect(() => {
   if (step === "intro" && !showBeginTestBtn && TEST_DURATION !== undefined || "") {
    setTimeout(() => {
      setShowBeginTestBtn(true)
    }, 10000)
  }
  
 }, [showBeginTestBtn, TEST_DURATION])

  const handleSubmit = (auto = false) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        submitted: true,
        answers,
      })
    );
    alert(auto ? "Time up! Test submitted." : "Test submitted successfully.");
    navigate("/tests");
  };

  /* ---------------- UI ---------------- */

  if (step === "intro") {
    if (testDataLoading) {
      return (
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="items-center">
            <Loader2 />
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-3xl mx-auto mt-20 bg-slate-200 my-auto p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">
          Test Instructions for {currentTest?.className} {currentTest?.subject}
        </h1>
        <ul className="list-disc ml-5 space-y-2 text-gray-700">
          <li>This test contains {currentTest.subjectTest.length} questions</li>
          <li>You have {TEST_DURATION / 60} minutes to complete the test</li>
          <li>You cannot leave once the test begins</li>
          <li>Auto-submit when time runs out</li>
        </ul>
        {showBeginTestBtn === false && <LoaderIcon className=""/>}
        {showBeginTestBtn && (
          <button
            onClick={startTest}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Begin Test
          </button>
        )}
      </div>
    );
  }

  /* ---------------- TEST UI ---------------- */

  return (
    <div className="grid grid-cols-[1fr_260px] gap-6 p-6">
      {/* LEFT */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">
            Question {currentTest?.subjectTest[current]?.number} of{" "}
            {currentTest?.subjectTest.length}
          </h2>
          <span className="font-mono text-red-600">
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>

        <p className="text-gray-800">
          {currentTest?.subjectTest[current]?.number}:{" "}
          {currentTest?.subjectTest[current]?.question}
        </p>

        <div className="space-y-3">
          {currentTest?.subjectTest[current].options.map(
            (
              opt:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined,
              i: number
            ) => (
              <button
                key={i}
                onClick={() => selectOption(String(opt))}
                className={`w-full text-left px-4 py-3 rounded border ${
                  answers[currentTest?.subjectTest[current]?.number - 1] === opt
                    ? "bg-blue-100 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                {opt}
              </button>
            )
          )}
        </div>

        {/* NAV */}
        <div className="flex justify-between pt-4">
          {current > 0 && (
            <button
              onClick={() => setCurrent((c) => c - 1)}
              className="px-4 py-2 border rounded"
            >
              Back
            </button>
          )}

          {current < currentTest?.subjectTest?.length - 1 &&
            answers[currentTest?.subjectTest[current].number - 1] !==
              undefined && (
              <button
                onClick={() => setCurrent((c) => c + 1)}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
              >
                Next
              </button>
            )}

          {current === currentTest?.subjectTest.length - 1 && (
            <button
              onClick={() => setStep("review")}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded"
            >
              Finish & Review
            </button>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Questions</h3>
        <div className="grid grid-cols-5 gap-2">
          {currentTest?.subjectTest.map(
            (q: { number: Key | null | undefined | number }, i: number) => (
              <button
                key={q.number}
                onClick={() => setCurrent(i)}
                className={`py-2 rounded text-sm ${
                  q.number != null &&
                  answers[`${Number(q.number) - 1}`] !== undefined
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* REVIEW MODAL */}
      {step === "review" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-100 space-y-4">
            <h2 className="font-bold text-lg">Review Answers</h2>

            <ul className="grid grid-cols-5 gap-2">
              {currentTest?.subjectTest.map(
                (q: { number: Key | null | undefined }, i: number) => (
                  <li
                    key={q.number}
                    className={`text-center py-1 rounded ${
                      q.number != null &&
                      answers[String(Number(q.number) - 1)] !== undefined
                        ? "bg-green-500 text-white"
                        : "bg-red-200"
                    }`}
                  >
                    {i + 1}
                  </li>
                )
              )}
            </ul>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep("test")}
                className="px-4 py-2 border rounded"
              >
                Continue Test
              </button>
              <button
                onClick={() => handleSubmit()}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeTestPage;
