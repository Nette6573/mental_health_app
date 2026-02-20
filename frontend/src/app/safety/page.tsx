"use client";

import Link from "next/link";
import styles from "./safety.module.css";

const NATIONAL_HELPLINE = {
  name: "Jamaica Mental Health & Suicide Prevention Helpline",
  phone: "888-NEW-LIFE (639-5433)",
  description: "Official Ministry of Health & Wellness 24/7 nationwide support."
};

export default function SafetyPage() {
  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <Link href="/paula" className={styles.backLink}>
          ← Back to Chat
        </Link>
        <h1 className={styles.title}>🆘 Crisis Support Resources</h1>
        <p className={styles.subtitle}>
          If you are in immediate danger, call <strong>119</strong> now.
        </p>
      </div>

      {/* Emergency Section */}
      <div className={styles.emergencySection}>
        <a href="tel:119" className={styles.emergencyButton}>
          📞 Call 119 Now
        </a>
      </div>

      {/* National Helpline */}
      <div className={styles.helplineCard}>
        <h2>{NATIONAL_HELPLINE.name}</h2>
        <p><strong>{NATIONAL_HELPLINE.phone}</strong></p>
        <p>{NATIONAL_HELPLINE.description}</p>
        <a href="tel:8886395433" className={styles.callButton}>
          📞 Call 888-NEW-LIFE
        </a>
      </div>

      {/* Guidance Section */}
      <div className={styles.guidance}>
        <h3>📌 What to Do in a Crisis</h3>
        <ul>
          <li>Call <strong>119</strong> if someone is in immediate danger</li>
          <li>Stay with the person until help arrives</li>
          <li>Remove harmful objects if safe to do so</li>
          <li>Listen calmly without judgment</li>
          <li>Contact a crisis helpline for guidance</li>
        </ul>
      </div>

      <div className={styles.footer}>
        <p>
          Paula is not a medical professional. If you need urgent care, 
          please contact emergency services or a licensed healthcare provider.
        </p>
        <Link href="/paula" className={styles.footerLink}>
          Return to Chat
        </Link>
      </div>
    </div>
  );
}
