package com.ucc.healthapp.frontend.dashboard.therapist

import android.os.Build
import androidx.annotation.RequiresApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

// ─────────────────────────────────────────────────────────────────────────────
// Internal navigation state
// ─────────────────────────────────────────────────────────────────────────────

private sealed class TherapistNavState {
    /** The therapist list, search, and support group view. */
    object List : TherapistNavState()

    /** Full profile detail for a therapist identified by [therapistId]. */
    data class Profile(val therapistId: String) : TherapistNavState()

    /** Booking flow for [profile], navigated back to [originId] on back press. */
    data class Book(val profile: TherapistProfile, val originId: String) : TherapistNavState()
}

// ─────────────────────────────────────────────────────────────────────────────
// Root screen — owns the internal nav stack
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Top-level entry point for the Therapist feature.
 *
 * Manages an internal back-stack so the host (Activity / parent NavGraph) does
 * not need to know about sub-screen routing. The host only receives semantically
 * meaningful callbacks.
 *
 * @param onCallCrisisLine    Called when the user taps "Call Now" on the crisis banner.
 * @param onBrowseGroups      Called when the user taps "Browse All Groups".
 * @param onViewGroup         Called when the user taps an individual [SupportGroup].
 * @param onBookingConfirmed  Called with a fully resolved [BookingResult] on success.
 */
@RequiresApi(Build.VERSION_CODES.O)
@Composable
fun TherapistScreen(
    onCallCrisisLine: () -> Unit = {},
    onBrowseGroups: () -> Unit = {},
    onViewGroup: (SupportGroup) -> Unit = {},
    onBookingConfirmed: (BookingResult) -> Unit = {},
) {
    var navState by remember { mutableStateOf<TherapistNavState>(TherapistNavState.List) }

    when (val state = navState) {

        is TherapistNavState.List -> {
            TherapistListContent(
                onCallCrisisLine = onCallCrisisLine,
                onBrowseGroups = onBrowseGroups,
                onViewGroup = onViewGroup,
                onViewProfile = { therapist ->
                    navState = TherapistNavState.Profile(therapist.id)
                },
                onBookAppointment = { therapist ->
                    val profile = sampleTherapistProfiles[therapist.id] ?: return@TherapistListContent
                    navState = TherapistNavState.Book(profile, originId = therapist.id)
                },
            )
        }

        is TherapistNavState.Profile -> {
            TherapistProfileScreen(
                therapistId = state.therapistId,
                onBack = { navState = TherapistNavState.List },
                onBookAppointment = { profile ->
                    navState = TherapistNavState.Book(profile, originId = profile.therapist.id)
                },
            )
        }

        is TherapistNavState.Book -> {
            BookAppointmentScreen(
                profile = state.profile,
                onBack = { navState = TherapistNavState.Profile(state.originId) },
                onBookingConfirmed = { date, slot, mode, notes ->
                    onBookingConfirmed(
                        BookingResult(
                            therapistId = state.profile.therapist.id,
                            therapistName = state.profile.therapist.name,
                            date = date,
                            timeSlot = slot,
                            mode = mode,
                            notes = notes,
                        ),
                    )
                    navState = TherapistNavState.List
                },
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// List content
// ─────────────────────────────────────────────────────────────────────────────

private val filterOptions = listOf("All", "Online", "In-Person", "Available Today")

@Composable
private fun TherapistListContent(
    onCallCrisisLine: () -> Unit,
    onBrowseGroups: () -> Unit,
    onViewGroup: (SupportGroup) -> Unit,
    onViewProfile: (Therapist) -> Unit,
    onBookAppointment: (Therapist) -> Unit,
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableIntStateOf(0) }

    val displayedTherapists = remember(searchQuery, selectedFilter) {
        sampleTherapists.filter { therapist ->
            val matchesSearch = searchQuery.isBlank() ||
                    therapist.name.contains(searchQuery, ignoreCase = true) ||
                    therapist.specialty.contains(searchQuery, ignoreCase = true)
            val matchesFilter = when (selectedFilter) {
                1 -> therapist.isOnline
                2 -> !therapist.isOnline
                3 -> therapist.availableToday
                else -> true
            }
            matchesSearch && matchesFilter
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 20.dp),
    ) {
        item(key = "header") { TherapistHeader() }

        item(key = "search") {
            TherapistSearchBar(
                query = searchQuery,
                onQueryChange = { searchQuery = it },
            )
        }

        item(key = "filters") {
            FilterChipsRow(
                filters = filterOptions,
                selectedFilter = selectedFilter,
                onFilterSelected = { selectedFilter = it },
            )
        }

        item(key = "crisis") { CrisisSupportCard(onCall = onCallCrisisLine) }

        item(key = "therapists_title") {
            SectionTitle(
                title = "Featured Therapists",
                subtitle = if (displayedTherapists.isEmpty()) "No results — try adjusting your search" else null,
            )
        }

        if (displayedTherapists.isEmpty()) {
            item(key = "empty") { EmptyStateCard() }
        } else {
            items(
                count = displayedTherapists.size,
                key = { displayedTherapists[it].id },
            ) { index ->
                val therapist = displayedTherapists[index]
                TherapistCard(
                    therapist = therapist,
                    onBook = { onBookAppointment(therapist) },
                    onViewProfile = { onViewProfile(therapist) },
                )
            }
        }

        item(key = "groups_title") {
            Spacer(modifier = Modifier.height(4.dp))
            SectionTitle(title = "Support Groups")
        }

        item(key = "groups") {
            SupportGroupsCard(
                groups = sampleSupportGroups,
                onBrowseAll = onBrowseGroups,
                onViewGroup = onViewGroup,
            )
        }

        item(key = "bottom_spacer") { Spacer(modifier = Modifier.height(16.dp)) }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun TherapistHeader() {
    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(
            text = "Find a Therapist",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary,
        )
        Text(
            text = "Connect with licensed mental health professionals",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Search bar
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun TherapistSearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = Modifier.fillMaxWidth(),
        placeholder = { Text("Search by name or specialty…") },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search",
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        },
        trailingIcon = {
            if (query.isNotEmpty()) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(
                        imageVector = Icons.Default.Clear,
                        contentDescription = "Clear search",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        },
        singleLine = true,
        shape = RoundedCornerShape(12.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = MaterialTheme.colorScheme.primary,
            unfocusedBorderColor = MaterialTheme.colorScheme.outline,
        ),
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter chips
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun FilterChipsRow(
    filters: List<String>,
    selectedFilter: Int,
    onFilterSelected: (Int) -> Unit,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        filters.forEachIndexed { index, label ->
            FilterChip(
                selected = selectedFilter == index,
                onClick = { onFilterSelected(index) },
                label = { Text(label) },
                leadingIcon = if (selectedFilter == index) {
                    {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = null,
                            modifier = Modifier.size(FilterChipDefaults.IconSize),
                        )
                    }
                } else null,
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Crisis support banner
// ─────────────────────────────────────────────────────────────────────────────

private val CrisisRed = Color(0xFFD32F2F)
private val CrisisRedBg = Color(0xFFFFEBEE)
private val CrisisRedText = Color(0xFFB71C1C)

@Composable
private fun CrisisSupportCard(onCall: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CrisisRedBg),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(CrisisRed),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = Icons.Default.Phone,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(24.dp),
                )
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Crisis Support",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = CrisisRedText,
                )
                Text(
                    text = "Call 988 · Available 24/7",
                    style = MaterialTheme.typography.bodySmall,
                    color = CrisisRedText.copy(alpha = 0.85f),
                )
            }

            Button(
                onClick = onCall,
                colors = ButtonDefaults.buttonColors(containerColor = CrisisRed),
                shape = RoundedCornerShape(12.dp),
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 10.dp),
            ) {
                Icon(
                    imageVector = Icons.Default.Phone,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp),
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = "Call Now", fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Section title
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun SectionTitle(title: String, subtitle: String? = null) {
    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
        )
        if (subtitle != null) {
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun EmptyStateCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = null,
                modifier = Modifier.size(48.dp),
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Text(
                text = "No therapists found",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.SemiBold,
            )
            Text(
                text = "Try a different search term or filter",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Therapist card
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun TherapistCard(
    therapist: Therapist,
    onBook: () -> Unit,
    onViewProfile: () -> Unit,
) {
    val initials = initialsFrom(therapist.name)

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            // ── Avatar + Info + Price ──────────────────────────────────────
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top,
                horizontalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Box(
                    modifier = Modifier
                        .size(64.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = initials,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                    )
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = therapist.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                    )
                    Text(
                        text = therapist.specialty,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    StarRating(rating = therapist.rating, reviewCount = therapist.reviewCount)
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "$${therapist.pricePerSession}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary,
                    )
                    Text(
                        text = "/ session",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            // ── Tags ────────────────────────────────────────────────────────
            Row(
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.horizontalScroll(rememberScrollState()),
            ) {
                if (therapist.isOnline) {
                    StatusTag(text = "Online", color = Color(0xFF1565C0))
                } else {
                    StatusTag(text = "In-Person", color = Color(0xFF2E7D32))
                }
                if (therapist.availableToday) {
                    StatusTag(text = "Available Today", color = Color(0xFF2E7D32))
                }
                StatusTag(text = "Licensed", color = MaterialTheme.colorScheme.tertiary)
            }

            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

            // ── Actions ─────────────────────────────────────────────────────
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                OutlinedButton(
                    onClick = onViewProfile,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    border = ButtonDefaults.outlinedButtonBorder,
                ) {
                    Icon(
                        imageVector = Icons.Default.Person,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "View Profile")
                }

                Button(
                    onClick = onBook,
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                ) {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Book Now")
                }
            }
        }
    }
}

@Composable
private fun StarRating(rating: Double, reviewCount: Int) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(
            imageVector = Icons.Default.Star,
            contentDescription = null,
            tint = Color(0xFFFFC107),
            modifier = Modifier.size(16.dp),
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = rating.toString(),
            style = MaterialTheme.typography.bodySmall,
            fontWeight = FontWeight.SemiBold,
        )
        Text(
            text = " ($reviewCount reviews)",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Support groups card
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun SupportGroupsCard(
    groups: List<SupportGroup>,
    onBrowseAll: () -> Unit,
    onViewGroup: (SupportGroup) -> Unit,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    text = "Join a Support Group",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                )
                Text(
                    text = "Connect with others who understand what you're going through",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }

            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

            groups.forEach { group ->
                SupportGroupItem(group = group, onClick = { onViewGroup(group) })
            }

            Button(
                onClick = onBrowseAll,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
            ) {
                Icon(
                    imageVector = Icons.Default.Group,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp),
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "Browse All Groups", fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Composable
private fun SupportGroupItem(group: SupportGroup, onClick: () -> Unit) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
        tonalElevation = 1.dp,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = Icons.Default.Group,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.size(22.dp),
                )
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = group.name,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                )
                Spacer(modifier = Modifier.height(2.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    Icon(
                        imageVector = Icons.Default.DateRange,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(13.dp),
                    )
                    Text(
                        text = group.schedule,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Icon(
                        imageVector = Icons.Default.Group,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(13.dp),
                    )
                    Text(
                        text = group.members,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                contentDescription = "View group",
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(20.dp),
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Previews
// ─────────────────────────────────────────────────────────────────────────────

@Preview(showBackground = true, showSystemUi = true)
@Composable
fun TherapistScreenPreview() {
    MaterialTheme {
        TherapistScreen()
    }
}

@Preview(showBackground = true)
@Composable
private fun TherapistCardPreview() {
    MaterialTheme {
        TherapistCard(
            therapist = sampleTherapists.first(),
            onBook = {},
            onViewProfile = {},
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun CrisisSupportCardPreview() {
    MaterialTheme {
        CrisisSupportCard(onCall = {})
    }
}