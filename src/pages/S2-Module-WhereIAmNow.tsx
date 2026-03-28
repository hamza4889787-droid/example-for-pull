import { useEffect, useMemo, useState } from "react";
import styles from "../css/WhereAmI.module.css";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

type AssessmentColumn = "right" | "wrong" | "confused" | "missing";
type DomainKey = "personal" | "family" | "church" | "vocation" | "community";

type DomainEntry = {
  title: string;
  examples: string[];
};

type DomainTableEntry = Record<AssessmentColumn, string>;
type TableData = Record<DomainKey, DomainTableEntry>;

type QuestionStep = {
  column: AssessmentColumn;
  label: string;
  prompt: string;
  placeholder: string;
};

const domains: Array<{ key: DomainKey; config: DomainEntry }> = [
  {
    key: "personal",
    config: {
      title: "Personal",
      examples: [
        "I've been consistent with my workouts.",
        "I've been feeling emotionally steady lately.",
        "I'm spending quiet time with God most mornings.",
      ],
    },
  },
  {
    key: "family",
    config: {
      title: "Family & Friends",
      examples: [
        "We are communicating more intentionally this month.",
        "I have felt supported by close friends recently.",
        "Family dinners are helping us reconnect.",
      ],
    },
  },
  {
    key: "church",
    config: {
      title: "Church & Kingdom",
      examples: [
        "I have been more consistent in prayer this season.",
        "Serving at church has brought fresh energy.",
        "Scripture has felt more personal this week.",
      ],
    },
  },
  {
    key: "vocation",
    config: {
      title: "Vocation",
      examples: [
        "I have clarity on my key priorities at work.",
        "I am doing work that aligns with my values.",
        "I have seen tangible progress in my responsibilities.",
      ],
    },
  },
  {
    key: "community",
    config: {
      title: "Community",
      examples: [
        "I am showing up consistently in meaningful relationships.",
        "I have been more present with neighbors and friends.",
        "I feel connected to people beyond my immediate circle.",
      ],
    },
  },
];

const questionFlow: QuestionStep[] = [
  {
    column: "right",
    label: "What is right",
    prompt: "What has been going well for you in this area?",
    placeholder:
      "Write 1-3 sentences about what is going right in this domain...",
  },
  {
    column: "wrong",
    label: "What is wrong",
    prompt: "What feels off, difficult, or draining in this area right now?",
    placeholder: "Write 1-3 sentences about what is not going well...",
  },
  {
    column: "confused",
    label: "What is confused",
    prompt: "Where do you feel unclear, conflicted, or uncertain?",
    placeholder: "Write 1-3 sentences about confusion or mixed signals...",
  },
  {
    column: "missing",
    label: "What is missing",
    prompt: "What do you sense is absent that would make this area healthier?",
    placeholder: "Write 1-3 sentences about what is missing...",
  },
];

const domainLabelMap: Record<DomainKey, string> = {
  personal: "Personal",
  family: "Family & Friends",
  church: "Church & Kingdom",
  vocation: "Vocation",
  community: "Community",
};

const createEmptyTableData = (): TableData => ({
  personal: { right: "", wrong: "", confused: "", missing: "" },
  family: { right: "", wrong: "", confused: "", missing: "" },
  church: { right: "", wrong: "", confused: "", missing: "" },
  vocation: { right: "", wrong: "", confused: "", missing: "" },
  community: { right: "", wrong: "", confused: "", missing: "" },
});

const WhereIAmNow = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<TableData>(createEmptyTableData());

  const [domainIndex, setDomainIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [lastReflection, setLastReflection] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(true);
  const [lastUpdatedCell, setLastUpdatedCell] = useState<{
    domain: DomainKey;
    column: AssessmentColumn;
  } | null>(null);

  const [analysis, setAnalysis] = useState("");

  const currentDomain = domains[domainIndex];
  const currentQuestion = questionFlow[questionIndex];
  const totalQuestions = domains.length * questionFlow.length;

  const answeredCount = useMemo(() => {
    return Object.values(tableData).reduce((total, domainData) => {
      return (
        total +
        Object.values(domainData).filter((value) => value.trim().length > 0)
          .length
      );
    }, 0);
  }, [tableData]);

  const moduleProgress = Math.round((answeredCount / totalQuestions) * 100);

  // Load from localStorage
  useEffect(() => {
    const savedTable = localStorage.getItem("whereIAmNowTable");
    if (savedTable) {
      setTableData(JSON.parse(savedTable));
    }

    const savedAnalysis = localStorage.getItem("whereIAmNowAnalysis");
    if (savedAnalysis) {
      setAnalysis(savedAnalysis);
    }

    const savedFlow = localStorage.getItem("whereIAmNowFlow");
    if (savedFlow) {
      const flow = JSON.parse(savedFlow) as {
        domainIndex: number;
        questionIndex: number;
        isComplete: boolean;
        lastReflection: string;
      };
      setDomainIndex(flow.domainIndex);
      setQuestionIndex(flow.questionIndex);
      setIsComplete(flow.isComplete);
      setLastReflection(flow.lastReflection);
    }
  }, []);

  // Auto-save everything
  useEffect(() => {
    localStorage.setItem("whereIAmNowTable", JSON.stringify(tableData));
    localStorage.setItem("whereIAmNowAnalysis", analysis);
    localStorage.setItem(
      "whereIAmNowFlow",
      JSON.stringify({
        domainIndex,
        questionIndex,
        isComplete,
        lastReflection,
      }),
    );
  }, [
    tableData,
    analysis,
    domainIndex,
    questionIndex,
    isComplete,
    lastReflection,
  ]);

  const isTableComplete = answeredCount === totalQuestions;

  const getReflectionText = (
    response: string,
    domainTitle: string,
    questionLabel: string,
  ) => {
    const condensed = response.trim().replace(/\s+/g, " ");
    const preview =
      condensed.length > 110 ? `${condensed.slice(0, 110)}...` : condensed;
    return `Thank you. For ${domainTitle}, you identified ${questionLabel}: "${preview}"`;
  };

  const moveToNextStep = () => {
    if (questionIndex < questionFlow.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    if (domainIndex < domains.length - 1) {
      setDomainIndex((prev) => prev + 1);
      setQuestionIndex(0);
      return;
    }

    setIsComplete(true);
  };

  const handleSubmitAnswer = () => {
    const cleaned = inputValue.trim();
    if (!cleaned || isComplete) {
      return;
    }

    const activeDomain = domains[domainIndex];
    const activeQuestion = questionFlow[questionIndex];

    setTableData((prev) => ({
      ...prev,
      [activeDomain.key]: {
        ...prev[activeDomain.key],
        [activeQuestion.column]: cleaned,
      },
    }));

    setLastUpdatedCell({
      domain: activeDomain.key,
      column: activeQuestion.column,
    });
    setLastReflection(
      getReflectionText(
        cleaned,
        activeDomain.config.title,
        activeQuestion.label,
      ),
    );
    setInputValue("");
    setIsTableOpen(true);
    moveToNextStep();
  };

  const getNextPrompt = () => {
    if (isComplete) {
      return "You have completed all domains and questions. Review your table and final notes before continuing.";
    }
    return questionFlow[questionIndex].prompt;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("Current State Assessment", 20, y);
    y += 12;

    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, y);
    y += 15;

    Object.entries(tableData).forEach(([key, data]) => {
      doc.setFontSize(13);
      doc.text(domainLabelMap[key as DomainKey], 20, y);
      y += 8;

      doc.setFontSize(11);
      ["right", "wrong", "confused", "missing"].forEach((col) => {
        if (data[col as AssessmentColumn]?.trim()) {
          doc.setFont("helvetica", "bold");
          doc.text(
            `What’s ${col.charAt(0).toUpperCase() + col.slice(1)}?`,
            25,
            y,
          );
          y += 6;

          doc.setFont("helvetica", "normal");
          const lines = doc.splitTextToSize(data[col as AssessmentColumn], 160);
          doc.text(lines, 30, y);
          y += lines.length * 6 + 8;
        }
      });
      y += 5;
    });

    if (analysis.trim()) {
      doc.setFontSize(13);
      doc.text("Analysis / Summary", 20, y);
      y += 10;
      const lines = doc.splitTextToSize(analysis, 170);
      doc.text(lines, 20, y);
    }

    doc.save("CurrentStateAssessment.pdf");
  };

  const handleUnlockPerspective = () => {
    navigate("/perspective");
  // 1. Get the existing progress or create an empty object if it's the first time
  const currentProgress = JSON.parse(localStorage.getItem('lifePlanProgress') || '{}');

  // 2. Set the surrender section to true (unlocked)
  const updatedProgress = { 
    ...currentProgress, 
    whereiam: true 
  };

  // 3. Save the updated object back to localStorage
  localStorage.setItem('lifePlanProgress', JSON.stringify(updatedProgress));
  
  console.log("Surrender section has been unlocked on the dashboard!");
};

  return (
    <div className={styles.container}>
      <div className={styles.bg}></div>

      <nav className={styles.nav}>
        <div className={styles["nav-brand"]}>
          <div className={styles["nav-logo-mark"]}>🏔</div>
          <div className={styles["nav-wordmark"]}>
            Life<em>Plan</em>
          </div>
        </div>
        <div className={styles["nav-center"]}>
          <div className={styles["nav-center-dot"]}></div>
          Faith-Based Life Journey
        </div>
        <div className={styles["nav-right"]}>
          <div className={styles["nav-avatar"]}>H</div>
        </div>
      </nav>

      <div className={styles["stage-bar"]}>
        <span className={styles["sb-label"]}>Stage 1 — Where I Am Now</span>
        <div className={styles["sb-track"]}>
          <div
            className={styles["sb-fill"]}
            style={{ width: `${moduleProgress}%` }}
          ></div>
        </div>
        <span className={styles["sb-count"]}>{moduleProgress}% complete</span>
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <Link
            to="/dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <button className={`${styles["sb-btn"]} ${styles.active}`}>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className={styles["sb-tip"]}>Dashboard</span>
            </button>
          </Link>
          <Link
            to={"/journey-complete"}
            state={{ hideHero: true }}
            className={styles["sb-btn"]}
            style={{ color: "grey" }}
          >
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className={styles["sb-tip"]}>Deliverables</span>
          </Link>

          <div className={styles["sb-spacer"]}></div>

          <button
            onClick={() => {
              navigate("/");
            }}
            className={styles["sb-btn"]}
            style={{ color: "grey" }}
          >
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className={styles["sb-tip"]}>Sign Out</span>
          </button>
        </aside>

        <div className={styles.content}>
          <div className={styles["left-panel"]}>
            <div className={styles["mod-header"]}>
              <div className={styles["mod-eyebrow"]}>
                Stage 1 · Module 2 of 10
              </div>
              <div className={styles["mod-title"]}>
                Current State Assessment
              </div>
              <div className={styles["mod-subtitle"]}>
                Guided worksheet for honest reflection
              </div>
              <div className={styles["mod-desc"]}>
                This module is structured one prompt at a time. Write a short
                response, then move forward through each domain and question.
              </div>
            </div>

            <section className={styles["worksheet-shell"]}>
              <div className={styles["progress-row"]}>
                <div className={styles["progress-chip"]}>
                  Question {questionIndex + 1} of {questionFlow.length}
                </div>
              </div>

              {!isComplete && (
                <>
                  <div className={styles["examples-card"]}>
                    <div className={styles["card-title"]}>
                      Example Statements
                    </div>
                    <ul className={styles["example-list"]}>
                      {currentDomain.config.examples.map((example) => (
                        <li key={example}>{example}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles["question-card"]}>
                    <h2 className={styles["question-title"]}>
                      {currentDomain.config.title}: {currentQuestion.label}?
                    </h2>
                    <p className={styles["question-prompt"]}>
                      {currentQuestion.prompt}
                    </p>
                    <textarea
                      className={styles["reflection-input"]}
                      placeholder={currentQuestion.placeholder}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      rows={4}
                    />
                    <button
                      className={styles["submit-btn"]}
                      onClick={handleSubmitAnswer}
                    >
                      Submit Answer
                    </button>
                  </div>
                </>
              )}

              {lastReflection && (
                <div className={styles["reflection-card"]}>
                  <div className={styles["card-title"]}>Reflection</div>
                  <p>{lastReflection}</p>
                </div>
              )}

              <div className={styles["followup-card"]}>
                <div className={styles["card-title"]}>
                  {isComplete ? "Next Step" : "Follow-up Prompt"}
                </div>
                <p>{getNextPrompt()}</p>
              </div>
            </section>

            <section className={styles["table-panel"]}>
              <button
                className={styles["table-toggle"]}
                onClick={() => setIsTableOpen((prev) => !prev)}
                aria-expanded={isTableOpen}
              >
                {isTableOpen ? "Hide My Progress" : "View My Progress"}
                <span>
                  {answeredCount} of {totalQuestions}
                </span>
              </button>

              {isTableOpen && (
                <div className={styles["live-table"]}>
                  <table className={styles["live-table-table"]}>
                    <thead>
                      <tr>
                        <th>Domain</th>
                        <th>What&apos;s Right?</th>
                        <th>What&apos;s Wrong?</th>
                        <th>What&apos;s Confused?</th>
                        <th>What&apos;s Missing?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {domains.map((domain) => {
                        const values = tableData[domain.key];
                        return (
                          <tr key={domain.key}>
                            <td>
                              <strong>{domain.config.title}</strong>
                            </td>
                            {questionFlow.map((question) => {
                              const isHighlighted =
                                lastUpdatedCell?.domain === domain.key &&
                                lastUpdatedCell.column === question.column;
                              return (
                                <td
                                  key={`${domain.key}-${question.column}`}
                                  className={
                                    isHighlighted ? styles["cell-updated"] : ""
                                  }
                                >
                                  {values[question.column] || "—"}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {isTableComplete && (
              <>
                <div className={styles["analysis-section"]}>
                  <div className={styles["as-title"]}>
                    Final Reflection Notes
                  </div>
                  <textarea
                    className={styles["analysis-textarea"]}
                    value={analysis}
                    onChange={(e) => setAnalysis(e.target.value)}
                    placeholder="Capture any summary insights from your assessment before continuing."
                    rows={6}
                  />
                </div>

                <div className={styles["save-actions"]}>
                  <button
                    onClick={handleUnlockPerspective}
                    className={styles["btn-complete"]}
                  >
                    Continue to Perspective
                  </button>

                  <button className={styles["btn-pdf"]} onClick={generatePDF}>
                    Download PDF Report
                  </button>

                  <button
                    className={styles["btn-ghost"]}
                    onClick={() => navigate("/dashboard")}
                  >
                    Back to Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhereIAmNow;

// import { useState, useEffect } from "react";
// import styles from "../css/WhereAmI.module.css";
// import { Link } from "react-router-dom";
// import jsPDF from "jspdf";
// import { useNavigate } from "react-router-dom";

// const WhereIAmNow = () => {
//   const navigate = useNavigate();
//   const [tableData, setTableData] = useState({
//     personal: { right: "", wrong: "", confused: "", missing: "" },
//     family: { right: "", wrong: "", confused: "", missing: "" },
//     church: { right: "", wrong: "", confused: "", missing: "" },
//     vocation: { right: "", wrong: "", confused: "", missing: "" },
//     community: { right: "", wrong: "", confused: "", missing: "" },
//   });

//   const [analysis, setAnalysis] = useState("");
//   const [message, setMessage] = useState("");

//   const initialMessages = [
//     {
//       role: "ai",
//       text: "Welcome! I'm here to help you complete your Current State Assessment.\n\nWe'll go through each life domain. Answer as openly as you like — the table on the left will update automatically based on what you share.",
//       time: "LifePlan Guide",
//     },
//     {
//       role: "ai",
//       text: "Let's begin with **Personal**. How would you describe your current inner world, health, emotions, sense of purpose, etc.?",
//       time: "LifePlan Guide",
//     },
//   ];

//   const [messages, setMessages] = useState(initialMessages);

//   // Load from localStorage
//   useEffect(() => {
//     const savedTable = localStorage.getItem("whereIAmNowTable");
//     if (savedTable) setTableData(JSON.parse(savedTable));

//     const savedAnalysis = localStorage.getItem("whereIAmNowAnalysis");
//     if (savedAnalysis) setAnalysis(savedAnalysis);

//     const savedMessages = localStorage.getItem("whereIAmNowMessages");
//     if (savedMessages) setMessages(JSON.parse(savedMessages));
//   }, []);

//   // Auto-save everything
//   useEffect(() => {
//     localStorage.setItem("whereIAmNowTable", JSON.stringify(tableData));
//     localStorage.setItem("whereIAmNowAnalysis", analysis);
//     localStorage.setItem("whereIAmNowMessages", JSON.stringify(messages));
//   }, [tableData, analysis, messages]);

//   const isTableComplete = () => {
//     return Object.values(tableData).every((domain: any) =>
//       Object.values(domain).some(
//         (val) => typeof val === "string" && val.trim() !== "",
//       ),
//     );
//   };

//   const handleSend = () => {
//     if (!message.trim()) return;

//     const userMsg = { role: "user" as const, text: message, time: "You" };
//     setMessages((prev) => [...prev, userMsg]);

//     const lower = message.toLowerCase();

//     setTableData((prev) => {
//       let updated = { ...prev };

//       // Helper to safely append without duplicates
//       const safeAppend = (current: string, newText: string) => {
//         if (current.includes(newText.trim())) return current;
//         return current ? `${current}\n\n${newText}` : newText;
//       };

//       // Personal
//       if (
//         lower.includes("feel") ||
//         lower.includes("myself") ||
//         lower.includes("emotion") ||
//         lower.includes("purpose") ||
//         lower.includes("health") ||
//         lower.includes("anxious") ||
//         lower.includes("happy")
//       ) {
//         const target =
//           lower.includes("good") ||
//           lower.includes("great") ||
//           lower.includes("healthy")
//             ? "right"
//             : lower.includes("bad") ||
//                 lower.includes("struggle") ||
//                 lower.includes("tired")
//               ? "wrong"
//               : "confused";
//         updated.personal[target] = safeAppend(
//           updated.personal[target],
//           message,
//         );
//       }

//       // Family & Friends
//       if (
//         lower.includes("family") ||
//         lower.includes("wife") ||
//         lower.includes("husband") ||
//         lower.includes("kids") ||
//         lower.includes("friend") ||
//         lower.includes("parents")
//       ) {
//         const target =
//           lower.includes("love") ||
//           lower.includes("close") ||
//           lower.includes("support")
//             ? "right"
//             : lower.includes("fight") ||
//                 lower.includes("distant") ||
//                 lower.includes("argu")
//               ? "wrong"
//               : "confused";
//         updated.family[target] = safeAppend(updated.family[target], message);
//       }

//       // Church & Kingdom
//       if (
//         lower.includes("god") ||
//         lower.includes("pray") ||
//         lower.includes("jesus") ||
//         lower.includes("bible") ||
//         lower.includes("church") ||
//         lower.includes("faith") ||
//         lower.includes("spirit")
//       ) {
//         const target =
//           lower.includes("strong") ||
//           lower.includes("close") ||
//           lower.includes("joy")
//             ? "right"
//             : lower.includes("doubt") ||
//                 lower.includes("far") ||
//                 lower.includes("dry")
//               ? "wrong"
//               : "missing";
//         updated.church[target] = safeAppend(updated.church[target], message);
//       }

//       // Vocation
//       if (
//         lower.includes("work") ||
//         lower.includes("job") ||
//         lower.includes("career") ||
//         lower.includes("boss") ||
//         lower.includes("business") ||
//         lower.includes("calling")
//       ) {
//         const target =
//           lower.includes("love") ||
//           lower.includes("fulfill") ||
//           lower.includes("passion")
//             ? "right"
//             : lower.includes("stress") ||
//                 lower.includes("stuck") ||
//                 lower.includes("hate")
//               ? "wrong"
//               : "confused";
//         updated.vocation[target] = safeAppend(
//           updated.vocation[target],
//           message,
//         );
//       }

//       // Community
//       if (
//         lower.includes("community") ||
//         lower.includes("neighbor") ||
//         lower.includes("volunteer") ||
//         lower.includes("social") ||
//         lower.includes("society") ||
//         lower.includes("city")
//       ) {
//         const target =
//           lower.includes("active") || lower.includes("involved")
//             ? "right"
//             : lower.includes("alone") || lower.includes("isolated")
//               ? "wrong"
//               : "missing";
//         updated.community[target] = safeAppend(
//           updated.community[target],
//           message,
//         );
//       }

//       return updated;
//     });

//     setMessage("");
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     let y = 20;

//     doc.setFontSize(18);
//     doc.text("Current State Assessment", 20, y);
//     y += 12;

//     doc.setFontSize(11);
//     doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, y);
//     y += 15;

//     const domains: Record<string, string> = {
//       personal: "Personal",
//       family: "Family & Friends",
//       church: "Church & Kingdom",
//       vocation: "Vocation",
//       community: "Community",
//     };

//     Object.entries(tableData).forEach(([key, data]: [string, any]) => {
//       doc.setFontSize(13);
//       doc.text(domains[key], 20, y);
//       y += 8;

//       doc.setFontSize(11);
//       ["right", "wrong", "confused", "missing"].forEach((col) => {
//         if (data[col]?.trim()) {
//           doc.setFont("helvetica", "bold");
//           doc.text(
//             `What’s ${col.charAt(0).toUpperCase() + col.slice(1)}?`,
//             25,
//             y,
//           );
//           y += 6;

//           doc.setFont("helvetica", "normal");
//           const lines = doc.splitTextToSize(data[col], 160);
//           doc.text(lines, 30, y);
//           y += lines.length * 6 + 8;
//         }
//       });
//       y += 5;
//     });

//     if (analysis.trim()) {
//       doc.setFontSize(13);
//       doc.text("Analysis / Summary", 20, y);
//       y += 10;
//       const lines = doc.splitTextToSize(analysis, 170);
//       doc.text(lines, 20, y);
//     }

//     doc.save("CurrentStateAssessment.pdf");
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.bg}></div>

//       <nav className={styles.nav}>
//         <div className={styles["nav-brand"]}>
//           <div className={styles["nav-logo-mark"]}>🏔</div>
//           <div className={styles["nav-wordmark"]}>
//             Life<em>Plan</em>
//           </div>
//         </div>
//         <div className={styles["nav-center"]}>
//           <div className={styles["nav-center-dot"]}></div>
//           Faith-Based Life Journey
//         </div>
//         <div className={styles["nav-right"]}>
//           <div className={styles["nav-avatar"]}>H</div>
//         </div>
//       </nav>

//       <div className={styles["stage-bar"]}>
//         <span className={styles["sb-label"]}>Stage 1 — Where I Am Now</span>
//         <div className={styles["sb-track"]}>
//           <div
//             className={styles["sb-fill"]}
//             style={{ width: isTableComplete() ? "100%" : "40%" }}
//           ></div>
//         </div>
//         <span className={styles["sb-count"]}>Module 2 / 10</span>
//       </div>

//       <div className={styles.layout}>
//         <aside className={styles.sidebar}>
//           <Link
//             to="/dashboard"
//             style={{ textDecoration: "none", color: "inherit" }}
//           >
//             <button className={`${styles["sb-btn"]} ${styles.active}`}>
//               <svg className={styles.icon} viewBox="0 0 24 24">
//                 <rect x="3" y="3" width="7" height="7" rx="1" />
//                 <rect x="14" y="3" width="7" height="7" rx="1" />
//                 <rect x="3" y="14" width="7" height="7" rx="1" />
//                 <rect x="14" y="14" width="7" height="7" rx="1" />
//               </svg>
//               <span className={styles["sb-tip"]}>Dashboard</span>
//             </button>
//           </Link>
//           <Link
//             to={"/journey-complete"}
//             state={{ hideHero: true }}
//             className={styles["sb-btn"]}
//             style={{ color: "grey" }}
//           >
//             <svg className={styles.icon} viewBox="0 0 24 24">
//               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//               <polyline points="14 2 14 8 20 8" />
//               <line x1="16" y1="13" x2="8" y2="13" />
//               <line x1="16" y1="17" x2="8" y2="17" />
//               <polyline points="10 9 9 9 8 9" />
//             </svg>
//             <span className={styles["sb-tip"]}>Deliverables</span>
//           </Link>

//           <div className={styles["sb-spacer"]}></div>

//           <button
//             onClick={() => {
//               navigate("/life-plan");
//             }}
//             className={styles["sb-btn"]}
//             style={{ color: "grey" }}
//           >
//             <svg className={styles.icon} viewBox="0 0 24 24">
//               <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//               <polyline points="16 17 21 12 16 7" />
//               <line x1="21" y1="12" x2="9" y2="12" />
//             </svg>
//             <span className={styles["sb-tip"]}>Sign Out</span>
//           </button>
//         </aside>

//         <div className={styles.content}>
//           <div className={styles["left-panel"]}>
//             <div className={styles["mod-header"]}>
//               <div className={styles["mod-eyebrow"]}>
//                 Stage 1 · Getting Started · Module 2 of 10
//               </div>
//               <div className={styles["mod-title"]}>Where I Am Now</div>
//               <div className={styles["mod-subtitle"]}>
//                 360° Current Life Assessment
//               </div>
//               <div className={styles["mod-desc"]}>
//                 This module helps you take an honest snapshot of your current
//                 season across five key domains.
//               </div>
//               <div className={styles["instruction-box"]}>
//                 <div className={styles["ib-title"]}>How It Works</div>
//                 <div className={styles["ib-text"]}>
//                   Chat with the guide on the right.
//                   <br />
//                   The table updates live as you share.
//                   <br />
//                   When all domains have content → Analysis + PDF button appear.
//                 </div>
//               </div>
//             </div>

//             <div className={styles["live-table"]}>
//               <div className={styles["lt-title"]}>Live Life Table</div>
//               <table className={styles["live-table-table"]}>
//                 <thead>
//                   <tr>
//                     <th>Domain</th>
//                     <th>What’s Right?</th>
//                     <th>What’s Wrong?</th>
//                     <th>What’s Confused?</th>
//                     <th>What’s Missing?</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Object.entries(tableData).map(
//                     ([key, vals]: [string, any]) => (
//                       <tr key={key}>
//                         <td>
//                           <strong>
//                             {key === "family"
//                               ? "Family & Friends"
//                               : key === "church"
//                                 ? "Church & Kingdom"
//                                 : key.charAt(0).toUpperCase() + key.slice(1)}
//                           </strong>
//                         </td>
//                         <td>{vals.right || "—"}</td>
//                         <td>{vals.wrong || "—"}</td>
//                         <td>{vals.confused || "—"}</td>
//                         <td>{vals.missing || "—"}</td>
//                       </tr>
//                     ),
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {isTableComplete() && (
//               <>
//                 <div className={styles["analysis-section"]}>
//                   <div className={styles["as-title"]}>Analysis</div>
//                   <textarea
//                     className={styles["analysis-textarea"]}
//                     value={analysis}
//                     onChange={(e) => setAnalysis(e.target.value)}
//                     placeholder="Future: AI-generated summary will appear here.\nFor now — feel free to write your own reflections."
//                     rows={6}
//                   />
//                 </div>
//                 <div className={styles["save-actions"]}>
//                   <button
//                     onClick={() => {
//                       navigate("/perspective");
//                     }}
//                     className={styles["btn-complete"]}
//                   >
//                     <i className="fa fa-check-circle"></i> Save &amp; Mark
//                     Complete
//                   </button>

//                   <button className={styles["btn-pdf"]} onClick={generatePDF}>
//                     <i className={styles["fa fa-floppy-o"]}></i> Download PDF
//                     Report
//                   </button>

//                   <button
//                     className={styles["btn-ghost"]}
//                     onClick={() => {
//                       navigate("/dashboard");
//                     }}
//                   >
//                     Dashboard
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* RIGHT PANEL — CHAT */}
//           <div className={styles["right-panel"]}>
//             <div className={styles["chat-window"]}>
//               <div className={styles["chat-header"]}>
//                 <div className={styles["chat-ai-avatar"]}>✦</div>
//                 <div>
//                   <div className={styles["chat-ai-name"]}>LifePlan Guide</div>
//                   <div className={styles["chat-ai-status"]}>
//                     <div className={styles["online-dot"]}></div>
//                     Current Assessment
//                   </div>
//                 </div>
//               </div>

//               <div className={styles["chat-messages"]}>
//                 {messages.map((msg, i) => (
//                   <div
//                     key={i}
//                     className={`${styles.msg} ${msg.role === "user" ? styles.user : ""}`}
//                   >
//                     <div
//                       className={`${styles["msg-av"]} ${msg.role === "ai" ? styles.ai : styles.user}`}
//                     >
//                       {msg.role === "ai" ? "✦" : "H"}
//                     </div>
//                     <div className={styles["msg-body"]}>
//                       <div
//                         className={`${styles.bubble} ${msg.role === "ai" ? styles.ai : styles.user}`}
//                         dangerouslySetInnerHTML={{
//                           __html: msg.text.replace(/\n/g, "<br/>"),
//                         }}
//                       />
//                       <div className={styles["msg-time"]}>{msg.time}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className={styles["chat-input-area"]}>
//                 <textarea
//                   className={styles["chat-input"]}
//                   placeholder="Type your thoughts... (press Enter to send)"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" && !e.shiftKey) {
//                       e.preventDefault();
//                       handleSend();
//                     }
//                   }}
//                   rows={1}
//                 />
//                 <button className={styles["send-btn"]} onClick={handleSend}>
//                   ➤
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* <div className={styles['screen-badge']}>Module 2: Where I Am Now</div> */}
//     </div>
//   );
// };

// export default WhereIAmNow;
