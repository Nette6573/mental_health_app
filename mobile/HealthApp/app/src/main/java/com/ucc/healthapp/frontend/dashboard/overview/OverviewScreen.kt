package com.ucc.healthapp.frontend.dashboard.overview

import android.graphics.Canvas
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ucc.healthapp.R
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

@Composable
fun OverviewScreen(onNavigateToFeature: (String) -> Unit = {}) {
    LazyColumn(
        modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 28.dp)
    ) {
        item { WelcomeHeroCard(onNavigateToFeature) }
        item { WellnessStatsRow() }
        item { MoodWeekCard() }
        item { WellnessRingsCard() }
        item { QuickActionsGrid(onNavigateToFeature) }
        item { DailyQuoteCard() }
        item { RecentActivityCard(onNavigateToFeature) }
        item { SleepActivityCard() }
        item { RecommendedForYouCard(onNavigateToFeature) }
    }
}

// ─── Welcome Hero ─────────────────────────────────────────────────────────────

@Composable
private fun WelcomeHeroCard(onNavigateToFeature: (String) -> Unit) {
    val cal = Calendar.getInstance()
    val time = SimpleDateFormat("h:mm a", Locale.getDefault()).format(cal.time)
    val date = SimpleDateFormat("EEEE, MMM d", Locale.getDefault()).format(cal.time)

    Box(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 8.dp)) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.linearGradient(listOf(
                        MaterialTheme.colorScheme.primary,
                        MaterialTheme.colorScheme.tertiary.copy(alpha = 0.8f)
                    )),
                    RoundedCornerShape(24.dp)
                )
                .padding(20.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Top
                ) {
                    Column {
                        Text("Good ${getGreeting()}, Sarah 👋",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold, color = Color.White)
                        Text("$date · $time",
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White.copy(alpha = 0.75f))
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Surface(shape = CircleShape, color = Color.White.copy(alpha = 0.2f),
                            modifier = Modifier.size(38.dp)) {
                            IconButton(onClick = {}) {
                                Icon(painterResource(R.drawable.ic_notifications), "Notifications",
                                    tint = Color.White, modifier = Modifier.size(20.dp))
                            }
                        }
                        Surface(shape = CircleShape, color = Color.White.copy(alpha = 0.2f),
                            modifier = Modifier.size(38.dp)) {
                            IconButton(onClick = { onNavigateToFeature("settings") }) {
                                Icon(painterResource(R.drawable.ic_settings), "Settings",
                                    tint = Color.White, modifier = Modifier.size(20.dp))
                            }
                        }
                    }
                }
                Spacer(Modifier.height(20.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(
                        onClick = { onNavigateToFeature("mood") },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.White,
                            contentColor = MaterialTheme.colorScheme.primary
                        )
                    ) {
                        Icon(painterResource(R.drawable.ic_mood_check), null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Log Mood", fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.labelMedium)
                    }
                    OutlinedButton(
                        onClick = { onNavigateToFeature("faith") },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                        border = BorderStroke(1.dp, Color.White.copy(alpha = 0.6f))
                    ) {
                        Icon(painterResource(R.drawable.ic_breathing), null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Meditate", style = MaterialTheme.typography.labelMedium)
                    }
                }
            }
        }
    }
}

// ─── Wellness Stats Row ───────────────────────────────────────────────────────

@Composable
private fun WellnessStatsRow() {
    LazyRow(
        contentPadding = PaddingValues(horizontal = 20.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        items(wellnessStats) { stat -> StatCard(stat) }
    }
}

// SAFE: Animatable declared at top of composable, NOT inside .let{}
@Composable
private fun StatCard(stat: WellnessStat) {
    val progressAnim = remember(stat.label) { Animatable(0f) }
    LaunchedEffect(stat.label) {
        progressAnim.animateTo(stat.progress, tween(800, easing = FastOutSlowInEasing))
    }
    val animProgress by progressAnim.asState()

    Card(
        modifier = Modifier.width(100.dp), shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Box(
                modifier = Modifier.size(44.dp).clip(RoundedCornerShape(12.dp))
                    .background(stat.color.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(painterResource(stat.icon), null, tint = stat.color, modifier = Modifier.size(22.dp))
            }
            Spacer(Modifier.height(8.dp))
            Text(stat.value, style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
            Text(stat.label, style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center)
            Spacer(Modifier.height(8.dp))
            Box(
                modifier = Modifier.fillMaxWidth().height(4.dp).clip(CircleShape)
                    .background(stat.color.copy(alpha = 0.15f))
            ) {
                Box(modifier = Modifier.fillMaxWidth(animProgress).fillMaxHeight()
                    .clip(CircleShape).background(stat.color))
            }
        }
    }
}

// ─── Mood Week Chart ──────────────────────────────────────────────────────────

@Composable
private fun MoodWeekCard() {
    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp),
        shape = RoundedCornerShape(20.dp), elevation = CardDefaults.cardElevation(2.dp)) {
        Column(modifier = Modifier.fillMaxWidth().padding(20.dp)) {
            Row(modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically) {
                Column {
                    Text("Mood This Week", style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold)
                    Text("Your emotional journey over 7 days",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Surface(shape = RoundedCornerShape(8.dp), color = Color(0xFF4CAF50).copy(alpha = 0.12f)) {
                    Text("↑ 12%", style = MaterialTheme.typography.labelSmall,
                        fontWeight = FontWeight.Bold, color = Color(0xFF4CAF50),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                }
            }
            Spacer(Modifier.height(16.dp))
            MoodLineChart(points = weeklyMoodData, lineColor = MaterialTheme.colorScheme.primary,
                modifier = Modifier.fillMaxWidth().height(90.dp))
            Spacer(Modifier.height(6.dp))
            MoodChartDayLabels(points = weeklyMoodData, modifier = Modifier.padding(horizontal = 4.dp))
        }
    }
}

// ─── Wellness Rings ───────────────────────────────────────────────────────────

@Composable
private fun WellnessRingsCard() {
    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp),
        shape = RoundedCornerShape(20.dp), elevation = CardDefaults.cardElevation(2.dp)) {
        Row(modifier = Modifier.fillMaxWidth().padding(20.dp),
            verticalAlignment = Alignment.CenterVertically) {
            Column(modifier = Modifier.weight(1f)) {
                Text("Wellness Score", style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold)
                Text("Mind, Body & Spirit balance",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.height(16.dp))
                RingLegend(rings = wellnessRings, modifier = Modifier.fillMaxWidth())
            }
            Spacer(Modifier.width(16.dp))
            WellnessRingsChart(rings = wellnessRings, modifier = Modifier.size(130.dp))
        }
    }
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

@Composable
private fun QuickActionsGrid(onActionClick: (String) -> Unit) {
    Column(modifier = Modifier.padding(horizontal = 20.dp)) {
        Text("Quick Actions", style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold, modifier = Modifier.padding(bottom = 12.dp))
        val rows = quickActions.chunked(3)
        rows.forEachIndexed { rowIdx, rowActions ->
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                rowActions.forEach { action ->
                    QuickActionTile(action, { onActionClick(action.route) }, Modifier.weight(1f))
                }
                repeat(3 - rowActions.size) { Spacer(Modifier.weight(1f)) }
            }
            if (rowIdx < rows.lastIndex) Spacer(Modifier.height(10.dp))
        }
    }
}

@Composable
private fun QuickActionTile(action: QuickAction, onClick: () -> Unit, modifier: Modifier = Modifier) {
    Card(modifier = modifier.aspectRatio(1f).clickable(onClick = onClick),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = action.color.copy(alpha = 0.10f)),
        elevation = CardDefaults.cardElevation(0.dp)) {
        Column(modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center) {
            Surface(shape = RoundedCornerShape(10.dp), color = action.color.copy(alpha = 0.18f),
                modifier = Modifier.size(42.dp)) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(painterResource(action.icon), action.title, tint = action.color,
                        modifier = Modifier.size(22.dp))
                }
            }
            Spacer(Modifier.height(8.dp))
            Text(action.title, style = MaterialTheme.typography.labelSmall, color = action.color,
                fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center, maxLines = 1,
                overflow = TextOverflow.Ellipsis, modifier = Modifier.padding(horizontal = 4.dp))
        }
    }
}

// ─── Daily Quote ──────────────────────────────────────────────────────────────

@Composable
private fun DailyQuoteCard() {
    val quote = dailyQuotes.first()
    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)) {
        Column(modifier = Modifier.fillMaxWidth().padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally) {
            Text("\u201C", fontSize = 48.sp, fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.secondary, lineHeight = 32.sp,
                modifier = Modifier.align(Alignment.Start))
            Text(quote.first, style = MaterialTheme.typography.bodyLarge, fontSize = 16.sp,
                color = MaterialTheme.colorScheme.onSecondaryContainer,
                textAlign = TextAlign.Center, lineHeight = 24.sp)
            Spacer(Modifier.height(10.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                HorizontalDivider(modifier = Modifier.width(20.dp),
                    color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.3f))
                Spacer(Modifier.width(8.dp))
                Text("— ${quote.second}", style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.7f),
                    fontWeight = FontWeight.Medium)
            }
        }
    }
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

@Composable
private fun RecentActivityCard(onNavigateToFeature: (String) -> Unit) {
    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp),
        shape = RoundedCornerShape(20.dp), elevation = CardDefaults.cardElevation(2.dp)) {
        Column(modifier = Modifier.fillMaxWidth().padding(20.dp)) {
            Row(modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically) {
                Text("Recent Activity", style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold)
                TextButton(onClick = {}) { Text("View All") }
            }
            Spacer(Modifier.height(8.dp))
            recentActivities.forEachIndexed { i, activity ->
                Row(modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically) {
                    Surface(shape = RoundedCornerShape(10.dp),
                        color = activity.color.copy(alpha = 0.12f), modifier = Modifier.size(40.dp)) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(painterResource(activity.icon), null, tint = activity.color,
                                modifier = Modifier.size(20.dp))
                        }
                    }
                    Spacer(Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(activity.title, style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium, maxLines = 1,
                            overflow = TextOverflow.Ellipsis)
                        Text(activity.time, style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Icon(Icons.Default.ChevronRight, null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                }
                if (i < recentActivities.lastIndex) {
                    HorizontalDivider(modifier = Modifier.padding(vertical = 2.dp),
                        color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.4f))
                }
            }
        }
    }
}

// ─── Sleep & Activity Charts ──────────────────────────────────────────────────

@Composable
private fun SleepActivityCard() {
    val sleepBars = listOf("Mon" to 0.82f,"Tue" to 0.70f,"Wed" to 0.90f,
        "Thu" to 0.55f,"Fri" to 0.78f,"Sat" to 0.95f,"Sun" to 0.88f)
    val stepsBars = listOf("Mon" to 0.60f,"Tue" to 0.45f,"Wed" to 0.80f,
        "Thu" to 0.30f,"Fri" to 0.70f,"Sat" to 0.55f,"Sun" to 0.65f)

    Card(modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp),
        shape = RoundedCornerShape(20.dp), elevation = CardDefaults.cardElevation(2.dp)) {
        Column(modifier = Modifier.fillMaxWidth().padding(20.dp)) {
            Text("Weekly Activity", style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold)
            Text("Sleep & steps breakdown", style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Canvas(Modifier.size(8.dp)) { drawCircle(Color(0xFF2196F3)) }
                        Spacer(Modifier.width(4.dp))
                        Text("Sleep", style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold, color = Color(0xFF2196F3))
                    }
                    Spacer(Modifier.height(8.dp))
                    MiniBarChart(bars = sleepBars, barColor = Color(0xFF2196F3),
                        modifier = Modifier.fillMaxWidth())
                }
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Canvas(Modifier.size(8.dp)) { drawCircle(Color(0xFFFF9800)) }
                        Spacer(Modifier.width(4.dp))
                        Text("Steps", style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.SemiBold, color = Color(0xFFFF9800))
                    }
                    Spacer(Modifier.height(8.dp))
                    MiniBarChart(bars = stepsBars, barColor = Color(0xFFFF9800),
                        modifier = Modifier.fillMaxWidth())
                }
            }
        }
    }
}

// ─── Recommended For You ──────────────────────────────────────────────────────

@Composable
private fun RecommendedForYouCard(onNavigateToFeature: (String) -> Unit) {
    Column(modifier = Modifier.padding(horizontal = 20.dp)) {
        Row(modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically) {
            Text("Recommended For You", style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold)
            TextButton(onClick = { onNavigateToFeature("resources") }) { Text("See All") }
        }
        Spacer(Modifier.height(10.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            RecommendationTile("Mindfulness for Beginners", "10 min · Article",
                Color(0xFF9C27B0), R.drawable.ic_mindfulness,
                { onNavigateToFeature("resources") }, Modifier.weight(1f))
            RecommendationTile("Understanding Anxiety", "15 min · Guide",
                Color(0xFF2196F3), R.drawable.ic_breathing,
                { onNavigateToFeature("resources") }, Modifier.weight(1f))
        }
        Spacer(Modifier.height(10.dp))
        Card(modifier = Modifier.fillMaxWidth().clickable { onNavigateToFeature("therapist") },
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFFF44336).copy(alpha = 0.08f))) {
            Row(modifier = Modifier.fillMaxWidth().padding(16.dp),
                verticalAlignment = Alignment.CenterVertically) {
                Surface(shape = RoundedCornerShape(10.dp), color = Color(0xFFF44336).copy(alpha = 0.15f),
                    modifier = Modifier.size(44.dp)) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(painterResource(R.drawable.ic_therapist), null,
                            tint = Color(0xFFF44336), modifier = Modifier.size(22.dp))
                    }
                }
                Spacer(Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text("Talk to a Therapist", style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold, color = Color(0xFFF44336))
                    Text("Book a session with a professional",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Icon(Icons.Default.ArrowForward, null, tint = Color(0xFFF44336),
                    modifier = Modifier.size(18.dp))
            }
        }
    }
}

@Composable
private fun RecommendationTile(title: String, duration: String, color: Color, icon: Int,
                               onClick: () -> Unit, modifier: Modifier = Modifier) {
    Card(modifier = modifier.clickable(onClick = onClick), shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)) {
        Column(modifier = Modifier.padding(12.dp)) {
            Box(modifier = Modifier.fillMaxWidth().height(72.dp)
                .clip(RoundedCornerShape(10.dp)).background(color.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center) {
                Icon(painterResource(icon), null, tint = color, modifier = Modifier.size(32.dp))
            }
            Spacer(Modifier.height(8.dp))
            Text(title, style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.SemiBold, maxLines = 2, overflow = TextOverflow.Ellipsis)
            Text(duration, style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

private fun getGreeting() = when (Calendar.getInstance().get(Calendar.HOUR_OF_DAY)) {
    in 0..11 -> "Morning"; in 12..16 -> "Afternoon"; else -> "Evening"
}