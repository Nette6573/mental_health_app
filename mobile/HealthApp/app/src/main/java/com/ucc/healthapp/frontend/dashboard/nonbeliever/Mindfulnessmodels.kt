package com.ucc.healthapp.frontend.dashboard.nonbeliever

// ─── Data Models ──────────────────────────────────────────────────────────────

data class MeditationSession(
    val id: String,
    val title: String,
    val durationMinutes: Int,
    val description: String,
    val iconRes: Int
)

data class MindfulnessExercise(
    val title: String,
    val durationMinutes: Int
)

data class PhilosophySchool(
    val name: String
)

data class BookRecommendation(
    val title: String,
    val author: String
)

data class MindfulnessUiState(
    val meditations: List<MeditationSession> = emptyList(),
    val exercises: List<MindfulnessExercise> = emptyList(),
    val philosophySchools: List<PhilosophySchool> = emptyList(),
    val books: List<BookRecommendation> = emptyList(),
    val dailyQuote: String = "",
    val dailyQuoteAuthor: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)