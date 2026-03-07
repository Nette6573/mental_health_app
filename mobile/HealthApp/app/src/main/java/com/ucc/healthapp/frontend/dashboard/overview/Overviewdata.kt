package com.ucc.healthapp.frontend.dashboard.overview

import androidx.compose.ui.graphics.Color
import com.ucc.healthapp.R

data class WellnessStat(val icon: Int, val value: String, val label: String, val color: Color, val progress: Float)
data class QuickAction(val title: String, val icon: Int, val color: Color, val route: String)
data class ActivityItem(val title: String, val time: String, val icon: Int, val color: Color)
data class WeeklyMoodPoint(val day: String, val intensity: Float)
data class WellnessRingData(val label: String, val value: Float, val color: Color)

val wellnessStats = listOf(
    WellnessStat(R.drawable.ic_mood,      "Good",   "Mood",       Color(0xFF4CAF50), 0.80f),
    WellnessStat(R.drawable.ic_body_scan, "7h 23m", "Sleep",      Color(0xFF2196F3), 0.73f),
    WellnessStat(R.drawable.ic_breathing, "15m",    "Meditation", Color(0xFF9C27B0), 0.50f),
    WellnessStat(R.drawable.ic_apple,     "3,421",  "Steps",      Color(0xFFFF9800), 0.68f)
)

val quickActions = listOf(
    QuickAction("Mood Check",  R.drawable.ic_mood_check,  Color(0xFF4CAF50), "mood"),
    QuickAction("Meditate",    R.drawable.ic_meditate,    Color(0xFF9C27B0), "faith"),
    QuickAction("Mindfulness", R.drawable.ic_mindfulness, Color(0xFF00BCD4), "nonbeliever"),
    QuickAction("Resources",   R.drawable.ic_resources,   Color(0xFF2196F3), "resources"),
    QuickAction("Therapist",   R.drawable.ic_therapist,   Color(0xFFF44336), "therapist"),
    QuickAction("Settings",    R.drawable.ic_settings,    Color(0xFF607D8B), "settings")
)

val recentActivities = listOf(
    ActivityItem("Completed 10-min meditation",   "2 hours ago", R.drawable.ic_breathing,   Color(0xFF9C27B0)),
    ActivityItem("Logged mood: Calm",             "5 hours ago", R.drawable.ic_mood,        Color(0xFF4CAF50)),
    ActivityItem("Read 'Finding Peace' article",  "Yesterday",   R.drawable.ic_resources,   Color(0xFF2196F3)),
    ActivityItem("Mindfulness breathing session", "Yesterday",   R.drawable.ic_mindfulness, Color(0xFF00BCD4))
)

val weeklyMoodData = listOf(
    WeeklyMoodPoint("Mon", 0.90f),
    WeeklyMoodPoint("Tue", 0.75f),
    WeeklyMoodPoint("Wed", 0.55f),
    WeeklyMoodPoint("Thu", 0.40f),
    WeeklyMoodPoint("Fri", 0.70f),
    WeeklyMoodPoint("Sat", 0.85f),
    WeeklyMoodPoint("Sun", 0.95f)
)

val wellnessRings = listOf(
    WellnessRingData("Mind",   0.78f, Color(0xFF9C27B0)),
    WellnessRingData("Body",   0.62f, Color(0xFF2196F3)),
    WellnessRingData("Spirit", 0.85f, Color(0xFF4CAF50))
)

val dailyQuotes = listOf(
    "Peace is not the absence of chaos, but the presence of calm within it." to "Anonymous",
    "You don't have to control your thoughts. You just have to stop letting them control you." to "Dan Millman",
    "The wound is the place where the light enters you." to "Rumi",
    "In the middle of difficulty lies opportunity." to "Albert Einstein"
)