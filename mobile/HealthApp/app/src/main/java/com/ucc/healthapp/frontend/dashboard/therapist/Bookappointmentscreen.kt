package com.ucc.healthapp.frontend.dashboard.therapist

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.VideoCall
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.TextStyle
import java.util.Locale

// ─────────────────────────────────────────────────────────────────────────────
// Internal booking helpers
// ─────────────────────────────────────────────────────────────────────────────

private data class TimeSlot(val label: String, val available: Boolean)

/**
 * Returns a deterministic set of time slots for [date].
 * Weekends have shorter hours; availability is derived from the day-of-month
 * for a realistic-looking UI without a real back-end.
 * Replace with a repository / network call in production.
 */
@RequiresApi(Build.VERSION_CODES.O)
private fun timeSlotsForDate(date: LocalDate): List<TimeSlot> {
    val isWeekend =
        date.dayOfWeek == DayOfWeek.SATURDAY || date.dayOfWeek == DayOfWeek.SUNDAY

    val slots = if (isWeekend) {
        listOf("10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM")
    } else {
        listOf(
            "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM",
            "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
        )
    }

    return slots.mapIndexed { index, label ->
        TimeSlot(label, available = (index + date.dayOfMonth) % 3 != 0)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// BookAppointmentScreen
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Full-screen booking flow.
 *
 * Lets the user select:
 *  - Session delivery mode (Online / In-Person)
 *  - A calendar date within the next 3 months
 *  - An available time slot for that date
 *  - Optional notes for the therapist
 *
 * On confirmation, [onBookingConfirmed] is called with the selected values so
 * the caller ([TherapistScreen]) can construct a [BookingResult] and forward
 * it to the host.
 *
 * @param profile             The [TherapistProfile] being booked.
 * @param onBack              Navigates back to the profile detail screen.
 * @param onBookingConfirmed  Invoked with (date, timeSlot, mode, notes) on confirm.
 */
@RequiresApi(Build.VERSION_CODES.O)
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookAppointmentScreen(
    profile: TherapistProfile,
    onBack: () -> Unit,
    onBookingConfirmed: (
        date: LocalDate,
        timeSlot: String,
        mode: SessionMode,
        notes: String,
    ) -> Unit,
) {
    val therapist = profile.therapist
    val today = LocalDate.now()

    var currentMonth by remember { mutableStateOf(YearMonth.now()) }
    var selectedDate by remember { mutableStateOf<LocalDate?>(null) }
    var selectedSlot by remember { mutableStateOf<String?>(null) }
    var selectedMode by remember {
        mutableStateOf(
            if (therapist.isOnline) SessionMode.Online else SessionMode.InPerson,
        )
    }
    var notes by remember { mutableStateOf("") }
    var showConfirmDialog by remember { mutableStateOf(false) }

    val timeSlots: List<TimeSlot> = remember(selectedDate) {
        selectedDate?.let(::timeSlotsForDate) ?: emptyList()
    }

    val canConfirm = selectedDate != null && selectedSlot != null

    val confirmButtonLabel = if (canConfirm) {
        val d = selectedDate!!
        val monthName = d.month.getDisplayName(TextStyle.SHORT, Locale.getDefault())
        "Confirm — ${d.dayOfMonth} $monthName, $selectedSlot"
    } else {
        "Select a date and time to continue"
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Book Appointment", fontWeight = FontWeight.SemiBold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Navigate back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface,
                ),
            )
        },
        bottomBar = {
            Surface(shadowElevation = 8.dp, color = MaterialTheme.colorScheme.surface) {
                Button(
                    onClick = { showConfirmDialog = true },
                    enabled = canConfirm,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 14.dp)
                        .height(52.dp),
                    shape = RoundedCornerShape(14.dp),
                ) {
                    Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(8.dp))
                    Text(confirmButtonLabel, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }
        },
    ) { innerPadding ->

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(innerPadding),
            contentPadding = PaddingValues(bottom = 24.dp),
        ) {
            item(key = "therapist_strip") { TherapistSummaryStrip(profile) }

            item(key = "session_type") {
                BookingSection("Session Type") {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        SessionModeToggle(
                            label = "Video / Online", icon = Icons.Default.VideoCall,
                            selected = selectedMode == SessionMode.Online,
                            enabled = therapist.isOnline, modifier = Modifier.weight(1f),
                            onClick = { selectedMode = SessionMode.Online },
                        )
                        SessionModeToggle(
                            label = "In-Person", icon = Icons.Default.Place,
                            selected = selectedMode == SessionMode.InPerson,
                            enabled = true, modifier = Modifier.weight(1f),
                            onClick = { selectedMode = SessionMode.InPerson },
                        )
                    }
                }
            }

            item(key = "calendar") {
                BookingSection("Select a Date") {
                    CalendarView(
                        currentMonth = currentMonth, selectedDate = selectedDate,
                        today = today,
                        onMonthChange = { delta ->
                            currentMonth = currentMonth.plusMonths(delta.toLong())
                            selectedSlot = null
                        },
                        onDateSelected = { date ->
                            selectedDate = date
                            selectedSlot = null
                        },
                    )
                }
            }

            item(key = "time_slots") {
                AnimatedVisibility(
                    visible = selectedDate != null,
                    enter = fadeIn() + expandVertically(),
                    exit = fadeOut() + shrinkVertically(),
                ) {
                    val sectionTitle = selectedDate?.let { d ->
                        "Available Times — ${d.dayOfWeek.getDisplayName(TextStyle.FULL, Locale.getDefault())}, ${d.dayOfMonth} ${d.month.getDisplayName(TextStyle.FULL, Locale.getDefault())}"
                    } ?: "Available Times"

                    BookingSection(sectionTitle) {
                        if (timeSlots.none { it.available }) {
                            Text(
                                "No slots available on this date. Please choose another day.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        } else {
                            val columns = 4
                            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                timeSlots.chunked(columns).forEach { rowSlots ->
                                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                        rowSlots.forEach { slot ->
                                            TimeSlotChip(
                                                label = slot.label,
                                                selected = selectedSlot == slot.label,
                                                available = slot.available,
                                                modifier = Modifier.weight(1f),
                                                onClick = { if (slot.available) selectedSlot = slot.label },
                                            )
                                        }
                                        repeat(columns - rowSlots.size) { Spacer(Modifier.weight(1f)) }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            item(key = "notes") {
                BookingSection("Notes for Therapist (Optional)") {
                    OutlinedTextField(
                        value = notes, onValueChange = { notes = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = {
                            Text(
                                "E.g. what you'd like to focus on, any concerns…",
                                style = MaterialTheme.typography.bodyMedium,
                            )
                        },
                        minLines = 3, maxLines = 5,
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = MaterialTheme.colorScheme.primary,
                            unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                        ),
                    )
                }
            }

            item(key = "pricing") {
                BookingSection("Pricing") {
                    PricingSummary(therapist.pricePerSession, selectedMode)
                }
            }

            item(key = "bottom_spacer") { Spacer(Modifier.height(8.dp)) }
        }
    }

    if (showConfirmDialog && selectedDate != null && selectedSlot != null) {
        ConfirmBookingDialog(
            profile = profile, date = selectedDate!!, timeSlot = selectedSlot!!,
            mode = selectedMode, notes = notes,
            onConfirm = {
                showConfirmDialog = false
                onBookingConfirmed(selectedDate!!, selectedSlot!!, selectedMode, notes)
            },
            onDismiss = { showConfirmDialog = false },
        )
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Therapist summary strip
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun TherapistSummaryStrip(profile: TherapistProfile) {
    val therapist = profile.therapist
    Card(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 16.dp),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Box(
                modifier = Modifier.size(56.dp).clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    initialsFrom(therapist.name),
                    style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer,
                )
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(therapist.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text(therapist.specialty, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.height(2.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Star, null, tint = Color(0xFFFFC107), modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("${therapist.rating} · ${therapist.reviewCount} reviews", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            Column(horizontalAlignment = Alignment.End) {
                Text("$${therapist.pricePerSession}", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Text("per session", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun BookingSection(title: String, content: @Composable () -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
        content()
    }
    HorizontalDivider(modifier = Modifier.padding(horizontal = 20.dp), color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))
}

// ─────────────────────────────────────────────────────────────────────────────
// Session mode toggle
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun SessionModeToggle(
    label: String, icon: ImageVector, selected: Boolean,
    enabled: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit,
) {
    val containerColor = when {
        !enabled -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
        selected -> MaterialTheme.colorScheme.primaryContainer
        else -> MaterialTheme.colorScheme.surface
    }
    val contentColor = when {
        !enabled -> MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)
        selected -> MaterialTheme.colorScheme.onPrimaryContainer
        else -> MaterialTheme.colorScheme.onSurface
    }

    Surface(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .then(if (enabled) Modifier.clickable(onClick = onClick) else Modifier)
            .border(
                width = if (selected) 2.dp else 1.dp,
                color = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                shape = RoundedCornerShape(12.dp),
            ),
        shape = RoundedCornerShape(12.dp), color = containerColor,
    ) {
        Column(Modifier.padding(14.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Icon(icon, null, tint = contentColor, modifier = Modifier.size(22.dp))
            Text(label, style = MaterialTheme.typography.labelMedium, color = contentColor, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center)
            if (!enabled) Text("Not available", style = MaterialTheme.typography.labelSmall, color = contentColor)
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Calendar
// ─────────────────────────────────────────────────────────────────────────────

private val DAY_HEADERS = listOf("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa")

@RequiresApi(Build.VERSION_CODES.O)
@Composable
private fun CalendarView(
    currentMonth: YearMonth, selectedDate: LocalDate?,
    today: LocalDate, onMonthChange: (Int) -> Unit, onDateSelected: (LocalDate) -> Unit,
) {
    val firstDay = currentMonth.atDay(1)
    val startOffset = firstDay.dayOfWeek.value % 7
    val daysInMonth = currentMonth.lengthOfMonth()
    val totalRows = (startOffset + daysInMonth + 6) / 7
    val minMonth = YearMonth.now()
    val maxMonth = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        YearMonth.now().plusMonths(3)
    } else {
        TODO("VERSION.SDK_INT < O")
    }

    Card(shape = RoundedCornerShape(16.dp), elevation = CardDefaults.cardElevation(1.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
        Column(Modifier.padding(16.dp)) {
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
                IconButton(onClick = { onMonthChange(-1) }, enabled = currentMonth > minMonth) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, "Previous month")
                }
                Text(
                    "${currentMonth.month.getDisplayName(TextStyle.FULL, Locale.getDefault())} ${currentMonth.year}",
                    style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold,
                )
                IconButton(onClick = { onMonthChange(1) }, enabled = currentMonth < maxMonth) {
                    Icon(Icons.AutoMirrored.Filled.ArrowForward, "Next month")
                }
            }
            Spacer(Modifier.height(8.dp))
            Row(Modifier.fillMaxWidth()) {
                DAY_HEADERS.forEach { day ->
                    Text(day, Modifier.weight(1f), textAlign = TextAlign.Center, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            Spacer(Modifier.height(8.dp))
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                for (row in 0 until totalRows) {
                    Row(Modifier.fillMaxWidth()) {
                        for (col in 0..6) {
                            val dayNumber = row * 7 + col - startOffset + 1
                            if (dayNumber < 1 || dayNumber > daysInMonth) {
                                Box(Modifier.weight(1f).aspectRatio(1f))
                            } else {
                                val date = currentMonth.atDay(dayNumber)
                                DayCell(
                                    day = dayNumber,
                                    isSelected = selectedDate != null && date.isEqual(selectedDate),
                                    isToday = date.isEqual(today),
                                    isPast = date.isBefore(today),
                                    modifier = Modifier.weight(1f),
                                    onClick = { onDateSelected(date) },
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DayCell(day: Int, isSelected: Boolean, isToday: Boolean, isPast: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    val bgColor = when {
        isSelected -> MaterialTheme.colorScheme.primary
        isToday -> MaterialTheme.colorScheme.primaryContainer
        else -> Color.Transparent
    }
    val textColor = when {
        isSelected -> MaterialTheme.colorScheme.onPrimary
        isPast -> MaterialTheme.colorScheme.onSurface.copy(alpha = 0.3f)
        isToday -> MaterialTheme.colorScheme.onPrimaryContainer
        else -> MaterialTheme.colorScheme.onSurface
    }
    Box(
        modifier = modifier.aspectRatio(1f).clip(CircleShape).background(bgColor)
            .then(if (!isPast) Modifier.clickable(onClick = onClick) else Modifier),
        contentAlignment = Alignment.Center,
    ) {
        Text(day.toString(), style = MaterialTheme.typography.bodySmall, fontWeight = if (isSelected || isToday) FontWeight.Bold else FontWeight.Normal, color = textColor, textAlign = TextAlign.Center)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Time slot chip
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun TimeSlotChip(label: String, selected: Boolean, available: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    val bgColor = when {
        !available -> MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
        selected -> MaterialTheme.colorScheme.primary
        else -> MaterialTheme.colorScheme.surface
    }
    val textColor = when {
        !available -> MaterialTheme.colorScheme.onSurface.copy(alpha = 0.35f)
        selected -> MaterialTheme.colorScheme.onPrimary
        else -> MaterialTheme.colorScheme.onSurface
    }
    val borderColor = when {
        selected -> MaterialTheme.colorScheme.primary
        !available -> MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
        else -> MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
    }
    Surface(
        modifier = modifier.clip(RoundedCornerShape(10.dp))
            .then(if (available) Modifier.clickable(onClick = onClick) else Modifier)
            .border(if (selected) 2.dp else 1.dp, borderColor, RoundedCornerShape(10.dp)),
        shape = RoundedCornerShape(10.dp), color = bgColor,
    ) {
        Text(label, style = MaterialTheme.typography.labelSmall, color = textColor, fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal, textAlign = TextAlign.Center, modifier = Modifier.fillMaxWidth().padding(vertical = 10.dp, horizontal = 4.dp))
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pricing
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun PricingSummary(pricePerSession: Int, selectedMode: SessionMode) {
    Card(shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)), elevation = CardDefaults.cardElevation(0.dp)) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            PricingRow("Session fee", "$$pricePerSession")
            PricingRow("Platform fee", "$0")
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
            PricingRow("Total", "$$pricePerSession", bold = true)
            Text("Session type: ${if (selectedMode == SessionMode.Online) "Video / Online" else "In-Person"}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun PricingRow(label: String, value: String, bold: Boolean = false) {
    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, style = MaterialTheme.typography.bodyMedium, fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal, color = MaterialTheme.colorScheme.onSurface)
        Text(value, style = MaterialTheme.typography.bodyMedium, fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal, color = if (bold) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation dialog
// ─────────────────────────────────────────────────────────────────────────────

@RequiresApi(Build.VERSION_CODES.O)
@Composable
private fun ConfirmBookingDialog(
    profile: TherapistProfile, date: LocalDate, timeSlot: String,
    mode: SessionMode, notes: String, onConfirm: () -> Unit, onDismiss: () -> Unit,
) {
    val dateString = buildString {
        append(date.dayOfWeek.getDisplayName(TextStyle.FULL, Locale.getDefault()))
        append(", "); append(date.dayOfMonth); append(" ")
        append(date.month.getDisplayName(TextStyle.FULL, Locale.getDefault()))
        append(" "); append(date.year)
    }

    Dialog(onDismissRequest = onDismiss) {
        Card(shape = RoundedCornerShape(20.dp), elevation = CardDefaults.cardElevation(8.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)) {
            Column(Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Box(Modifier.size(64.dp).clip(CircleShape).background(MaterialTheme.colorScheme.primaryContainer), Alignment.Center) {
                    Icon(Icons.Default.DateRange, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(32.dp))
                }
                Text("Confirm Your Booking", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                Card(shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)), elevation = CardDefaults.cardElevation(0.dp)) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        ConfirmRow(Icons.Default.Person,        "Therapist", profile.therapist.name)
                        ConfirmRow(Icons.Default.DateRange,     "Date",      dateString)
                        ConfirmRow(Icons.Default.Notifications, "Time",      timeSlot)
                        ConfirmRow(Icons.Default.VideoCall,     "Type",      if (mode == SessionMode.Online) "Video / Online" else "In-Person")
                        ConfirmRow(Icons.Default.Info,          "Fee",       "$${profile.therapist.pricePerSession}")
                        if (notes.isNotBlank()) ConfirmRow(Icons.Default.Edit, "Notes", notes)
                    }
                }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedButton(onClick = onDismiss, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp)) { Text("Cancel") }
                    Button(onClick = onConfirm, modifier = Modifier.weight(1f), shape = RoundedCornerShape(12.dp)) {
                        Icon(Icons.Default.Check, null, modifier = Modifier.size(16.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Confirm", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun ConfirmRow(icon: ImageVector, label: String, value: String) {
    Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        Icon(icon, null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp).padding(top = 2.dp))
        Column {
            Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant, fontWeight = FontWeight.Medium)
            Text(value, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.SemiBold)
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Previews
// ─────────────────────────────────────────────────────────────────────────────

@RequiresApi(Build.VERSION_CODES.O)
@Preview(showBackground = true, showSystemUi = true)
@Composable
fun BookAppointmentScreenPreview() {
    MaterialTheme {
        BookAppointmentScreen(
            profile = sampleTherapistProfiles.values.first(),
            onBack = {},
            onBookingConfirmed = { _, _, _, _ -> },
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun PricingSummaryPreview() {
    MaterialTheme {
        PricingSummary(pricePerSession = 120, selectedMode = SessionMode.Online)
    }
}