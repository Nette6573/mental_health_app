"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./safety.module.css";


// Emergency contacts data
const emergencyContacts = [
  {
    name: "📞 Emergency Services",
    phone: "119",
    description: "For immediate police, fire, or medical emergency",
    priority: "highest",
    bgColor: "#dc2626"
  },
  {
    name: "🇯🇲 Crisis Hotline (Jamaica)",
    phone: "+1-888-ONE-LOVE (666-5683)",
    description: "24/7 crisis support and emotional assistance",
    priority: "high"
  },
  {
    name: "🧠 Mental Health Emergency",
    phone: "+1-876-619-1234",
    description: "Immediate mental health crisis intervention",
    priority: "high"
  },
  {
    name: "🆘 Suicide Prevention",
    phone: "+1-888-554-HELP (4357)",
    description: "Confidential support for suicide prevention",
    priority: "high"
  },
  {
    name: "💊 Substance Abuse",
    phone: "+1-876-946-HELP (4357)",
    description: "Support for substance abuse and addiction",
    priority: "medium"
  },
  {
    name: "👶 Child Helpline",
    phone: "+1-888-246-HELP (4357)",
    description: "Support for children and youth in crisis",
    priority: "medium"
  }
];

// Hospital data
const hospitalData = {
  national: {
    mental_health_helpline: {
      name: "Jamaica Mental Health & Suicide Prevention Helpline",
      phone: "888-NEW-LIFE (639-5433)",
      type: "helpline",
      coverage: "nationwide",
      hours: "24/7",
      notes: "Official Ministry of Health & Wellness helpline for mental health and suicide prevention."
    }
  },
  parishes: [
    {
      parish: "Kingston & St. Andrew",
      hospitals: [
        {
          name: "Kingston Public Hospital",
          type: "public_general",
          address: "North Street, Kingston, Jamaica",
          phone: null,
          services: ["emergency", "general_medical", "some_psychiatric_support"]
        },
        {
          name: "University Hospital of the West Indies",
          type: "teaching_hospital",
          address: "Mona, Kingston 7, Jamaica",
          phone: null,
          services: ["emergency", "inpatient", "psychiatry_clinic"]
        },
        {
          name: "Bustamante Hospital for Children",
          type: "public_children",
          address: "Arthur Wint Drive, Kingston 5, Jamaica",
          phone: null,
          services: ["pediatrics", "emergency"]
        },
        {
          name: "Bellevue Hospital",
          type: "public_psychiatric",
          address: "16½ Windward Road, Kingston 2, Jamaica",
          phone: "(876) 928-1380-9",
          services: [
            "acute_psychiatric_care",
            "inpatient_mental_health",
            "psychological_services",
            "rehabilitation"
          ]
        }
      ],
      mental_health_facilities: [
        {
          name: "Bellevue Hospital Psychological Services",
          type: "public_psychiatric_service",
          address: "16½ Windward Road, Kingston 2, Jamaica",
          phone: "(876) 928-1380-9",
          notes: "Psychological and psychiatric services through Bellevue Hospital."
        },
        {
          name: "Shekinah House",
          type: "private_clinic",
          address: "Unit 28, 2 Seymour Avenue, Kingston 6, Jamaica",
          phone: "(876) 946-0719",
          services: [
            "psychiatry",
            "psychology",
            "family_and_marital_counselling",
            "child_and_adolescent_psychiatry"
          ]
        }
      ],
      psychologists_and_counsellors: [
        {
          name: "Shekinah House – Psychiatry & Psychology Team",
          profession: ["psychiatrist", "psychologist"],
          address: "Unit 28, 2 Seymour Avenue, Kingston 6, Jamaica",
          phone: "(876) 946-0719",
          website: "https://www.shekinahhousejm.com",
          notes: "Private multidisciplinary team offering psychiatry, psychology and counselling."
        }
      ],
      churches: []
    },
    {
      parish: "Manchester",
      hospitals: [
        {
          name: "Mandeville Regional Hospital",
          type: "public_general",
          address: "Mandeville, Manchester, Jamaica",
          phone: null,
          services: ["emergency", "inpatient", "outpatient"]
        },
        {
          name: "Percy Junor Hospital",
          type: "public_general",
          address: "Spalding, Clarendon/Manchester border, Jamaica",
          phone: null,
          services: ["emergency", "general_medical"]
        },
        {
          name: "Hargreaves Memorial Hospital",
          type: "private_hospital",
          address: "Mandeville, Manchester, Jamaica",
          phone: null,
          services: ["private_medical_care"]
        }
      ],
      mental_health_facilities: [
        {
          name: "Heartland Psychological Services",
          type: "private_practice",
          address: "Mandeville, Manchester, Jamaica",
          phone: "876-236-1680",
          services: [
            "psychological_assessment",
            "therapy",
            "counselling"
          ],
          notes: undefined
        }
      ],
      psychologists_and_counsellors: [
        {
          name: "Heartland Psychological Services",
          profession: ["psychologist"],
          address: "Mandeville, Manchester, Jamaica",
          phone: "876-236-1680",
          website: "",
          notes: "Private psychological services, emotional healing and counselling."
        }
      ],
      churches: []
    },
    {
      parish: "St. James",
      hospitals: [
        {
          name: "Cornwall Regional Hospital",
          type: "public_general",
          address: "Mount Salem, Montego Bay, St. James, Jamaica",
          phone: null,
          services: ["emergency", "inpatient", "outpatient"]
        },
        {
          name: "Falmouth Hospital",
          type: "public_general",
          address: "Falmouth, Trelawny (serves nearby parishes)",
          phone: null,
          services: ["emergency", "general_medical"]
        }
      ],
      mental_health_facilities: [
        {
          name: "CUMI Rehabilitation Day Centre",
          type: "rehabilitation_centre",
          address: "Montego Bay, St. James, Jamaica",
          phone: null,
          services: [
            "community_mental_health_rehabilitation",
            "counselling",
            "day_programmes"
          ],
          notes: undefined
        },
        {
          name: "Fairview Medical & Dental Centre – Mental Health Services",
          type: "medical_centre",
          address: "Fairview, Montego Bay, St. James, Jamaica",
          phone: null,
          services: ["psychiatry", "psychology", "counselling"],
          notes: undefined
        }
      ],
      psychologists_and_counsellors: [],
      churches: []
    },
    {
      parish: "Clarendon",
      hospitals: [
        {
          name: "May Pen Hospital",
          type: "public_general",
          address: "May Pen, Clarendon, Jamaica",
          phone: null,
          services: ["emergency", "inpatient", "outpatient"]
        },
        {
          name: "Chapelton Hospital",
          type: "public_general",
          address: "Chapelton, Clarendon, Jamaica",
          phone: null,
          services: ["emergency", "general_medical"]
        },
        {
          name: "Lionel Town Community Hospital",
          type: "public_general",
          address: "Lionel Town, Clarendon, Jamaica",
          phone: null,
          services: ["emergency", "general_medical"]
        }
      ],
      mental_health_facilities: [],
      psychologists_and_counsellors: [],
      churches: []
    }
  ]
};

export default function SafetyPage() {
  const [selectedParish, setSelectedParish] = useState<string>("all");
  const [showOnlyMentalHealth, setShowOnlyMentalHealth] = useState<boolean>(false);

  const parishes = ["all", ...hospitalData.parishes.map(p => p.parish)];

  const filteredParishes = selectedParish === "all" 
    ? hospitalData.parishes 
    : hospitalData.parishes.filter(p => p.parish === selectedParish);

// Helper function to format service names
const formatService = (service: string): string => {
  const serviceMap: Record<string, string> = {
    emergency: "🚑 Emergency",
    general_medical: "🏥 General Medical",
    some_psychiatric_support: "🧠 Psychiatric Support",
    inpatient: "🏥 Inpatient Care",
    outpatient: "🚶 Outpatient Services",
    psychiatry_clinic: "🧠 Psychiatry Clinic",
    pediatrics: "👶 Pediatrics",
    acute_psychiatric_care: "⚕️ Acute Psychiatric Care",
    inpatient_mental_health: "🏥 Inpatient Mental Health",
    psychological_services: "🧠 Psychological Services",
    rehabilitation: "🔄 Rehabilitation",
    psychiatry: "🧠 Psychiatry",
    psychology: "🧠 Psychology",
    family_and_marital_counselling: "👪 Family & Marital Counselling",
    child_and_adolescent_psychiatry: "🧒 Child & Adolescent Psychiatry",
    psychological_assessment: "📋 Psychological Assessment",
    therapy: "💭 Therapy",
    counselling: "🗣️ Counselling",
    community_mental_health_rehabilitation: "🤝 Community Mental Health Rehab",
    day_programmes: "☀️ Day Programmes",
    private_medical_care: "💼 Private Medical Care"
  };
  return serviceMap[service] || service.replace(/_/g, ' ');
};

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/paula" className={styles.backLink}>
          ← Back to Chat
        </Link>
        <h1 className={styles.title}>🆘 Crisis Support Resources</h1>
        <p className={styles.subtitle}>
          If you&apos;re in immediate danger, call <strong className={styles.emergencyNumber}>119</strong> or go to your nearest hospital
        </p>
      </div>

      {/* Emergency Contacts Grid */}
      <div className={styles.emergencyGrid}>
        {emergencyContacts.map((contact, index) => (
          <div 
            key={index} 
            className={`${styles.emergencyCard} ${styles[`priority${contact.priority}`]} ${contact.bgColor ? styles.customBgColor : ''}`}
          >
            <div className={styles.emergencyHeader}>
              <span className={styles.emergencyName}>{contact.name}</span>
              {contact.priority === "highest" && (
                <span className={styles.urgentBadge}>🚨 URGENT</span>
              )}
            </div>
            <div className={styles.emergencyPhone}>
              <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} className={styles.phoneLink}>
                {contact.phone}
              </a>
            </div>
            <p className={styles.emergencyDescription}>{contact.description}</p>
          </div>
        ))}
      </div>

      {/* National Helpline - Always Visible */}
      <div className={styles.nationalHelpline}>
        <div className={styles.helplineCard}>
          <div className={styles.helplineIcon}>📞</div>
          <div>
            <h2 className={styles.helplineName}>
              {hospitalData.national.mental_health_helpline.name}
            </h2>
            <p className={styles.helplinePhone}>
              <strong>{hospitalData.national.mental_health_helpline.phone}</strong>
            </p>
            <p className={styles.helplineDetails}>
              {hospitalData.national.mental_health_helpline.hours} • Nationwide
            </p>
            <p className={styles.helplineNotes}>
              {hospitalData.national.mental_health_helpline.notes}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className={styles.tipsSection}>
        <h3 className={styles.tipsTitle}>📌 What to Do in a Crisis</h3>
        <div className={styles.tipsGrid}>
          <div className={styles.tipCard}>
            <span className={styles.tipIcon}>1️⃣</span>
            <p className={styles.tipText}>Call <strong>119</strong> if you or someone else is in immediate danger</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipIcon}>2️⃣</span>
            <p className={styles.tipText}>Stay with the person until help arrives</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipIcon}>3️⃣</span>
            <p className={styles.tipText}>Remove any weapons or harmful objects</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipIcon}>4️⃣</span>
            <p className={styles.tipText}>Listen without judgment</p>
          </div>
          <div className={styles.tipCard}>
            <span className={styles.tipIcon}>5️⃣</span>
            <p className={styles.tipText}>Call a crisis hotline for guidance</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="parish-select" className={styles.filterLabel}>
            Select Parish:
          </label>
          <select
            id="parish-select"
            value={selectedParish}
            onChange={(e) => setSelectedParish(e.target.value)}
            className={styles.select}
          >
            {parishes.map((parish) => (
              <option key={parish} value={parish}>
                {parish === "all" ? "All Parishes" : parish}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showOnlyMentalHealth}
              onChange={(e) => setShowOnlyMentalHealth(e.target.checked)}
              className={styles.checkbox}
            />
            Show only mental health facilities
          </label>
        </div>
      </div>

      {/* Parish Cards */}
      <div className={styles.parishGrid}>
        {filteredParishes.map((parish) => (
          <div key={parish.parish} className={styles.parishCard}>
            <h2 className={styles.parishName}>{parish.parish}</h2>

            {/* Hospitals */}
            {!showOnlyMentalHealth && parish.hospitals.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🏥 Hospitals</h3>
                <div className={styles.facilityList}>
                  {parish.hospitals.map((hospital, idx) => (
                    <div key={idx} className={styles.facilityItem}>
                      <div className={styles.facilityHeader}>
                        <span className={styles.facilityName}>{hospital.name}</span>
                        {hospital.type && (
                          <span className={styles.facilityType}>
                            {hospital.type.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                      <p className={styles.facilityAddress}>📍 {hospital.address}</p>
                      {hospital.phone && (
                        <p className={styles.facilityPhone}>📞 {hospital.phone}</p>
                      )}
                      {hospital.services && hospital.services.length > 0 && (
                        <div className={styles.servicesList}>
                          {hospital.services.map((service, sidx) => (
                            <span key={sidx} className={styles.serviceTag}>
                              {formatService(service)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mental Health Facilities */}
            {parish.mental_health_facilities.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>🧠 Mental Health Facilities</h3>
                <div className={styles.facilityList}>
                  {parish.mental_health_facilities.map((facility, idx) => (
                    <div key={idx} className={styles.facilityItem}>
                      <div className={styles.facilityHeader}>
                        <span className={styles.facilityName}>{facility.name}</span>
                        <span className={styles.facilityType}>
                          {facility.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className={styles.facilityAddress}>📍 {facility.address}</p>
                      {facility.phone && (
                        <p className={styles.facilityPhone}>📞 {facility.phone}</p>
                      )}
                      {facility.services && facility.services.length > 0 && (
                        <div className={styles.servicesList}>
                          {facility.services.map((service, sidx) => (
                            <span key={sidx} className={styles.serviceTag}>
                              {formatService(service)}
                            </span>
                          ))}
                        </div>
                      )}
                      {facility.notes && (
                        <p className={styles.facilityNotes}>📝 {facility.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Psychologists & Counsellors */}
            {parish.psychologists_and_counsellors.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>👥 Psychologists & Counsellors</h3>
                <div className={styles.facilityList}>
                  {parish.psychologists_and_counsellors.map((professional, idx) => (
                    <div key={idx} className={styles.facilityItem}>
                      <div className={styles.facilityHeader}>
                        <span className={styles.facilityName}>{professional.name}</span>
                        <span className={styles.facilityType}>
                          {professional.profession?.join(', ')}
                        </span>
                      </div>
                      <p className={styles.facilityAddress}>📍 {professional.address}</p>
                      <p className={styles.facilityPhone}>📞 {professional.phone}</p>
                      {professional.website && (
                        <p className={styles.facilityWebsite}>
                          🌐 <a href={professional.website} target="_blank" rel="noopener noreferrer">
                            {professional.website}
                          </a>
                        </p>
                      )}
                      {professional.notes && (
                        <p className={styles.facilityNotes}>📝 {professional.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No facilities message */}
            {(!parish.hospitals.length && !parish.mental_health_facilities.length && !parish.psychologists_and_counsellors.length) && (
              <p className={styles.noFacilities}>
                No facilities listed for this parish yet.
              </p>
            )}
      </div>
    ))}
  </div>

  {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerText}>
          Need immediate help? Call <strong>119</strong> or one of the crisis hotlines above.
        </p>
        <div className={styles.footerButtons}>
          <a href="tel:119" className={styles.emergencyButton}>
            📞 Call 119 Now
          </a>
          <Link href="/paula" className={styles.footerLink}>
            Return to Chat with Paula
          </Link>
        </div>
      </div>
    </div>
  );
}