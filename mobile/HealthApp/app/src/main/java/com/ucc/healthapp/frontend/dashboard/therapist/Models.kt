package com.ucc.healthapp.frontend.dashboard.therapist

// ─────────────────────────────────────────────────────────────────────────────
// ThreeTenBP — API-21-safe backport of java.time
//
// app/build.gradle:
//   implementation("com.jakewharton.threetenabp:threetenabp:1.4.7")
//
// Application.onCreate():
//   AndroidThreeTen.init(this)
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Core domain models
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core therapist entity. All other screens reference this single definition.
 *
 * @param id               Stable unique identifier (UUID or server-assigned key).
 * @param name             Full display name including title (e.g. "Dr. Jane Doe").
 * @param specialty        Primary clinical specialty shown in list and profile views.
 * @param rating           Average user rating, 0.0–5.0.
 * @param reviewCount      Total published reviews.
 * @param pricePerSession  Session cost in whole currency units (USD).
 * @param availableToday   Whether at least one slot is open today.
 * @param isOnline         Whether the therapist offers online/video sessions.
 */
data class Therapist(
    val id: String,
    val name: String,
    val specialty: String,
    val rating: Double,
    val reviewCount: Int,
    val pricePerSession: Int,
    val availableToday: Boolean,
    val isOnline: Boolean,
)

/**
 * Extended profile data shown on the detail screen and carried through to booking.
 *
 * Holds the full [Therapist] entity plus supplementary fields that are too
 * heavyweight for the list view. In production these would be fetched lazily
 * from a separate API endpoint when the user opens the profile.
 */
data class TherapistProfile(
    val therapist: Therapist,
    val bio: String,
    val yearsExperience: Int,
    val education: List<String>,
    val certifications: List<String>,
    val languages: List<String>,
    val approaches: List<String>,
    val sessionTypes: List<String>,
    val insuranceAccepted: List<String>,
    val reviews: List<ClientReview>,
)

/**
 * A single client review entry displayed on the profile screen.
 *
 * @param initials Two-letter anonymised client initials.
 * @param rating   Star rating 1–5.
 * @param date     Human-readable display date (e.g. "Jan 2025").
 * @param comment  Free-text review body.
 */
data class ClientReview(
    val initials: String,
    val rating: Int,
    val date: String,
    val comment: String,
)

/** Session delivery mode chosen by the user during booking. */
enum class SessionMode { Online, InPerson }

/**
 * A support group entry shown at the bottom of the therapist list.
 *
 * @param id       Stable unique identifier.
 * @param name     Display name of the group.
 * @param schedule Human-readable meeting schedule.
 * @param members  Member count label (e.g. "12 members").
 */
data class SupportGroup(
    val id: String,
    val name: String,
    val schedule: String,
    val members: String,
)

/**
 * Fully resolved booking record produced when the user confirms an appointment.
 * This is the object passed back to the host via [onBookingConfirmed].
 */
data class BookingResult(
    val therapistId: String,
    val therapistName: String,
    val date: java.time.LocalDate,
    val timeSlot: String,
    val mode: SessionMode,
    val notes: String,
)

// ─────────────────────────────────────────────────────────────────────────────
// Sample / stub data  (replace with repository / network calls in production)
// ─────────────────────────────────────────────────────────────────────────────

val sampleTherapistProfiles: Map<String, TherapistProfile> = mapOf(

    "t001" to TherapistProfile(
        therapist = Therapist(
            id = "t001",
            name = "Dr. Sarah Mitchell",
            specialty = "Anxiety & Depression",
            rating = 4.9,
            reviewCount = 127,
            pricePerSession = 120,
            availableToday = true,
            isOnline = true,
        ),
        bio = "I'm a licensed psychologist with over 12 years of experience helping individuals navigate anxiety, depression, and life transitions. My approach is warm, collaborative, and evidence-based — I believe healing happens when you feel truly heard.",
        yearsExperience = 12,
        education = listOf(
            "Ph.D. Clinical Psychology – University of Michigan",
            "B.Sc. Psychology – UCLA",
        ),
        certifications = listOf(
            "Licensed Psychologist (LP)",
            "Certified CBT Practitioner",
            "EMDR Certified",
        ),
        languages = listOf("English", "Spanish"),
        approaches = listOf("CBT", "Mindfulness-Based", "Psychodynamic", "EMDR"),
        sessionTypes = listOf("Individual", "Couples"),
        insuranceAccepted = listOf("Aetna", "BlueCross", "Cigna", "United Health"),
        reviews = listOf(
            ClientReview("JM", 5, "Jan 2025", "Dr. Mitchell truly changed my perspective on anxiety. Her techniques are practical and she genuinely cares about your progress."),
            ClientReview("AK", 5, "Dec 2024", "I've seen several therapists over the years — Sarah is by far the most skilled and compassionate."),
            ClientReview("TL", 4, "Nov 2024", "Very helpful sessions. I appreciate how she tailors each session to where I am that week."),
        ),
    ),

    "t002" to TherapistProfile(
        therapist = Therapist(
            id = "t002",
            name = "Dr. James Chen",
            specialty = "Trauma & PTSD",
            rating = 4.8,
            reviewCount = 94,
            pricePerSession = 150,
            availableToday = false,
            isOnline = true,
        ),
        bio = "Specialising in trauma recovery and PTSD, I use a trauma-informed, somatic approach to help clients move from survival to thriving. My practice is a safe, non-judgmental space where your pace sets the rhythm.",
        yearsExperience = 9,
        education = listOf(
            "Psy.D. Counselling Psychology – Columbia University",
            "B.A. Neuroscience – Johns Hopkins",
        ),
        certifications = listOf(
            "Licensed Professional Counsellor (LPC)",
            "Somatic Experiencing Practitioner",
            "TF-CBT Certified",
        ),
        languages = listOf("English", "Mandarin"),
        approaches = listOf("Somatic Experiencing", "TF-CBT", "Narrative Therapy", "IFS"),
        sessionTypes = listOf("Individual"),
        insuranceAccepted = listOf("Cigna", "Humana", "Magellan"),
        reviews = listOf(
            ClientReview("SR", 5, "Feb 2025", "James helped me process trauma I'd been carrying for 10 years. I feel lighter and more present than ever."),
            ClientReview("DB", 5, "Jan 2025", "Incredibly skilled. His somatic work is unlike anything I've experienced before."),
        ),
    ),

    "t003" to TherapistProfile(
        therapist = Therapist(
            id = "t003",
            name = "Dr. Emily Rodriguez",
            specialty = "Relationships & Family",
            rating = 4.9,
            reviewCount = 156,
            pricePerSession = 130,
            availableToday = true,
            isOnline = false,
        ),
        bio = "Relationships are at the heart of our wellbeing. I work with individuals, couples, and families to build stronger connections, resolve conflict, and heal from relational wounds using the Gottman Method and EFT.",
        yearsExperience = 15,
        education = listOf(
            "M.S. Marriage & Family Therapy – Northwestern University",
            "B.A. Psychology – University of Texas",
        ),
        certifications = listOf(
            "Licensed Marriage & Family Therapist (LMFT)",
            "Gottman Method Level 3",
            "EFT Certified",
        ),
        languages = listOf("English", "Spanish", "Portuguese"),
        approaches = listOf("Gottman Method", "EFT", "Systems Theory", "Solution-Focused"),
        sessionTypes = listOf("Individual", "Couples", "Family"),
        insuranceAccepted = listOf("Aetna", "BlueCross", "Oscar", "United Health"),
        reviews = listOf(
            ClientReview("MR", 5, "Mar 2025", "Emily saved our marriage. We went from constant conflict to genuine partnership."),
            ClientReview("PW", 5, "Feb 2025", "She has a gift for helping you see patterns you couldn't see yourself."),
            ClientReview("CL", 4, "Jan 2025", "Thoughtful, warm and highly competent. Would recommend to anyone."),
        ),
    ),

    "t004" to TherapistProfile(
        therapist = Therapist(
            id = "t004",
            name = "Dr. Michael Thompson",
            specialty = "Stress Management",
            rating = 4.7,
            reviewCount = 78,
            pricePerSession = 110,
            availableToday = false,
            isOnline = true,
        ),
        bio = "Modern life is relentless. I help high-achievers, professionals, and parents reclaim their mental bandwidth through practical stress management, boundary-setting, and resilience training.",
        yearsExperience = 7,
        education = listOf(
            "M.A. Counselling Psychology – Boston University",
            "B.Sc. Sports Science – Penn State",
        ),
        certifications = listOf(
            "Licensed Professional Counsellor (LPC)",
            "Mindfulness-Based Stress Reduction (MBSR)",
            "ACT Certified",
        ),
        languages = listOf("English"),
        approaches = listOf("ACT", "MBSR", "CBT", "Behavioural Activation"),
        sessionTypes = listOf("Individual", "Group"),
        insuranceAccepted = listOf("Cigna", "BlueCross", "Kaiser"),
        reviews = listOf(
            ClientReview("HL", 5, "Mar 2025", "Michael gave me practical tools I actually use every day. My stress levels are dramatically lower."),
            ClientReview("NG", 4, "Feb 2025", "Great listener, very practical approach. Highly recommend for busy professionals."),
        ),
    ),

    "t005" to TherapistProfile(
        therapist = Therapist(
            id = "t005",
            name = "Dr. Lisa Anderson",
            specialty = "Life Transitions",
            rating = 4.8,
            reviewCount = 103,
            pricePerSession = 140,
            availableToday = true,
            isOnline = true,
        ),
        bio = "Change — whether chosen or thrust upon us — can be disorienting. I specialise in helping people navigate career shifts, grief, identity transitions, and major life changes with clarity and confidence.",
        yearsExperience = 11,
        education = listOf(
            "Ph.D. Counselling Psychology – University of Wisconsin",
            "B.A. Sociology & Psychology – Vassar College",
        ),
        certifications = listOf(
            "Licensed Psychologist (LP)",
            "Certified Grief Counsellor",
            "Career Development Facilitator",
        ),
        languages = listOf("English", "French"),
        approaches = listOf("Existential Therapy", "Narrative Therapy", "Positive Psychology", "CBT"),
        sessionTypes = listOf("Individual"),
        insuranceAccepted = listOf("Aetna", "Humana", "United Health", "Cigna"),
        reviews = listOf(
            ClientReview("BK", 5, "Mar 2025", "Lisa helped me find my footing after a difficult career change and divorce. Her insight is remarkable."),
            ClientReview("EM", 5, "Jan 2025", "She has a rare ability to help you see your situation clearly without judgment."),
            ClientReview("RT", 4, "Dec 2024", "Thoughtful and patient. Great for anyone going through a major life shift."),
        ),
    ),
)

/** Convenience flat list derived from [sampleTherapistProfiles] for the list screen. */
val sampleTherapists: List<Therapist> =
    sampleTherapistProfiles.values.map { it.therapist }

val sampleSupportGroups: List<SupportGroup> = listOf(
    SupportGroup("sg001", "Anxiety Support Circle",     "Tuesdays, 6 PM",   "12 members"),
    SupportGroup("sg002", "Depression Recovery Group",  "Thursdays, 7 PM",  "8 members"),
    SupportGroup("sg003", "Stress Management Workshop", "Saturdays, 10 AM", "15 members"),
)

// ─────────────────────────────────────────────────────────────────────────────
// Shared utilities
// ─────────────────────────────────────────────────────────────────────────────

/** Set of title/honorific tokens stripped when generating avatar initials. */
val HONORIFICS: Set<String> = setOf("dr.", "mr.", "mrs.", "ms.", "prof.")

/**
 * Derives up to two uppercase initials from a [name], ignoring leading honorifics.
 *
 * Examples:
 *  - "Dr. Sarah Mitchell" → "SM"
 *  - "James Chen"         → "JC"
 */
fun initialsFrom(name: String): String =
    name.split(" ")
        .filter { it.isNotBlank() && it.lowercase() !in HONORIFICS }
        .take(2)
        .mapNotNull { it.firstOrNull()?.uppercaseChar() }
        .joinToString("")