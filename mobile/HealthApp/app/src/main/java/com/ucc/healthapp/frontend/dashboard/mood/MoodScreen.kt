package com.ucc.healthapp.frontend.dashboard.mood

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

// ─── Screen ───────────────────────────────────────────────────────────────────

@Composable
fun MoodScreen(
    onMoodSelected: (Mood) -> Unit = {},
    vm: MoodViewModel = viewModel()
) {
    val state by vm.uiState.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(20.dp)
    ) {
        item { MoodHeader() }

        // Mood selection
        item {
            MoodCheckInCard(
                selectedMood = state.selectedMood,
                onMoodSelected = {
                    vm.selectMood(it)
                    onMoodSelected(it)
                }
            )
        }

        // Journal + AI — only shown after mood is selected
        if (state.selectedMood != null) {
            item {
                MoodJournalCard(
                    journalEntry = state.journalEntry,
                    onJournalChange = vm::updateJournal
                )
            }

            item {
                MoodAiInsightCard(
                    aiState = state.aiState,
                    selectedMood = state.selectedMood,
                    onAnalyse = vm::analyseWithAi,
                    onRetry = vm::retryAnalysis,
                    onSave = vm::saveEntry
                )
            }
        }

        item { MoodHistoryCard() }
        item { MoodInsightsCard() }
        item { MoodTrendsCard() }
    }
}

// ─── Header ───────────────────────────────────────────────────────────────────

@Composable
private fun MoodHeader() {
    Column {
        Text(
            text = "Mood Tracker",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "How are you feeling today?",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

// ─── Mood Check-in ────────────────────────────────────────────────────────────

@Composable
private fun MoodCheckInCard(
    selectedMood: Mood?,
    onMoodSelected: (Mood) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(24.dp)) {
            Text(
                text = "Today's Mood Check-in",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = "Select your mood to get a personalised insight",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
            )
            Spacer(modifier = Modifier.height(20.dp))
            Text(
                text = "How do you feel right now?",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
            )
            Spacer(modifier = Modifier.height(16.dp))

            val columns = 3
            val rows = (moodList.size + columns - 1) / columns
            for (row in 0 until rows) {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    for (col in 0 until columns) {
                        val index = row * columns + col
                        if (index < moodList.size) {
                            MoodButton(
                                mood = moodList[index],
                                isSelected = selectedMood == moodList[index],
                                onClick = { onMoodSelected(moodList[index]) },
                                modifier = Modifier.weight(1f)
                            )
                        } else {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun MoodButton(
    mood: Mood,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.aspectRatio(1f).clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) mood.color.copy(alpha = 0.2f)
            else MaterialTheme.colorScheme.surfaceVariant
        ),
        border = if (isSelected) BorderStroke(2.dp, mood.color) else null
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                painter = painterResource(id = mood.icon),
                contentDescription = mood.name,
                tint = if (isSelected) mood.color else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(32.dp)
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = mood.name,
                style = MaterialTheme.typography.bodySmall,
                color = if (isSelected) mood.color else MaterialTheme.colorScheme.onSurfaceVariant,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
            )
        }
    }
}

// ─── Journal ──────────────────────────────────────────────────────────────────

@Composable
private fun MoodJournalCard(
    journalEntry: String,
    onJournalChange: (String) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(20.dp)) {
            Text(
                text = "Journal Entry",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Optional — adding context helps the AI give better insights",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(12.dp))
            OutlinedTextField(
                value = journalEntry,
                onValueChange = onJournalChange,
                placeholder = {
                    Text(
                        text = "What's on your mind? What happened today?",
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                    )
                },
                modifier = Modifier.fillMaxWidth().height(120.dp),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline
                )
            )
        }
    }
}

// ─── History ──────────────────────────────────────────────────────────────────

@Composable
private fun MoodHistoryCard() {
    Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp)) {
        Column(modifier = Modifier.fillMaxWidth().padding(20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Recent Moods", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                TextButton(onClick = {}) { Text("View All") }
            }
            Spacer(modifier = Modifier.height(16.dp))

            sampleHistory.forEach { (date, mood) ->
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = date, style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(modifier = Modifier.size(12.dp), shape = CircleShape,
                            color = getMoodColor(mood)) {}
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(text = mood, style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium)
                    }
                }
            }
        }
    }
}

// ─── Insights ─────────────────────────────────────────────────────────────────

@Composable
private fun MoodInsightsCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)
    ) {
        Column(modifier = Modifier.fillMaxWidth().padding(20.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CheckCircle, contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSecondaryContainer, modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Insights", style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSecondaryContainer)
            }
            Spacer(modifier = Modifier.height(16.dp))
            listOf(
                "You're feeling more positive this week",
                "Your mood often improves after meditation",
                "Sleep quality affects your morning mood"
            ).forEach {
                Text("• $it", style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSecondaryContainer,
                    modifier = Modifier.padding(bottom = 4.dp))
            }
        }
    }
}

// ─── Trends ───────────────────────────────────────────────────────────────────

@Composable
private fun MoodTrendsCard() {
    Card(modifier = Modifier.fillMaxWidth(), shape = RoundedCornerShape(16.dp)) {
        Column(modifier = Modifier.fillMaxWidth().padding(20.dp)) {
            Text("Weekly Trends", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(20.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
                weekDayMoods.forEach { (day, mood) -> DayMoodBar(day, mood) }
            }
        }
    }
}

@Composable
private fun DayMoodBar(day: String, mood: String) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            modifier = Modifier
                .width(20.dp)
                .height(getMoodHeight(mood))
                .clip(RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp))
                .background(getMoodColor(mood))
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = day, style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

fun getMoodColor(mood: String): Color = when (mood.lowercase()) {
    "great"   -> Color(0xFF4CAF50)
    "good"    -> Color(0xFF8BC34A)
    "okay"    -> Color(0xFFFFC107)
    "sad"     -> Color(0xFF2196F3)
    "anxious" -> Color(0xFFFF9800)
    "angry"   -> Color(0xFFF44336)
    else      -> Color.Gray
}

private fun getMoodHeight(mood: String): Dp = when (mood.lowercase()) {
    "great"   -> 48.dp
    "good"    -> 40.dp
    "okay"    -> 32.dp
    "sad"     -> 24.dp
    "anxious" -> 28.dp
    "angry"   -> 20.dp
    else      -> 24.dp
}