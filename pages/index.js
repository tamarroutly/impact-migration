import { useState, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import Head from 'next/head';

const BOOKING_URL = 'https://tidycal.com/podcast-impact-studio/60-minute-meeting';

const CHATGPT_PROMPT = `Based on everything you know about me, describe my communication style, my tone, my vocabulary, and how I write. Also tell me the top 5 things I use you for and how well you've served each one. Be as specific as possible.`;

const PLATFORMS = [
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    icon: '🤖',
    exportInstructions: {
      title: 'Export your ChatGPT history',
      note: 'The export can take up to 24 hours — request it now.',
      steps: [
        'Go to chatgpt.com and log in',
        'Click your profile picture (top right) → Settings',
        'Click Data Controls',
        'Click Export Data → Confirm Export',
        'ChatGPT emails you a download link (usually within minutes)',
        'Download the zip file',
        'Email the zip to info@podcastimpactstudio.com with your name in the subject line',
      ],
    },
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    icon: '✦',
    exportInstructions: {
      title: 'Export your Google Gemini history',
      note: 'Google Takeout exports can take a few hours.',
      steps: [
        'Go to takeout.google.com and log in',
        'Click "Deselect all"',
        'Scroll down and check "Gemini Apps Activity"',
        'Click Next step → Choose file type → Create export',
        'Download the file when Google emails you the link',
        'Email the file to info@podcastimpactstudio.com with your name in the subject line',
      ],
    },
  },
  {
    id: 'copilot',
    label: 'Microsoft Copilot',
    icon: '🪟',
    exportInstructions: {
      title: 'Save your Microsoft Copilot conversations',
      note: 'Copilot doesn\'t have a bulk export — follow these steps instead.',
      steps: [
        'Open Copilot and go to your conversation history',
        'Open each conversation you use most or find most valuable',
        'Copy the full conversation text (Ctrl+A or Cmd+A, then Copy)',
        'Paste each one into a Word or Google Doc',
        'Email the document to info@podcastimpactstudio.com with your name in the subject line',
      ],
    },
  },
  {
    id: 'perplexity',
    label: 'Perplexity',
    icon: '🔍',
    exportInstructions: {
      title: 'Save your Perplexity threads',
      note: 'Perplexity doesn\'t have an export tool yet — here\'s the workaround.',
      steps: [
        'Log in to perplexity.ai',
        'Go to your Library (left sidebar)',
        'Open each thread you want to save',
        'Copy the content or copy the share link for each thread',
        'Paste the links and/or content into a document',
        'Email to info@podcastimpactstudio.com with your name in the subject line',
      ],
    },
  },
  {
    id: 'metaai',
    label: 'Meta AI',
    icon: '🔵',
    exportInstructions: {
      title: 'Export your Meta AI conversations',
      note: 'You can request your data through Facebook\'s privacy center.',
      steps: [
        'Go to facebook.com and log in',
        'Click your profile → Settings & Privacy → Settings',
        'Click "Your Facebook Information" → "Download Your Information"',
        'Select "Messages" and set date range',
        'Click "Request a Download" — Facebook will email you when it\'s ready',
        'Email the file to info@podcastimpactstudio.com with your name in the subject line',
      ],
    },
  },
  {
    id: 'other',
    label: 'Other',
    icon: '➕',
    exportInstructions: {
      title: 'Other AI platform',
      note: 'Tell us which platform and we\'ll help you figure out the best way to extract your data.',
      steps: [
        'Make a note of which platform(s) you use',
        'Try to export or copy your most important conversations',
        'Email anything you can gather to info@podcastimpactstudio.com with your name in the subject line',
        'We\'ll work through the rest together on your call',
      ],
    },
  },
];

const sections = [
  {
    id: 'intro',
    type: 'intro',
  },
  {
    id: 'platform_select',
    type: 'platform_select',
  },
  {
    id: 'platform_instructions',
    type: 'platform_instructions',
  },
  {
    id: 'name',
    section: 'Getting Started',
    question: "First — what's your name?",
    placeholder: 'Your full name...',
    type: 'short',
  },
  {
    id: 'email',
    section: 'Getting Started',
    question: 'And your email address?',
    placeholder: 'you@yourdomain.com',
    type: 'short',
  },
  {
    id: 'website',
    section: 'Your World',
    question: "What's your website URL?",
    hint: "We'll review this before our call so we already understand your mission and voice.",
    placeholder: 'https://yourwebsite.com',
    type: 'short',
  },
  {
    id: 'social',
    section: 'Your World',
    question: 'What is your most active social platform and handle?',
    hint: 'LinkedIn, Instagram, X — wherever you show up most.',
    placeholder: 'e.g. LinkedIn — linkedin.com/in/yourname',
    type: 'short',
  },
  {
    id: 'role',
    section: 'Your Role & World',
    question: "What's your actual job title — and what do you really do day to day?",
    hint: 'Go beyond the title. Tell us what your days actually look like.',
    placeholder: 'Tell us about your role...',
    type: 'long',
  },
  {
    id: 'audience',
    section: 'Your Role & World',
    question: 'Who do you communicate with most — peers, leadership, direct reports, clients?',
    placeholder: 'Describe who is in your world...',
    type: 'long',
  },
  {
    id: 'decisions',
    section: 'Your Role & World',
    question: 'What kinds of decisions land on your desk regularly?',
    placeholder: 'The big stuff and the everyday stuff...',
    type: 'long',
  },
  {
    id: 'ai_platform',
    section: 'Your AI History',
    question: 'What AI platform(s) have you been using and for how long?',
    hint: 'Many people use more than one — list all of them.',
    placeholder: 'e.g. ChatGPT for 2 years, Gemini for 6 months...',
    type: 'short',
  },
  {
    id: 'ai_love',
    section: 'Your AI History',
    question: 'What did you absolutely love about them? What worked so well you\'re afraid to lose it?',
    placeholder: 'The things that were genuinely great...',
    type: 'long',
  },
  {
    id: 'ai_frustrate',
    section: 'Your AI History',
    question: 'What frustrated you? What made you feel like they were never quite right?',
    placeholder: 'Be honest — what drove you crazy...',
    type: 'long',
  },
  {
    id: 'ai_wish',
    section: 'Your AI History',
    question: 'Was there a moment where you thought "I wish this could just..."?',
    placeholder: 'The thing you always wanted but never got...',
    type: 'long',
  },
  {
    id: 'ai_switch',
    section: 'Your AI History',
    question: 'What made you ready to make the switch to Claude?',
    placeholder: 'What brought you here...',
    type: 'long',
  },
  {
    id: 'think_style',
    section: 'How You Think',
    question: 'Are you a big picture person or do you like details first?',
    placeholder: 'How your brain works...',
    type: 'long',
  },
  {
    id: 'think_stuck',
    section: 'How You Think',
    question: 'When you\'re stuck, what does that look like?',
    hint: 'Blank page? Overthinking? Avoidance? Spinning?',
    placeholder: 'Your honest answer...',
    type: 'long',
  },
  {
    id: 'work_uses',
    section: 'How You Work',
    question: 'What are the 3–5 things you use AI for most right now?',
    hint: 'Be specific — not just "writing" but what kind of writing.',
    placeholder: '1. \n2. \n3. \n4. \n5. ',
    type: 'long',
  },
  {
    id: 'work_hate',
    section: 'How You Work',
    question: 'What tasks do you hate that you wish would just disappear?',
    placeholder: 'The stuff that drains you...',
    type: 'long',
  },
  {
    id: 'work_day',
    section: 'How You Work',
    question: 'What does a great work day look like vs. a derailed one?',
    placeholder: 'Paint the picture of both...',
    type: 'long',
  },
  {
    id: 'comm_style',
    section: 'How You Communicate',
    question: 'How would your closest colleague describe your communication style?',
    placeholder: 'In their words, not yours...',
    type: 'long',
  },
  {
    id: 'comm_format',
    section: 'How You Communicate',
    question: 'Do you write formally or conversationally? How long do you like things?',
    placeholder: 'Your natural style...',
    type: 'long',
  },
  {
    id: 'comm_peeve',
    section: 'How You Communicate',
    question: 'What\'s your biggest pet peeve when something communicates with you?',
    hint: 'What makes you immediately tune out or cringe?',
    placeholder: 'The things that drive you crazy...',
    type: 'long',
  },
  {
    id: 'chatgpt_results',
    section: 'One Last Step',
    type: 'chatgpt',
  },
  {
    id: 'confirm',
    type: 'confirm',
  }
];

export default function IntakeForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isListening, setIsListening] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  const currentSection = sections[step];
  const totalSteps = sections.length - 5; // exclude intro, platform_select, platform_instructions, chatgpt, confirm
  const currentStepNum = step - 3; // offset for intro + 2 platform screens

  useEffect(() => {
    const nonInput = ['intro', 'confirm', 'chatgpt', 'platform_select', 'platform_instructions'];
    if (inputRef.current && !nonInput.includes(currentSection?.type)) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Try Chrome.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswers(prev => ({ ...prev, [currentSection.id]: transcript }));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleNext = () => {
    if (currentSection.type === 'intro') {
      setStep(1);
      return;
    }
    if (step < sections.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const canAdvance = () => {
    if (currentSection.type === 'intro') return true;
    if (currentSection.type === 'confirm') return true;
    if (currentSection.type === 'platform_instructions') return true;
    if (currentSection.type === 'platform_select') return (answers.platforms || []).length > 0;
    if (currentSection.type === 'chatgpt') return answers.chatgpt_results?.trim().length > 0;
    const required = ['name', 'email'];
    if (required.includes(currentSection.id)) {
      return answers[currentSection.id]?.trim().length > 0;
    }
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    const formattedAnswers = [
      {
        section: 'Platforms',
        question: 'AI platforms migrating from',
        answer: (answers.platforms || []).map(id => PLATFORMS.find(p => p.id === id)?.label).join(', '),
      },
      ...sections
        .filter(s => !['intro','confirm','chatgpt','platform_select','platform_instructions'].includes(s.type))
        .map(s => ({
          section: s.section,
          question: s.question,
          answer: answers[s.id] || ''
        })),
      {
        section: 'ChatGPT Insights',
        question: 'ChatGPT response to: describe my communication style, top 5 uses, how well each was served',
        answer: answers.chatgpt_results || ''
      }
    ];

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: answers.name,
          email: answers.email,
          answers: formattedAnswers
        })
      });

      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (e) {
      setError('Something went wrong. Please try again or email tamar@podcastimpactstudio.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(CHATGPT_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressPct = currentSection.type === 'intro' ? 0
    : currentSection.type === 'platform_select' ? 0
    : currentSection.type === 'platform_instructions' ? 0
    : currentSection.type === 'confirm' || currentSection.type === 'chatgpt' ? 100
    : Math.round((currentStepNum / totalSteps) * 100);

  if (submitted) {
    return (
      <div style={styles.page}>
        <Head>
          <title>You're booked — Impact Studio AI Migration</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
        </Head>
        <div style={styles.container} className="animate-fade-up">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div style={styles.logo}><img src="/logo.png" alt="Podcast Impact Studio" style={{ height: '132px', width: 'auto', display: 'block' }} /></div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
            <h1 style={styles.heading}>You're in, {answers.name?.split(' ')[0]}.</h1>
            <p style={{ ...styles.subheading, fontSize: '1.1rem' }}>
              Your answers — including your ChatGPT insights — are on their way to Tamar. She'll review everything before your call so you hit the ground running.
            </p>
          </div>

          {/* ChatGPT Export Instructions */}
          <div style={{ background: '#FFFFFF', border: '1px solid #D8D2C8', borderLeft: '3px solid #CC1818', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#CC1818', marginBottom: '0.75rem' }}>Before You Book — Important</div>
            <h3 style={{ fontSize: '1.15rem', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 400, color: '#1A1A1A', marginBottom: '0.75rem' }}>
              Export your full ChatGPT history and email it to us.
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#333', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              This saves us up to an hour on your call — we'll review it ahead of time so we can hit the ground running. The export can take up to 24 hours to arrive, so <strong>please book your call no earlier than 48 hours after you request the export.</strong>
            </p>

            <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '0.75rem' }}>How to export your ChatGPT history</div>
            <ol style={{ paddingLeft: '1.25rem', margin: '0 0 1.25rem' }}>
              {[
                'Go to chatgpt.com and log in',
                'Click your profile picture (top right)',
                'Click Settings',
                'Click Data Controls',
                'Click Export Data',
                'Click Confirm Export',
                'ChatGPT emails you a download link — usually arrives within a few minutes',
                'Download the zip file and open it',
              ].map((step, i) => (
                <li key={i} style={{ fontSize: '0.95rem', color: '#333', lineHeight: 1.8 }}>{step}</li>
              ))}
            </ol>

            <div style={{ background: '#F5F1EB', border: '1px solid #D8D2C8', padding: '0.85rem 1rem', fontSize: '0.95rem', color: '#1A1A1A' }}>
              📧 Email the zip file to <strong>info@podcastimpactstudio.com</strong> with your name in the subject line.
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#444', fontSize: '1rem', marginBottom: '0.5rem', lineHeight: 1.7 }}>
              Once you've sent the export, book your call — <strong>at least 48 hours out.</strong>
            </p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" style={{ ...styles.primaryBtn, fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Book Your Call →
            </a>
          </div>

          <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '2.5rem' }}>
            Questions? Email tamar@podcastimpactstudio.com
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Head>
        <title>Impact Studio AI Migration — Pre-Work</title>
        <meta name="description" content="Your Claude migration starts here. Answer a few questions so we can build your AI exactly the way you work." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
      </Head>

      {/* Progress bar */}
      {currentSection.type !== 'intro' && (
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
        </div>
      )}

      <div style={styles.container} className="animate-fade-up" key={step}>

        {/* INTRO */}
        {currentSection.type === 'intro' && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div style={styles.logo}><img src="/logo.png" alt="Podcast Impact Studio" style={{ height: '132px', width: 'auto', display: 'block' }} /></div>
            <div style={styles.badge}>AI Migration — Pre-Work</div>
            <h1 style={{ ...styles.heading, fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Your AI.<br />Set up right.<br />Built around you.
            </h1>
            <p style={{ ...styles.subheading, maxWidth: '480px' }}>
              Before we build your Claude, we need to understand how you think, how you work, and what you've loved — and hated — about AI so far.
            </p>

            {/* Instructions */}
            <div style={{ background: '#FFFFFF', border: '1px solid #D8D2C8', borderLeft: '3px solid #CC1818', padding: '1.25rem 1.5rem', marginBottom: '2rem', maxWidth: '480px' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#CC1818', marginBottom: '0.75rem' }}>Before you begin</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  '📋  No prep needed — all answers come from memory.',
                  '🎙  Want to talk instead of type? Use Superwhisper, WhisperFlow, or TalkTastic to dictate straight into each answer box.',
                  '⏱  Takes about 15–20 minutes. There\'s no rush.',
                  '💬  At the end, we\'ll give you one short prompt to run in ChatGPT before your call — you don\'t need it open now.',
                  '✅  You\'ll review everything before you submit. Nothing sends until you\'re ready.',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: '0.92rem', color: '#333', lineHeight: 1.7, paddingBottom: i < 4 ? '0.5rem' : 0 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={handleNext} style={styles.primaryBtn}>
              Let's do this →
            </button>
          </div>
        )}

        {/* PLATFORM SELECT */}
        {currentSection.type === 'platform_select' && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div style={styles.logo}><img src="/logo.png" alt="Podcast Impact Studio" style={{ height: '132px', width: 'auto', display: 'block' }} /></div>
            <div style={styles.sectionLabel}>Before We Begin</div>
            <h2 style={styles.question}>Which AI platforms are you migrating from?</h2>
            <p style={styles.hint}>Select all that apply — we'll give you tailored instructions for each one so we hit the ground running on your call.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {PLATFORMS.map(p => {
                const selected = (answers.platforms || []).includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      const current = answers.platforms || [];
                      const updated = selected ? current.filter(x => x !== p.id) : [...current, p.id];
                      setAnswers(prev => ({ ...prev, platforms: updated }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.9rem 1.25rem',
                      background: selected ? '#FFFFFF' : '#F5F1EB',
                      border: selected ? '2px solid #CC1818' : '1px solid #D8D2C8',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{p.icon}</span>
                    <span style={{ fontSize: '1rem', color: '#1A1A1A', fontFamily: "'Playfair Display', Georgia, serif" }}>{p.label}</span>
                    {selected && <span style={{ marginLeft: 'auto', color: '#CC1818', fontSize: '1rem' }}>✓</span>}
                  </div>
                );
              })}
            </div>

            <div style={styles.navRow}>
              <button onClick={handleBack} style={styles.backBtn}>← Back</button>
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                style={{ ...styles.primaryBtn, opacity: canAdvance() ? 1 : 0.3, cursor: canAdvance() ? 'pointer' : 'default' }}
              >
                See My Export Instructions →
              </button>
            </div>
          </div>
        )}

        {/* PLATFORM INSTRUCTIONS */}
        {currentSection.type === 'platform_instructions' && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div style={styles.logo}><img src="/logo.png" alt="Podcast Impact Studio" style={{ height: '132px', width: 'auto', display: 'block' }} /></div>
            <div style={styles.sectionLabel}>Data Export Instructions</div>
            <h2 style={styles.question}>Start these exports now — before you continue.</h2>
            <p style={styles.hint}>Some exports take up to 24 hours to arrive. Get them going now so everything is ready before your call. Email each file to <strong style={{ color: '#CC1818' }}>info@podcastimpactstudio.com</strong> with your name in the subject line.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
              {PLATFORMS.filter(p => (answers.platforms || []).includes(p.id)).map(p => (
                <div key={p.id} style={{ background: '#FFFFFF', border: '1px solid #D8D2C8', borderLeft: '3px solid #CC1818', padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{p.icon}</span>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#CC1818' }}>{p.label}</div>
                  </div>
                  <div style={{ fontSize: '1rem', fontFamily: "'Playfair Display', Georgia, serif", color: '#1A1A1A', marginBottom: '0.25rem' }}>{p.exportInstructions.title}</div>
                  {p.exportInstructions.note && (
                    <div style={{ fontSize: '0.85rem', color: '#CC1818', fontStyle: 'italic', marginBottom: '0.75rem' }}>⚠ {p.exportInstructions.note}</div>
                  )}
                  <ol style={{ paddingLeft: '1.25rem', margin: 0 }}>
                    {p.exportInstructions.steps.map((s, i) => (
                      <li key={i} style={{ fontSize: '0.92rem', color: '#333', lineHeight: 1.8 }}>{s}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            <div style={{ background: '#F5F1EB', border: '1px solid #D8D2C8', padding: '0.85rem 1rem', fontSize: '0.92rem', color: '#333', marginBottom: '2rem', lineHeight: 1.7 }}>
              📅 <strong>Book your call at least 48 hours after requesting your exports</strong> so we have time to review everything before we meet.
            </div>

            <div style={styles.navRow}>
              <button onClick={handleBack} style={styles.backBtn}>← Back</button>
              <button onClick={handleNext} style={styles.primaryBtn}>
                Got it — let's continue →
              </button>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {currentSection.type !== 'intro' && currentSection.type !== 'confirm' && currentSection.type !== 'chatgpt' && currentSection.type !== 'platform_select' && currentSection.type !== 'platform_instructions' && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div style={styles.logo}><img src="/logo.png" alt="Podcast Impact Studio" style={{ height: '132px', width: 'auto', display: 'block' }} /></div>
            <div style={styles.sectionLabel}>{currentSection.section}</div>
            <h2 style={styles.question}>{currentSection.question}</h2>
            {currentSection.hint && (
              <p style={styles.hint}>{currentSection.hint}</p>
            )}

            <div style={{ background: '#F5F1EB', border: '1px solid #D8D2C8', padding: '0.6rem 0.9rem', marginBottom: '0.75rem', fontSize: '0.82rem', color: '#555', lineHeight: 1.6 }}>
              🎙 <strong>Prefer to talk?</strong> Use <a href="https://superwhisper.com" target="_blank" rel="noopener noreferrer" style={{ color: '#CC1818' }}>Superwhisper</a>, <a href="https://whisperflow.app" target="_blank" rel="noopener noreferrer" style={{ color: '#CC1818' }}>WhisperFlow</a>, or <a href="https://www.toolify.ai/tool/talktastic" target="_blank" rel="noopener noreferrer" style={{ color: '#CC1818' }}>TalkTastic</a> to dictate your answer directly into the box below.
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {currentSection.type === 'long' ? (
                <textarea
                  ref={inputRef}
                  value={answers[currentSection.id] || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [currentSection.id]: e.target.value }))}
                  placeholder={currentSection.placeholder}
                  rows={5}
                  style={styles.textarea}
                />
              ) : (
                <input
                  ref={inputRef}
                  type={currentSection.id === 'email' ? 'email' : 'text'}
                  value={answers[currentSection.id] || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [currentSection.id]: e.target.value }))}
                  placeholder={currentSection.placeholder}
                  style={styles.input}
                  onKeyDown={e => e.key === 'Enter' && canAdvance() && handleNext()}
                />
              )}
            </div>

            <div style={styles.navRow}>
              <button onClick={handleBack} style={styles.backBtn}>← Back</button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#555', fontSize: '0.85rem' }}>
                  {currentStepNum} / {totalSteps}
                </span>
                <button
                  onClick={handleNext}
                  disabled={!canAdvance()}
                  style={{
                    ...styles.primaryBtn,
                    opacity: canAdvance() ? 1 : 0.3,
                    cursor: canAdvance() ? 'pointer' : 'default',
                    padding: '0.7rem 1.5rem',
                    fontSize: '0.85rem'
                  }}
                >
                  {currentStepNum === totalSteps ? 'Next: ChatGPT Step →' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CHATGPT STEP */}
        {currentSection.type === 'chatgpt' && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div style={styles.logo}><img src="/logo.png" alt="Podcast Impact Studio" style={{ height: '132px', width: 'auto', display: 'block' }} /></div>
            <div style={styles.sectionLabel}>One Last Step</div>
            <h2 style={styles.question}>Run this prompt in ChatGPT — then paste the results here.</h2>
            <p style={styles.hint}>
              This gives us a head start on understanding your communication style and how you've been using AI. Open ChatGPT, copy the prompt below, paste it in, then bring the response back here.
            </p>

            <div style={styles.promptBox}>
              <p style={{ color: '#333', fontSize: '0.92rem', lineHeight: 1.8, fontStyle: 'italic', margin: 0 }}>
                {CHATGPT_PROMPT}
              </p>
            </div>
            <button onClick={copyPrompt} style={{ ...styles.copyBtn, marginBottom: '1.5rem', display: 'inline-block' }}>
              {copied ? '✓ Copied!' : 'Copy Prompt'}
            </button>

            <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CC1818', margin: '1.5rem 0 0.5rem' }}>
              Paste ChatGPT's response here
            </div>
            <textarea
              value={answers.chatgpt_results || ''}
              onChange={e => setAnswers(prev => ({ ...prev, chatgpt_results: e.target.value }))}
              placeholder="Paste what ChatGPT said here..."
              rows={8}
              style={styles.textarea}
            />

            <div style={styles.navRow}>
              <button onClick={handleBack} style={styles.backBtn}>← Back</button>
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                style={{
                  ...styles.primaryBtn,
                  opacity: canAdvance() ? 1 : 0.3,
                  cursor: canAdvance() ? 'pointer' : 'default',
                  padding: '0.7rem 1.5rem',
                  fontSize: '0.85rem'
                }}
              >
                Review My Answers →
              </button>
            </div>
          </div>
        )}

        {/* CONFIRM */}
        {currentSection.type === 'confirm' && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div style={styles.logo}><img src="/logo.png" alt="Podcast Impact Studio" style={{ height: '132px', width: 'auto', display: 'block' }} /></div>
            <h2 style={styles.heading}>Looking good, {answers.name?.split(' ')[0] || 'friend'}.</h2>
            <p style={styles.subheading}>
              Here's everything you've shared. Click any answer to go back and edit it — then hit submit when you're ready.
            </p>

            <div style={{ marginBottom: '2rem' }}>
              {sections
                .filter(s => !['intro','confirm','chatgpt','platform_select','platform_instructions'].includes(s.type))
                .map((s, i) => {
                  const sectionIndex = sections.findIndex(sec => sec.id === s.id);
                  return (
                    <div
                      key={i}
                      onClick={() => setStep(sectionIndex)}
                      style={{ ...styles.reviewItem, cursor: 'pointer' }}
                      title="Click to edit"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={styles.reviewSection}>{s.section}</div>
                          <div style={styles.reviewQuestion}>{s.question}</div>
                          <div style={styles.reviewAnswer}>
                            {answers[s.id] || <span style={{ color: '#999', fontStyle: 'italic' }}>Not answered — click to add</span>}
                          </div>
                        </div>
                        <div style={{ color: '#CC1818', fontSize: '0.75rem', letterSpacing: '0.05em', marginLeft: '1rem', marginTop: '0.25rem', flexShrink: 0 }}>Edit</div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {error && (
              <div style={{ color: '#CC1818', fontSize: '0.92rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={styles.navRow}>
              <button onClick={handleBack} style={styles.backBtn}>← Back</button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !answers.name || !answers.email}
                style={{
                  ...styles.primaryBtn,
                  opacity: submitting || !answers.name || !answers.email ? 0.5 : 1,
                  cursor: submitting ? 'wait' : 'pointer'
                }}
              >
                {submitting ? 'Sending...' : 'Submit & Book My Call →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#EDE8E0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.5rem',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
  },
  logo: {
    marginBottom: '2rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#CC1818',
    border: '1px solid #CC1818',
    padding: '0.25rem 0.75rem',
    marginBottom: '1.5rem',
  },
  heading: {
    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
    fontWeight: 400,
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#1A1A1A',
    lineHeight: 1.15,
    marginBottom: '1rem',
  },
  subheading: {
    fontSize: '1.05rem',
    color: '#333',
    lineHeight: 1.8,
    marginBottom: '1.5rem',
    fontStyle: 'italic',
  },
  sectionLabel: {
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#CC1818',
    marginBottom: '0.75rem',
  },
  question: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 400,
    fontFamily: "'Playfair Display', Georgia, serif",
    color: '#1A1A1A',
    lineHeight: 1.3,
    marginBottom: '0.5rem',
  },
  hint: {
    fontSize: '0.92rem',
    color: '#444',
    fontStyle: 'italic',
    marginBottom: '1rem',
    lineHeight: 1.6,
  },
  textarea: {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #D8D2C8',
    borderRadius: 0,
    color: '#1A1A1A',
    fontSize: '0.95rem',
    padding: '1rem 3.5rem 1rem 1rem',
    lineHeight: 1.8,
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  input: {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #D8D2C8',
    borderRadius: 0,
    color: '#1A1A1A',
    fontSize: '0.95rem',
    padding: '0.9rem 3.5rem 0.9rem 1rem',
    outline: 'none',
  },
  micBtn: {
    position: 'absolute',
    right: '0.75rem',
    top: '0.75rem',
    border: 'none',
    borderRadius: '50%',
    width: '2rem',
    height: '2rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  },
  primaryBtn: {
    background: '#CC1818',
    color: '#FFFFFF',
    border: 'none',
    padding: '0.85rem 2rem',
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    fontFamily: "'Playfair Display', Georgia, serif",
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'opacity 0.15s',
  },
  backBtn: {
    background: 'transparent',
    border: '1px solid #C8C2B8',
    color: '#444',
    padding: '0.7rem 1.25rem',
    fontSize: '0.82rem',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.05em',
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #D8D2C8',
    padding: '1.5rem',
    marginTop: '1.5rem',
  },
  cardLabel: {
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#CC1818',
    marginBottom: '0.5rem',
  },
  promptBox: {
    background: '#F5F1EB',
    border: '1px solid #D8D2C8',
    borderLeft: '3px solid #CC1818',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
  },
  copyBtn: {
    background: 'transparent',
    border: '1px solid #C8C2B8',
    color: '#888',
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    letterSpacing: '0.05em',
  },
  reviewItem: {
    padding: '1rem 0',
    borderBottom: '1px solid #D8D2C8',
  },
  reviewSection: {
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: '#CC1818',
    marginBottom: '0.25rem',
  },
  reviewQuestion: {
    fontSize: '0.95rem',
    color: '#444',
    marginBottom: '0.4rem',
  },
  reviewAnswer: {
    fontSize: '1rem',
    color: '#1A1A1A',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
  },
  progressBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: '#D8D2C8',
    zIndex: 100,
  },
  progressFill: {
    height: '100%',
    background: '#CC1818',
    transition: 'width 0.4s ease',
  },
};
