
import styles from '../css/JourneyComplete.module.css';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

const JourneyComplete = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const shouldHideHero = location.state?.hideHero;

  return (
    <div className={styles.container}>
      {/* ANIMATED BACKGROUND LAYERS */}
      <div className={styles.bg}></div>
      <div className={styles['glow-orb']}></div>
      <div className={styles['bg-layer']}></div>
      <div className={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.particle}></div>
        ))}
      </div>

      {/* NAVIGATION */}
      <nav className={styles.nav}>
        <div className={styles['nav-brand']}>
          <div className={styles['nav-logo-mark']}>🏔</div>
          <div className={styles['nav-wordmark']}>Life<em>Plan</em></div>
        </div>
        <div className={styles['nav-center']}>
          <div className={styles['nav-center-dot']}></div>
          Faith-Based AI Journey
        </div>
        <div className={styles['nav-right']}>
          <div className={styles['nav-avatar']}>RG</div>
        </div>
      </nav>

      <div className={styles.layout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <button className={styles['sb-btn']}>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'grey' }}>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              <span className={styles['sb-tip']}>Dashboard</span>
            </Link>
          </button>
          {/* <button className={`${styles['sb-btn']} ${styles.active}`}>
            <Link to="/journey-complete" style={{ textDecoration: 'none', color: 'grey' }}>
              <svg className={styles.icon} viewBox="0 0 24 24">
                <path d="M3 12h18M3 12l7-7M3 12l7 7" />
                <circle cx="17" cy="12" r="4" />
              </svg>
              <span className={styles['sb-tip']}>My Journey</span>
            </Link>
          </button> */}
          <Link to={"/journey-complete"} className={styles['sb-btn']} style={{ color: 'grey' }}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className={styles['sb-tip']}>Deliverables</span>
          </Link>
   
          <div className={styles['sb-spacer']}></div>
    
          <button onClick={() => { navigate('/') }} className={styles['sb-btn']} style={{ color: 'grey' }}>
            <svg className={styles.icon} viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className={styles['sb-tip']}>Sign Out</span>
          </button>
        </aside>

        <div className={styles.content}>
          {/* CELEBRATION HERO */}
{!shouldHideHero && (
          <div className={styles.celebration}>
            <div className={styles['cel-confetti']}>
              <i className="fa fa-trophy" style={{ fontSize: '40px', color: '#f1c40f', verticalAlign: 'middle' }}></i>
            </div>
            <div className={styles['cel-badge']}>✓ All 10 Modules Complete</div>
            <div className={styles['cel-title']}>Your LifePlan<br />Is Ready, <span>Ron</span></div>
            <div className={styles['cel-sub']}>
              You've walked through all 4 stages and 10 modules — through honest self-reflection, the
              courage to name what holds you back, and the faith to step into what's next. This is no small thing.
            </div>
            <div className={styles['cel-scripture']}>
              "He who began a good work in you will carry it on to completion until the day of Christ Jesus." — Philippians 1:6
            </div>
          </div>
)}

          {/* STAGE COMPLETIONS */}
          <div className={styles['stage-complete-row']}>
            <div className={styles['sc-card']}>
              <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                <div className={styles['sc-icon']}><i className="fa fa-rocket" style={{ color: '#5ddb8e' }}></i></div>
                <div className={styles['sc-stage-name']}>Getting Started</div>
                <div className={styles['sc-mods']}>2 modules complete</div>
                <div className={styles['sc-check']}>✓</div>
              </Link>
            </div>
            <div className={styles['sc-card']} style={{ borderColor: 'rgba(124,75,160,0.35)' }}>
              <Link to="/perspective" style={{ textDecoration: 'none' }}>
                <div className={styles['sc-icon']}><i className="fa fa-binoculars" style={{ color: '#c490f0' }}></i></div>
                <div className={styles['sc-stage-name']} style={{ color: '#c490f0' }}>Perspective</div>
                <div className={styles['sc-mods']}>4 modules complete</div>
                <div className={styles['sc-check']}>✓</div>
              </Link>
            </div>
            <div className={styles['sc-card']} style={{ borderColor: 'rgba(192,144,48,0.35)' }}>
              <Link to="/surrender" style={{ textDecoration: 'none' }}>
                <div className={styles['sc-icon']}><i className="fa fa-hand-peace-o" style={{ color: '#f0c060' }}></i></div>
                <div className={styles['sc-stage-name']} style={{ color: '#f0c060' }}>Surrender</div>
                <div className={styles['sc-mods']}>1 module complete</div>
                <div className={styles['sc-check']}>✓</div>
              </Link>
            </div>
            <div className={styles['sc-card']} style={{ borderColor: 'rgba(192,57,43,0.35)' }}>
              <Link to="/my-purpose" style={{ textDecoration: 'none' }}>
                <div className={styles['sc-icon']}><i className="fa fa-road" style={{ color: '#f08070' }}></i></div>
                <div className={styles['sc-stage-name']} style={{ color: '#f08070' }}>LifePlan</div>
                <div className={styles['sc-mods']}>3 modules complete</div>
                <div className={styles['sc-check']}>✓</div>
              </Link>
            </div>
          </div>

          {/* DELIVERABLES */}
          <div className={styles['deliverables-section']}>
            <div className={styles['section-header']}>
              <div>
                <div className={styles['section-title']}>Your Three Deliverables</div>
                <div className={styles['section-sub']}>Not aspirational. Not generic. Uniquely yours — the lived expression of an integrated, wholehearted life.</div>
              </div>
              <button className={styles['btn-download-all']}>⬇ Download All 3 PDFs</button>
            </div>

            <div className={styles['deliverables-grid']}>
              {[
                { id: 1, title: "Personal Mission Statement", icon: "fa-quote-left", text: "To faithfully steward the gifts, wisdom, and relationships God has entrusted to me — guiding others through transition with compassion, clarity, and courage..." },
                { id: 2, title: "Vision Statement", icon: "fa-eye", text: "In the next season, I see myself leading with presence rather than productivity — building something meaningful that outlasts a job title..." },
                { id: 3, title: "Purpose-Aligned Action Plan", icon: "fa-list-ul", text: "Step 1: Commit to daily morning prayer — 15 minutes, before screens. Step 2: Have a defining direction conversation..." }
              ].map((doc) => (
                <div className={styles['doc-card']} key={doc.id}>
                  <div className={`${styles['dc-head']} ${styles[`dc${doc.id}-head`]}`}>
                    <div className={styles['dc-icon']}><i className={`fa ${doc.icon}`} style={{ color: '#5ddb8e' }}></i></div>
                    <div className={styles['dc-label']}>Document {doc.id}</div>
                    <div className={styles['dc-title']}>{doc.title}</div>
                  </div>
                  <div className={styles['dc-body']}>
                    <div className={styles['dc-preview']}>"{doc.text}"</div>
                    <div className={styles['dc-actions']}>
                      <button className={styles['dc-btn-dl']}>⬇ PDF</button>
                      <button className={styles['dc-btn-view']}>👁 View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REVIEW ALL MODULES */}
          <div className={styles['review-section']}>
            <div className={styles['rs-title']}>Review Your Journey</div>
            <div className={styles['rs-sub']}>Click any module to revisit and edit your saved work.</div>
            <div className={styles['modules-review']}>
              {[
                { name: "Why I Am Here", sub: "Goals by Domain" },
                { name: "Where I Am Now", sub: "Current State", path: "/where-i-am-now" },
                { name: "How I Got Here", sub: "Turning Points" },
                { name: "How I'm Wired", sub: "Enneagram" },
                { name: "What Stops Me", sub: "Roadblocks" },
                { name: "Perspective", sub: "360° View", path: "/perspective"},
                { name: "Surrender", sub: "Surrender List", path: "/surrender" },
                { name: "My Purpose", sub: "Mission Statement", path: "/my-purpose" },
                { name: "My Future", sub: "Vision Statement", path: "/journey-complete" },
                { name: "Next Steps", sub: "Action Plan" }
              ].map((m, i) => (
                <Link to={m.path || "#"} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles['mr-mod']} key={i}>
                  <div className={styles['mr-check']}>✓</div>
                  <div className={styles['mr-name']}>{m.name}</div>
                  <div className={styles['mr-sub']}>{m.sub}</div>
                </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CLOSING BANNER */}
          <div className={styles['closing-banner']}>
            <div className={styles['cb-left']}>
              <div className={styles['cb-tag']}>✦ What Comes Next</div>
              <div className={styles['cb-title']}>Your Journey Doesn't End Here</div>
              <div className={styles['cb-desc']}>Your LifePlan is a living document. Return to any module as your season changes. Add to your Surrender List. Refine your vision. God continues to lead — and this plan grows with you.</div>
            </div>
            <button className={styles['btn-white']}>⬇ Download All 3 PDFs</button>
          </div>
        </div>
      </div>

      <div className={styles['screen-badge']}>Screen 6 of 6 — Journey Complete</div>
    </div>
  );
};

export default JourneyComplete;