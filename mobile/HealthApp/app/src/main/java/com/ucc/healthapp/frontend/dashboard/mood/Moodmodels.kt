package com.ucc.healthapp.frontend.dashboard.mood

import androidx.compose.ui.graphics.Color
import com.ucc.healthapp.R

// ─── Core Models ──────────────────────────────────────────────────────────────

data class Mood(
    val name: String,
    val icon: Int,
    val color: Color,
    val description: String,
    val intensity: Int // 1-5 scale for trend chart
)

data class MoodEntry(
    val id: String,
    val mood: Mood,
    val journal: String,
    val timestamp: Long = System.currentTimeMillis(),
    val aiInsight: MoodAiInsight? = null
)

data class MoodAiInsight(
    val prediction: String,           // What the AI thinks is behind the mood
    val philosophicalQuote: String,   // A relevant quote
    val philosopher: String,          // Who said it
    val encouragement: String,        // Warm personalised encouragement
    val suggestedActions: List<String> // 2-3 practical suggestions
)

sealed class MoodAiState {
    object Idle : MoodAiState()
    object Loading : MoodAiState()
    data class Success(val insight: MoodAiInsight) : MoodAiState()
    data class Error(val message: String) : MoodAiState()
}

// ─── Mood Definitions ─────────────────────────────────────────────────────────

val moodList = listOf(
    Mood("Great",   R.drawable.ic_mood_great,   Color(0xFF4CAF50), "Feeling excellent", 5),
    Mood("Good",    R.drawable.ic_mood_good,    Color(0xFF8BC34A), "Feeling positive",  4),
    Mood("Okay",    R.drawable.ic_mood_okay,    Color(0xFFFFC107), "Feeling neutral",   3),
    Mood("Sad",     R.drawable.ic_mood_sad,     Color(0xFF2196F3), "Feeling down",      2),
    Mood("Anxious", R.drawable.ic_mood_anxious, Color(0xFFFF9800), "Feeling worried",   2),
    Mood("Angry",   R.drawable.ic_mood_angry,   Color(0xFFF44336), "Feeling frustrated",1)
)

// ─── Mock History (replace with Room DB) ─────────────────────────────────────

val sampleHistory = listOf(
    "Today"      to "Good",
    "Yesterday"  to "Great",
    "2 days ago" to "Okay",
    "3 days ago" to "Anxious",
    "4 days ago" to "Good",
    "5 days ago" to "Great",
    "6 days ago" to "Sad"
)

val weekDayMoods = listOf(
    "Mon" to "Great",
    "Tue" to "Good",
    "Wed" to "Okay",
    "Thu" to "Anxious",
    "Fri" to "Good",
    "Sat" to "Great",
    "Sun" to "Great"
)