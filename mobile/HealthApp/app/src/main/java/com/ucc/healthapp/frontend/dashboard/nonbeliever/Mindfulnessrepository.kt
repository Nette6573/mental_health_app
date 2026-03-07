package com.ucc.healthapp.frontend.dashboard.nonbeliever

import com.ucc.healthapp.R

// ─── Repository ───────────────────────────────────────────────────────────────
// Replace functions with API/Room calls when backend is ready.

object MindfulnessRepository {

    fun getMeditations(): List<MeditationSession> = listOf(
        MeditationSession(
            id = "breathing",
            title = "Mindful Breathing",
            durationMinutes = 5,
            description = "Focus on your breath to center yourself",
            iconRes = R.drawable.ic_breathing
        ),
        MeditationSession(
            id = "body_scan",
            title = "Body Scan",
            durationMinutes = 10,
            description = "Bring awareness to different parts of your body",
            iconRes = R.drawable.ic_body_scan
        ),
        MeditationSession(
            id = "loving_kindness",
            title = "Loving-Kindness",
            durationMinutes = 12,
            description = "Cultivate compassion for yourself and others",
            iconRes = R.drawable.ic_loving_kindness
        ),
        MeditationSession(
            id = "visualization",
            title = "Visualization",
            durationMinutes = 8,
            description = "Use mental imagery to promote peace and focus",
            iconRes = R.drawable.ic_breathing // swap when asset is ready
        )
    )

    fun getExercises(): List<MindfulnessExercise> = listOf(
        MindfulnessExercise("5-4-3-2-1 Grounding Technique", 5),
        MindfulnessExercise("Mindful Walking", 10),
        MindfulnessExercise("Thought Observation", 7),
        MindfulnessExercise("Gratitude Practice", 5)
    )

    fun getPhilosophySchools(): List<PhilosophySchool> = listOf(
        PhilosophySchool("Stoicism"),
        PhilosophySchool("Existentialism"),
        PhilosophySchool("Buddhism"),
        PhilosophySchool("Humanism")
    )

    fun getBooks(): List<BookRecommendation> = listOf(
        BookRecommendation("The Power of Now", "Eckhart Tolle"),
        BookRecommendation("Meditations", "Marcus Aurelius"),
        BookRecommendation("Man's Search for Meaning", "Viktor Frankl"),
        BookRecommendation("Wherever You Go, There You Are", "Jon Kabat-Zinn")
    )

    fun getDailyQuote(): Pair<String, String> =
        "The unexamined life is not worth living." to "Socrates"
}