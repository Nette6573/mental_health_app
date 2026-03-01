"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import styles from "./safety.module.css";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ProfessionalBody {
  name: string;
  description: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  services: string[];
  type: string;
}

interface Helpline {
  name: string;
  phone: string;
  description: string;
  type: string;
}

interface MentalHealthResource {
  parish: string;
  facility: string;
  type: string;
  address: string;
  contact: string;
  services: string[];
  category: string;
  practitioner?: string;
  email?: string;
  emergency?: string[];
  notes?: string;
  website?: string;
}

interface FacilityCategory {
  id: string;
  label: string;
}

// ============================================================================
// PROFESSIONAL ORGANIZATIONS & NATIONAL RESOURCES
// ============================================================================

const PROFESSIONAL_BODIES: ProfessionalBody[] = [
  {
    name: "Jamaica Psychological Society",
    description: "The professional body for psychologists in Jamaica. Can provide referrals to registered practitioners across the island.",
    website: "https://www.jamaicapsychsociety.org",
    email: "info@jamaicapsychsociety.org",
    services: ["Psychologist Referrals", "Professional Directory", "Continuing Education"],
    type: "Professional Association"
  },
  {
    name: "Jamaica Association of Guidance Counsellors in Education",
    description: "Professional association for guidance counsellors working in educational institutions across Jamaica.",
    services: ["Guidance Counsellor Referrals", "School Counseling Support"],
    type: "Professional Association"
  },
  {
    name: "Ministry of Health & Wellness - Mental Health Unit",
    description: "Government body overseeing mental health services nationwide. Can provide information on public mental health facilities.",
    phone: "876-633-8175",
    address: "2-4 King Street, Kingston",
    website: "www.moh.gov.jm",
    services: ["Mental Health Policy", "Public Facility Information", "Resource Coordination"],
    type: "Government Agency"
  }
];

const NATIONAL_HELPLINES: Helpline[] = [
  {
    name: "Jamaica Mental Health & Suicide Prevention Helpline",
    phone: "888-NEW-LIFE (639-5433)",
    description: "Official Ministry of Health & Wellness 24/7 nationwide support. Call volume has increased from 888 calls in 2019 to nearly 3,000 calls in 2024.",
    type: "24/7 Helpline"
  },
  {
    name: "U-Matter Chatline",
    phone: "Text 'SUPPORT' to 876-838-4897",
    description: "For youth ages 16-24. Also available via Instagram and Facebook Messenger @ureportjamaica.",
    type: "Youth Chatline"
  },
  {
    name: "888-SAFE-SPOT",
    phone: "888-723-3776",
    description: "Mental health support line",
    type: "Helpline"
  },
  {
    name: "Health Emergency Operations Centre",
    phone: "888-ONE-LOVE (888-663-5683)",
    description: "For health emergency information and support",
    type: "Emergency Support"
  },
  {
    name: "Crisis Centre of Jamaica",
    phone: "876-631-5244",
    description: "Crisis intervention and support services",
    type: "Crisis Support"
  },
  {
    name: "Emergency Services",
    phone: "119",
    description: "For immediate danger or life-threatening emergencies",
    type: "Emergency"
  }
];

// ============================================================================
// COMPREHENSIVE MENTAL HEALTH FACILITIES DATABASE
// ============================================================================

const MENTAL_HEALTH_RESOURCES: MentalHealthResource[] = [
  // ===== KINGSTON & ST. ANDREW =====
  {
    parish: "Kingston & St. Andrew",
    facility: "Bellevue Hospital",
    type: "Psychiatric Hospital",
    address: "16 1/2 Windward Road, Kingston 2",
    contact: "876-938-1211-9",
    services: ["Psychiatric Evaluation", "Inpatient Psychiatric Care", "Outpatient Clinics", "Forensic Psychiatry", "Child & Adolescent Services", "Crisis Intervention", "Therapy"],
    category: "hospital"
  },
  {
    parish: "Kingston & St. Andrew",
    facility: "University Hospital of the West Indies",
    type: "Teaching Hospital",
    address: "Mona, Kingston 7",
    contact: "876-927-1620",
    services: ["Psychiatry Department", "Child Guidance Clinic", "Psychology Services", "Emergency Care", "Outpatient Clinics"],
    category: "hospital"
  },
  {
    parish: "Kingston & St. Andrew",
    facility: "Kingston Public Hospital",
    type: "General Hospital",
    address: "North Street, Kingston",
    contact: "876-922-0210",
    services: ["Emergency Services", "Psychiatric Support", "General Healthcare", "Psychiatric Emergency Care", "Inpatient Psychiatry"],
    category: "hospital"
  },
  {
    parish: "Kingston & St. Andrew",
    facility: "Bustamante Hospital for Children",
    type: "Children's Hospital",
    address: "Arthur Wint Drive, Kingston 5",
    contact: "Contact for mental health services",
    services: ["Medical Social Worker Program", "Pediatric Psychology Support", "General Medicine", "Cardiology", "Neurology", "Asthma Care", "Nephrology", "Dermatology", "Rheumatology", "General Surgery", "Neurosurgery", "Orthopedics", "Urology", "ENT", "Plastic and Burns", "Ophthalmology"],
    category: "hospital",
    notes: "Provides medical social work support for children and families"
  },
  {
    parish: "Kingston & St. Andrew",
    facility: "Shekinah House",
    type: "Private Clinic",
    address: "Unit 28, 2 Seymour Avenue, Kingston 6",
    contact: "876-946-0719",
    services: ["Psychiatry", "Psychology", "Family & Marital Counseling", "Individual Therapy"],
    category: "private_practice",
    notes: "Practitioners: Psychiatrists, Psychologists, Counselors"
  },
  {
    parish: "Kingston & St. Andrew",
    facility: "Sonia Wynter - Clinical Psychologist",
    type: "Private Practice",
    address: "4 Evans Avenue, Kingston 8",
    contact: "876-823-5897",
    services: ["Individual Therapy", "Couples Therapy", "Family Therapy", "Clinical Psychology"],
    category: "private_practice",
    practitioner: "Clinical Psychologist"
  },
  {
    parish: "Kingston & St. Andrew",
    facility: "Dr. Eulalee Thompson",
    type: "Private Practice",
    address: "Kingston",
    contact: "876-275-2430 (WhatsApp)",
    services: ["Counseling", "Therapy for Adults", "Therapy for Teens"],
    category: "private_practice",
    practitioner: "Counselor/Therapist"
  },
  {
    parish: "Kingston & St. Andrew",
    facility: "Centred",
    type: "Psychology Practice",
    address: "Kingston",
    contact: "Contact for appointments",
    services: ["Therapy for Adults", "Therapy for Adolescents", "Family Therapy", "Co-Parent Mediation"],
    category: "private_practice"
  },
  {
    parish: "Kingston & St. Andrew",
    facility: "Life Empowerment Counseling Services",
    type: "Private Practice",
    address: "Kingston",
    contact: "Contact for appointments",
    services: ["Therapy", "Coaching", "Behavioral Transformation", "Counseling"],
    category: "private_practice"
  },
  {
    parish: "Kingston & St. Andrew",
    facility: "Kingston Health Department",
    type: "Community Mental Health",
    address: "23-27 1/2 Charles Street, Kingston",
    contact: "876-922-0740",
    services: ["Community Mental Health Services", "Outreach Programs", "Mental Health Clinics"],
    category: "community"
  },
  
  // ===== ST. JAMES =====
  {
    parish: "St. James",
    facility: "Cornwall Regional Hospital",
    type: "Regional Hospital",
    address: "Mount Salem, Montego Bay",
    contact: "876-952-5100-9",
    services: ["Psychiatry Department", "24-hour Casualty", "Inpatient Psychiatric Care", "Outpatient Clinics", "Emergency Mental Health Care"],
    category: "hospital"
  },
  {
    parish: "St. James",
    facility: "St. James Child and Adolescent Wellness Centre",
    type: "Youth Mental Health Centre",
    address: "1 Humber Avenue (Corinaldi Avenue Primary School Teachers' Cottage), Montego Bay",
    contact: "Contact Cornwall Regional Hospital for referral",
    services: ["Individual Psychotherapy", "Family Therapy", "Social Work Support", "Psychiatric Services for Youth", "Early Intervention"],
    category: "specialized",
    notes: "Opened January 2025. Serves youth in Western Jamaica. 20% of Jamaican children suffer from mental health disorders including depression, anxiety, ADHD, PTSD, and conduct disorders."
  },
  {
    parish: "St. James",
    facility: "City Spirit",
    type: "Crisis & Support Centre",
    address: "2 Lawrence Lane (corner of Church & Orange Streets), Montego Bay",
    contact: "Contact St. James Health Department",
    services: ["General Mental Health Services", "Drug Abuse Assessment", "Home Visitation", "Advocacy", "Family Support", "Services for Homeless", "Meals", "Bathing Facilities", "Referrals"],
    category: "specialized"
  },
  {
    parish: "St. James",
    facility: "CUMI Rehabilitation Day Centre",
    type: "Rehabilitation Centre",
    address: "Montego Bay",
    contact: "876-940-1234",
    services: ["Mental Health Rehabilitation", "Counseling Services", "Community Reintegration"],
    category: "rehabilitation"
  },
  {
    parish: "St. James",
    facility: "Fairview Medical & Dental Centre",
    type: "Medical Centre",
    address: "Montego Bay",
    contact: "876-940-5678",
    services: ["Psychiatry", "Psychology", "Counseling Services", "Medical Care"],
    category: "private_practice"
  },
  {
    parish: "St. James",
    facility: "St. James Health Department",
    type: "Community Mental Health",
    address: "Payne Street, Montego Bay",
    contact: "876-979-7820-4",
    services: ["Community Mental Health Services", "Child Guidance", "HIV/AIDS Counseling", "Adolescent Health", "Outreach Services"],
    category: "community"
  },
  {
    parish: "St. James",
    facility: "Montego Bay Comprehensive Health Centre",
    type: "Type V Health Centre",
    address: "Creek Street, Montego Bay",
    contact: "876-979-7820",
    services: ["Mental Health Services", "Primary Care"],
    category: "health_centre"
  },
  {
    parish: "St. James",
    facility: "Catherine Hall Health Centre",
    type: "Health Centre",
    address: "Westgreen, Catherine Hall",
    contact: "876-952-0396",
    services: ["Mental Health Services", "Primary Care"],
    category: "health_centre"
  },
  {
    parish: "St. James",
    facility: "Granville Health Centre",
    type: "Health Centre",
    address: "Granville Drive, Granville",
    contact: "876-979-9548",
    services: ["Mental Health Services"],
    category: "health_centre"
  },
  
  // ===== MANCHESTER =====
  {
    parish: "Manchester",
    facility: "Heartland Psychological Services",
    type: "Private Practice",
    address: "Mandeville",
    contact: "876-236-1680",
    services: ["Psychological Services", "Emotional Healing", "Improved Health Outcomes", "Therapy"],
    category: "private_practice"
  },
  {
    parish: "Manchester",
    facility: "Mandeville Regional Hospital",
    type: "Regional Hospital",
    address: "33 Hargreaves Avenue, Mandeville",
    contact: "876-962-2060",
    services: ["Psychiatric Unit", "Mental Health Services", "Emergency Care"],
    category: "hospital"
  },
  {
    parish: "Manchester",
    facility: "Manchester Health Department",
    type: "Community Mental Health",
    address: "Manchester Road, Mandeville",
    contact: "876-962-2572",
    services: ["Community Mental Health", "Outreach Services"],
    category: "community"
  },
  {
    parish: "Manchester",
    facility: "Percy Junor Hospital",
    type: "General Hospital",
    address: "Spalding",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  {
    parish: "Manchester",
    facility: "Hargreaves Memorial Hospital",
    type: "Private Hospital",
    address: "Mandeville",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  
  // ===== ST. CATHERINE =====
  {
    parish: "St. Catherine",
    facility: "Spanish Town Hospital",
    type: "General Hospital",
    address: "Wheatley Street, Spanish Town",
    contact: "876-984-3055",
    services: ["Psychiatric Unit", "Emergency Mental Health Care", "Inpatient Care"],
    category: "hospital"
  },
  {
    parish: "St. Catherine",
    facility: "St. Catherine Health Department",
    type: "Community Mental Health",
    address: "54-56 Young Street, Spanish Town",
    contact: "876-984-3070-4",
    services: ["Community Mental Health", "Outreach Services"],
    category: "community"
  },
  {
    parish: "St. Catherine",
    facility: "Portmore Health Centre",
    type: "Health Centre",
    address: "Portmore Pines Plaza, Portmore",
    contact: "876-949-4242",
    services: ["Mental Health Clinic", "Counseling Services"],
    category: "health_centre"
  },
  {
    parish: "St. Catherine",
    facility: "Linstead Hospital",
    type: "General Hospital",
    address: "Linstead",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  
  // ===== CLARENDON =====
  {
    parish: "Clarendon",
    facility: "May Pen Hospital",
    type: "General Hospital",
    address: "Chapelton Road, May Pen",
    contact: "876-986-2563",
    services: ["Psychiatric Care", "Emergency Mental Health", "Inpatient Care"],
    category: "hospital",
    notes: "Mental health team includes 6 nurses serving 32 health centres and 3 hospitals, providing house-to-house visits for 650+ patients and child & adolescent clinics."
  },
  {
    parish: "Clarendon",
    facility: "Lionel Town Community Hospital",
    type: "General Hospital",
    address: "Lionel Town",
    contact: "876-986-2348",
    services: ["Mental Health Clinic", "Emergency Services", "General Healthcare"],
    category: "hospital",
    notes: "Mental health clinic serving 150+ patients monthly"
  },
  {
    parish: "Clarendon",
    facility: "Clarendon Health Department",
    type: "Community Mental Health",
    address: "Chapelton Road, May Pen",
    contact: "876-986-2470",
    services: ["Community Mental Health", "House-to-House Visits", "Child & Adolescent Clinics", "Outreach"],
    category: "community"
  },
  {
    parish: "Clarendon",
    facility: "Chapelton Hospital",
    type: "General Hospital",
    address: "Chapelton",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  
  // ===== ST. ANN =====
  {
    parish: "St. Ann",
    facility: "St. Ann's Bay Regional Hospital",
    type: "Regional Hospital",
    address: "St. Ann's Bay",
    contact: "876-972-2272",
    services: ["Psychiatric Services", "Mental Health Care", "Emergency Care"],
    category: "hospital"
  },
  {
    parish: "St. Ann",
    facility: "St. Ann Health Department",
    type: "Community Mental Health",
    address: "St. Ann's Bay",
    contact: "876-972-0146",
    services: ["Community Mental Health", "Outreach Services"],
    category: "community"
  },
  {
    parish: "St. Ann",
    facility: "St. Ann Infirmary",
    type: "Residential Care",
    address: "St. Ann's Bay",
    contact: "Contact St. Ann Municipal Corporation",
    services: ["Mental Health Care", "Physical Care", "Psychological Care", "Occupational Therapy"],
    category: "residential",
    notes: "Residents seen weekly by Medical Doctor and Mental Health Officer"
  },
  {
    parish: "St. Ann",
    facility: "Alexandria Community Hospital",
    type: "General Hospital",
    address: "Alexandria",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  
  // ===== ST. ELIZABETH =====
  {
    parish: "St. Elizabeth",
    facility: "St. Elizabeth Health Department",
    type: "Community Mental Health",
    address: "Black River",
    contact: "876-965-2212 (main)",
    emergency: ["876-778-6124", "876-793-5087"],
    services: ["Mental Health Team", "Crisis Intervention", "School Support Counseling", "Community Outreach"],
    category: "community",
    notes: "Exploring establishment of interim mental health facility to strengthen crisis response"
  },
  {
    parish: "St. Elizabeth",
    facility: "Black River Hospital",
    type: "General Hospital",
    address: "Black River",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  {
    parish: "St. Elizabeth",
    facility: "Santa Cruz Hospital",
    type: "General Hospital",
    address: "Santa Cruz",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  
  // ===== WESTMORELAND =====
  {
    parish: "Westmoreland",
    facility: "Savanna-la-Mar Public General Hospital",
    type: "General Hospital",
    address: "Savanna-la-Mar",
    contact: "876-955-2530",
    services: ["Mental Health Services", "Emergency Care", "General Healthcare"],
    category: "hospital"
  },
  {
    parish: "Westmoreland",
    facility: "Westmoreland Health Department",
    type: "Community Mental Health",
    address: "Savanna-la-Mar",
    contact: "876-955-2166",
    services: ["Community Mental Health", "Outreach Services"],
    category: "community"
  },
  {
    parish: "Westmoreland",
    facility: "Negril Community Hospital",
    type: "General Hospital",
    address: "Negril",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  
  // ===== HANOVER =====
  {
    parish: "Hanover",
    facility: "Noel Holmes Hospital",
    type: "General Hospital",
    address: "Fort Charlotte Drive, Lucea",
    contact: "876-956-2733",
    services: ["Accident & Emergency", "Internal Medicine", "Inpatient Care", "Mental Health Services through Health Department"],
    category: "hospital"
  },
  {
    parish: "Hanover",
    facility: "Hanover Health Department",
    type: "Community Mental Health",
    address: "Fort Charlotte Drive, Lucea",
    contact: "876-956-2633 / 876-956-2704",
    email: "hanover@wrha.gov.jm",
    services: ["Mental Health Services", "Community Outreach", "Environmental Health"],
    category: "community"
  },
  {
    parish: "Hanover",
    facility: "Lucea Health Centre",
    type: "Type IV Health Centre",
    address: "Fort Charlotte Dr., Lucea",
    contact: "876-956-2704",
    services: ["Mental Health Services"],
    category: "health_centre"
  },
  {
    parish: "Hanover",
    facility: "Green Island Health Centre",
    type: "Type III Health Centre",
    address: "Green Island P.O.",
    contact: "876-956-9232",
    services: ["Mental Health Services"],
    category: "health_centre"
  },
  {
    parish: "Hanover",
    facility: "Hopewell Health Centre",
    type: "Type III Health Centre",
    address: "Hopewell P.O.",
    contact: "876-956-5297",
    services: ["Mental Health Services"],
    category: "health_centre"
  },
  {
    parish: "Hanover",
    facility: "Askenish Health Centre",
    type: "Type II Health Centre",
    address: "Askenish",
    contact: "876-774-8270",
    services: ["Primary Care", "Mental Health Referrals"],
    category: "health_centre"
  },
  {
    parish: "Hanover",
    facility: "Cascade Health Centre",
    type: "Type II Health Centre",
    address: "Cascade",
    contact: "876-694-0186",
    services: ["Primary Care", "Mental Health Referrals"],
    category: "health_centre"
  },
  {
    parish: "Hanover",
    facility: "Cave Valley Health Centre",
    type: "Type II Health Centre",
    address: "Cave Valley",
    contact: "876-609-0302",
    services: ["Primary Care", "Mental Health Referrals"],
    category: "health_centre"
  },
  {
    parish: "Hanover",
    facility: "Chester Castle Health Centre",
    type: "Type II Health Centre",
    address: "Chester Castle",
    contact: "876-694-1335",
    services: ["Primary Care", "Mental Health Referrals"],
    category: "health_centre"
  },
  {
    parish: "Hanover",
    facility: "Dias Health Centre",
    type: "Type II Health Centre",
    address: "Dias",
    contact: "876-956-8928",
    services: ["Primary Care", "Mental Health Referrals"],
    category: "health_centre"
  },
  {
    parish: "Hanover",
    facility: "Sandy Bay Health Centre",
    type: "Type II Health Centre",
    address: "Sandy Bay",
    contact: "876-953-5964",
    services: ["Primary Care", "Mental Health Referrals"],
    category: "health_centre"
  },
  
  // ===== TRELAWNY =====
  {
    parish: "Trelawny",
    facility: "Falmouth Hospital",
    type: "General Hospital",
    address: "Falmouth",
    contact: "876-954-3250",
    services: ["Mental Health Services", "Emergency Care", "General Healthcare"],
    category: "hospital"
  },
  {
    parish: "Trelawny",
    facility: "Trelawny Health Department",
    type: "Community Mental Health",
    address: "Falmouth",
    contact: "876-954-3651",
    services: ["Community Mental Health", "Outreach Services"],
    category: "community"
  },
  {
    parish: "Trelawny",
    facility: "Trelawny Drop-In Centre",
    type: "Drop-In Centre",
    address: "Falmouth",
    contact: "Contact Trelawny Municipal Corporation",
    services: ["Counselling Services", "Meals", "Support Services", "Structured Activities"],
    category: "community",
    notes: "Serves average of 12-20+ persons daily. Provides counselling services and support for vulnerable persons."
  },
  {
    parish: "Trelawny",
    facility: "Duncans Hospital",
    type: "General Hospital",
    address: "Duncans",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  
  // ===== ST. MARY =====
  {
    parish: "St. Mary",
    facility: "Port Maria Hospital",
    type: "General Hospital",
    address: "Port Maria",
    contact: "876-994-4223",
    services: ["Mental Health Services", "Emergency Care", "General Healthcare"],
    category: "hospital"
  },
  {
    parish: "St. Mary",
    facility: "St. Mary Health Department",
    type: "Community Mental Health",
    address: "Port Maria",
    contact: "876-994-2181",
    services: ["Community Mental Health", "Outreach Services"],
    category: "community"
  },
  {
    parish: "St. Mary",
    facility: "Annotto Bay Hospital",
    type: "General Hospital",
    address: "Annotto Bay",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  
  // ===== PORTLAND =====
  {
    parish: "Portland",
    facility: "Port Antonio Hospital",
    type: "General Hospital",
    address: "Port Antonio",
    contact: "876-993-2646",
    services: ["Mental Health Services", "Emergency Care", "General Healthcare"],
    category: "hospital"
  },
  {
    parish: "Portland",
    facility: "Portland Health Department",
    type: "Community Mental Health",
    address: "Port Antonio",
    contact: "876-993-2637",
    services: ["Community Mental Health", "Outreach Services"],
    category: "community"
  },
  {
    parish: "Portland",
    facility: "Buff Bay Hospital",
    type: "General Hospital",
    address: "Buff Bay",
    contact: "Contact for services",
    services: ["Emergency Services", "General Healthcare"],
    category: "hospital"
  },
  
  // ===== ST. THOMAS =====
  {
    parish: "St. Thomas",
    facility: "Princess Margaret Hospital",
    type: "General Hospital",
    address: "Morant Bay",
    contact: "876-982-2252",
    services: ["Mental Health Services", "Emergency Care", "General Healthcare"],
    category: "hospital"
  },
  {
    parish: "St. Thomas",
    facility: "St. Thomas Health Department",
    type: "Community Mental Health",
    address: "Morant Bay",
    contact: "876-982-2287",
    services: ["Community Mental Health", "Outreach Services"],
    category: "community"
  },
  
  // ===== ONLINE / TELEHEALTH SERVICES =====
  {
    parish: "Online",
    facility: "TalktoAngel",
    type: "Online Therapy Platform",
    address: "Online - Available Nationwide",
    contact: "www.talktoangel.com",
    services: ["Online Therapy", "Mental Health Support", "Counseling"],
    category: "online",
    website: "www.talktoangel.com"
  },
  {
    parish: "Online",
    facility: "Latoya Deslandes Online Counseling",
    type: "Online Counseling",
    address: "Online - Available Nationwide",
    contact: "Contact via website",
    services: ["Therapy", "Coaching", "Emotional Support"],
    category: "online"
  },
  {
    parish: "Online",
    facility: "Clear Minds JA",
    type: "Online Counseling",
    address: "Online - Available Nationwide",
    contact: "Contact via website",
    services: ["Couples Therapy", "Sexual Health Counseling", "Mental Wellness Support"],
    category: "online"
  },
  {
    parish: "Online",
    facility: "MDLink",
    type: "Telehealth Platform",
    address: "www.theMDLink.com",
    contact: "Online platform",
    services: ["Virtual Therapy", "Licensed Professionals", "Mental Health Consultations"],
    category: "online",
    notes: "Connect with licensed professionals from the privacy of your home"
  },
  
  // ===== DIRECTORIES & INFORMATION =====
  {
    parish: "Online",
    facility: "TalkMentalJah Directory",
    type: "Online Directory",
    address: "Online - Available Nationwide",
    contact: "www.talkmentaljah.com",
    services: ["Mental Health Helplines", "Crisis Centers", "Substance Abuse Support", "Free Counseling for Children and Teens", "Resource Directory"],
    category: "directory",
    website: "www.talkmentaljah.com"
  }
];

// ============================================================================
// CATEGORY DEFINITIONS FOR FILTERING
// ============================================================================

const FACILITY_CATEGORIES: FacilityCategory[] = [
  { id: "all", label: "All Facilities" },
  { id: "hospital", label: "Hospitals" },
  { id: "private_practice", label: "Private Practice (Psychologists/Psychiatrists)" },
  { id: "community", label: "Community Mental Health" },
  { id: "health_centre", label: "Health Centres" },
  { id: "specialized", label: "Specialized Services" },
  { id: "rehabilitation", label: "Rehabilitation Centres" },
  { id: "residential", label: "Residential Care" },
  { id: "online", label: "Online/Telehealth" },
  { id: "directory", label: "Directories & Resources" }
];

const PARISHES: string[] = [
  "All Parishes",
  "Kingston & St. Andrew",
  "St. Catherine",
  "Clarendon",
  "Manchester",
  "St. Elizabeth",
  "Westmoreland",
  "Hanover",
  "St. James",
  "Trelawny",
  "St. Ann",
  "St. Mary",
  "Portland",
  "St. Thomas",
  "Online"
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SafetyPage() {
  const [selectedParish, setSelectedParish] = useState<string>("All Parishes");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filter resources based on selections
  const filteredResources: MentalHealthResource[] = useMemo(() => {
    return MENTAL_HEALTH_RESOURCES.filter((resource: MentalHealthResource) => {
      // Parish filter
      if (selectedParish !== "All Parishes" && resource.parish !== selectedParish) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== "all" && resource.category !== selectedCategory) {
        return false;
      }
      
      // Search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          resource.facility.toLowerCase().includes(searchLower) ||
          resource.type.toLowerCase().includes(searchLower) ||
          resource.services.some((service: string) => service.toLowerCase().includes(searchLower)) ||
          (resource.address && resource.address.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [selectedParish, selectedCategory, searchTerm]);

  // Group filtered resources by parish
  const groupedByParish: Record<string, MentalHealthResource[]> = useMemo(() => {
    const groups: Record<string, MentalHealthResource[]> = {};
    filteredResources.forEach((resource: MentalHealthResource) => {
      if (!groups[resource.parish]) {
        groups[resource.parish] = [];
      }
      groups[resource.parish].push(resource);
    });
    return groups;
  }, [filteredResources]);

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <Link href="/paula" className={styles.backLink}>
          ← Back to Chat
        </Link>
        <h1 className={styles.title}>🆘 Mental Health Resources Jamaica</h1>
        <p className={styles.subtitle}>
          Find psychologists, psychiatrists, counsellors, and mental health facilities across all parishes
        </p>
      </div>

      {/* Emergency Section */}
      <div className={styles.emergencySection}>
        <a href="tel:119" className={styles.emergencyButton}>
          📞 Call 119 Now
        </a>
        <p className={styles.emergencyText}>
          If you are in immediate danger or experiencing a mental health crisis
        </p>
      </div>

      {/* National Helplines */}
      <div className={styles.helplinesSection}>
        <h2>📞 National Helplines (24/7)</h2>
        <div className={styles.helplinesGrid}>
          {NATIONAL_HELPLINES.map((helpline: Helpline, index: number) => (
            <div key={index} className={styles.helplineCard}>
              <h3>{helpline.name}</h3>
              <p className={styles.helplinePhone}><strong>{helpline.phone}</strong></p>
              <p className={styles.helplineDesc}>{helpline.description}</p>
              {helpline.phone.includes("888") && (
                <a href="tel:8886395433" className={styles.smallCallButton}>
                  Call Now
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Professional Organizations */}
      <div className={styles.orgsSection}>
        <h2>🏛️ Professional Bodies & Organizations</h2>
        <div className={styles.orgsGrid}>
          {PROFESSIONAL_BODIES.map((org: ProfessionalBody, index: number) => (
            <div key={index} className={styles.orgCard}>
              <h3>{org.name}</h3>
              <p className={styles.orgType}>{org.type}</p>
              <p>{org.description}</p>
              {org.phone && <p><strong>📞</strong> {org.phone}</p>}
              {org.email && <p><strong>📧</strong> {org.email}</p>}
              {org.website && (
                <p><strong>🌐</strong> <a href={`https://${org.website}`} target="_blank" rel="noopener noreferrer">{org.website}</a></p>
              )}
              <div className={styles.orgServices}>
                <strong>Services:</strong> {org.services.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.filtersSection}>
        <button 
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"} 🔍
        </button>
        
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.searchBox}>
              <input
                type="text"
                placeholder="Search by facility name, service, or location..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                aria-label="Search mental health resources"
              />
            </div>
            
            <div className={styles.filterRow}>
              <div className={styles.filterGroup}>
                <label htmlFor="parish-select">Parish:</label>
                <select 
                  id="parish-select"
                  value={selectedParish} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedParish(e.target.value)}
                  className={styles.filterSelect}
                  title="Select parish"
                >
                  {PARISHES.map((parish: string) => (
                    <option key={parish} value={parish}>{parish}</option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label htmlFor="category-select">Facility Type:</label>
                <select 
                  id="category-select"
                  value={selectedCategory} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
                  className={styles.filterSelect}
                  title="Select facility type"
                >
                  {FACILITY_CATEGORIES.map((cat: FacilityCategory) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className={styles.resultsCount}>
        Found {filteredResources.length} mental health resources
        {selectedParish !== "All Parishes" && ` in ${selectedParish}`}
        {selectedCategory !== "all" && ` (${FACILITY_CATEGORIES.find((c: FacilityCategory) => c.id === selectedCategory)?.label})`}
      </div>

      {/* Resources by Parish */}
      <div className={styles.resourcesContainer}>
        {Object.entries(groupedByParish).map(([parish, resources]: [string, MentalHealthResource[]]) => (
          <div key={parish} className={styles.parishSection}>
            <h2 className={styles.parishTitle}>{parish}</h2>
            <div className={styles.resourcesGrid}>
              {resources.map((resource: MentalHealthResource, idx: number) => (
                <div key={idx} className={`${styles.resourceCard} ${styles[resource.category] || ''}`}>
                  <div className={styles.resourceHeader}>
                    <h3>{resource.facility}</h3>
                    <span className={styles.resourceType}>{resource.type}</span>
                  </div>
                  
                  {resource.practitioner && (
                    <p className={styles.practitioner}><strong>👤</strong> {resource.practitioner}</p>
                  )}
                  
                  {resource.address && resource.address !== "Online" && resource.address !== "Contact for services" && (
                    <p><strong>📍</strong> {resource.address}</p>
                  )}
                  
                  {resource.contact && resource.contact !== "Contact for services" && resource.contact !== "Online platform" && (
                    <p><strong>📞</strong> {resource.contact}</p>
                  )}
                  
                  {resource.email && (
                    <p><strong>📧</strong> {resource.email}</p>
                  )}
                  
                  {resource.website && (
                    <p><strong>🌐</strong> <a href={`https://${resource.website}`} target="_blank" rel="noopener noreferrer">{resource.website}</a></p>
                  )}
                  
                  <div className={styles.services}>
                    <strong>Services:</strong>
                    <ul>
                      {resource.services.slice(0, 5).map((service: string, i: number) => (
                        <li key={i}>{service}</li>
                      ))}
                      {resource.services.length > 5 && (
                        <li className={styles.moreServices}>+{resource.services.length - 5} more services</li>
                      )}
                    </ul>
                  </div>
                  
                  {resource.notes && (
                    <p className={styles.notes}>{resource.notes}</p>
                  )}
                  
                  {resource.contact && resource.contact.includes("876") && (
                    <a href={`tel:${resource.contact.replace(/[^0-9]/g, '')}`} className={styles.smallCallButton}>
                      Call
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {filteredResources.length === 0 && (
          <div className={styles.noResults}>
            <p>No mental health resources found matching your criteria.</p>
            <p>Try adjusting your filters or search term.</p>
            <button 
              onClick={() => {
                setSelectedParish("All Parishes");
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              className={styles.resetButton}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Crisis Guidance */}
      <div className={styles.guidance}>
        <h3>📌 What to Do in a Crisis</h3>
        <ul>
          <li>Call <strong>119</strong> if someone is in immediate danger</li>
          <li>Stay with the person until help arrives</li>
          <li>Remove harmful objects if safe to do so</li>
          <li>Listen calmly without judgment</li>
          <li>Contact a crisis helpline for guidance: <strong>888-NEW-LIFE (639-5433)</strong></li>
          <li>The Jamaica Mental Health Helpline has seen a 70% increase in calls, showing more Jamaicans are seeking help</li>
        </ul>
      </div>

      {/* Information Box */}
      <div className={styles.infoBox}>
        <h4>📋 Important Notes</h4>
        <ul>
          <li>63% of Jamaicans with mental health issues report onset before age 25, with 35% experiencing symptoms before age 14</li>
          <li>The Ministry of Health & Wellness has created 15+ new posts for psychiatrists, child psychiatrists, and psychologists</li>
          <li>Community mental health services operate through over 300 clinics islandwide</li>
          <li>Many health centres have mental health officers who visit on a weekly or biweekly basis</li>
          <li>For private practitioners, contact the Jamaica Psychological Society for referrals</li>
        </ul>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>
          Paula is not a medical professional. This directory is for informational purposes. 
          Always verify contact details and services directly with facilities.
        </p>
        <p className={styles.updateNote}>
          <small>Resources compiled from Ministry of Health & Wellness, Jamaica Psychological Society, and municipal sources. Includes all parishes and facility types. Last updated: February 2026</small>
        </p>
        <Link href="/paula" className={styles.footerLink}>
          Return to Chat
        </Link>
      </div>
    </div>
  );
}