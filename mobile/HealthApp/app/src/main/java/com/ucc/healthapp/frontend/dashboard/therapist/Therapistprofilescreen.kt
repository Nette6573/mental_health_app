package com.ucc.healthapp.frontend.dashboard.therapist

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ─────────────────────────────────────────────────────────────────────────────
// TherapistProfileScreen
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Full-detail profile screen for a single therapist.
 *
 * Looks up [therapistId] in [sampleTherapistProfiles]; in production this would
 * be driven by a ViewModel that fetches the profile from the repository.
 *
 * @param therapistId     Stable ID matching [Therapist.id].
 * @param onBack          Navigates back to the list.
 * @param onBookAppointment  Navigates forward to the booking flow.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TherapistProfileScreen(
    therapistId: String,
    onBack: () -> Unit,
    onBookAppointment: (TherapistProfile) -> Unit,
) {
    val profile = sampleTherapistProfiles[therapistId]

    // Guard: show a safe error state when the profile is missing.
    // In production this state would come from a ViewModel (Loading / Error / Success).
    if (profile == null) {
        ProfileNotFoundScreen(onBack = onBack)
        return
    }

    val therapist = profile.therapist
    val initials = initialsFrom(therapist.name)

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Therapist Profile",
                        fontWeight = FontWeight.SemiBold,
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Navigate back",
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface,
                ),
            )
        },
        bottomBar = {
            Surface(
                shadowElevation = 8.dp,
                color = MaterialTheme.colorScheme.surface,
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 14.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "$${therapist.pricePerSession} / session",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                        )
                        Text(
                            text = if (therapist.availableToday) "Available today"
                            else "Next slot: Tomorrow",
                            style = MaterialTheme.typography.bodySmall,
                            color = if (therapist.availableToday) Color(0xFF2E7D32)
                            else MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Button(
                        onClick = { onBookAppointment(profile) },
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.height(52.dp),
                        contentPadding = PaddingValues(horizontal = 28.dp),
                    ) {
                        Icon(
                            imageVector = Icons.Default.DateRange,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp),
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Book Appointment",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                        )
                    }
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

            // ── Hero ──────────────────────────────────────────────────────
            item(key = "hero") {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f))
                        .padding(24.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        // Avatar
                        Box(
                            modifier = Modifier
                                .size(96.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primaryContainer)
                                .border(3.dp, MaterialTheme.colorScheme.primary, CircleShape),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = initials,
                                style = MaterialTheme.typography.headlineMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                            )
                        }

                        // Name / specialty / experience
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = therapist.name,
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold,
                            )
                            Text(
                                text = therapist.specialty,
                                style = MaterialTheme.typography.titleSmall,
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.Medium,
                            )
                            Text(
                                text = "${profile.yearsExperience} years experience",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }

                        // Quick stats
                        Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                            QuickStat(
                                icon = Icons.Default.Star,
                                value = therapist.rating.toString(),
                                label = "Rating",
                                iconTint = Color(0xFFFFC107),
                            )
                            QuickStat(
                                icon = Icons.Default.Person,
                                value = "${therapist.reviewCount}",
                                label = "Reviews",
                                iconTint = MaterialTheme.colorScheme.primary,
                            )
                            QuickStat(
                                icon = Icons.Default.DateRange,
                                value = "${profile.yearsExperience}y",
                                label = "Experience",
                                iconTint = MaterialTheme.colorScheme.tertiary,
                            )
                        }

                        // Availability / mode tags
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.horizontalScroll(rememberScrollState()),
                        ) {
                            if (therapist.isOnline) {
                                StatusTag("Online", Color(0xFF1565C0))
                            } else {
                                StatusTag("In-Person", Color(0xFF2E7D32))
                            }
                            if (therapist.availableToday) {
                                StatusTag("Available Today", Color(0xFF2E7D32))
                            }
                            StatusTag("Licensed", MaterialTheme.colorScheme.tertiary)
                        }
                    }
                }
            }

            // ── About ────────────────────────────────────────────────────
            item(key = "about") {
                ProfileSection(title = "About") {
                    Text(
                        text = profile.bio,
                        style = MaterialTheme.typography.bodyLarge,
                        color = MaterialTheme.colorScheme.onSurface,
                        lineHeight = 24.sp,
                    )
                }
            }

            // ── Session Types ────────────────────────────────────────────
            item(key = "session_types") {
                ProfileSection(title = "Session Types") {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.horizontalScroll(rememberScrollState()),
                    ) {
                        profile.sessionTypes.forEach { type ->
                            OutlinedSessionChip(label = type)
                        }
                    }
                }
            }

            // ── Therapeutic Approaches ───────────────────────────────────
            item(key = "approaches") {
                ProfileSection(title = "Therapeutic Approaches") {
                    ApproachesGrid(approaches = profile.approaches)
                }
            }

            // ── Languages ───────────────────────────────────────────────
            item(key = "languages") {
                ProfileSection(title = "Languages") {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.horizontalScroll(rememberScrollState()),
                    ) {
                        profile.languages.forEach { lang ->
                            StatusTag(lang, MaterialTheme.colorScheme.secondary)
                        }
                    }
                }
            }

            // ── Education ───────────────────────────────────────────────
            item(key = "education") {
                ProfileSection(title = "Education") {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        profile.education.forEach { edu ->
                            // Icons.Default.School is the semantically correct icon here.
                            CredentialItem(icon = Icons.Default.School, text = edu)
                        }
                    }
                }
            }

            // ── Certifications ──────────────────────────────────────────
            item(key = "certifications") {
                ProfileSection(title = "Certifications & Licences") {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        profile.certifications.forEach { cert ->
                            CredentialItem(icon = Icons.Default.CheckCircle, text = cert)
                        }
                    }
                }
            }

            // ── Insurance ───────────────────────────────────────────────
            item(key = "insurance") {
                ProfileSection(title = "Insurance Accepted") {
                    Row(
                        modifier = Modifier.horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        profile.insuranceAccepted.forEach { ins ->
                            StatusTag(ins, MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }

            // ── Reviews ─────────────────────────────────────────────────
            item(key = "reviews") {
                ProfileSection(title = "Client Reviews (${profile.reviews.size})") {
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        profile.reviews.forEach { review ->
                            ReviewCard(review = review)
                        }
                    }
                }
            }

            item(key = "bottom_spacer") { Spacer(modifier = Modifier.height(8.dp)) }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile not found
// ─────────────────────────────────────────────────────────────────────────────

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ProfileNotFoundScreen(onBack: () -> Unit) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Therapist Profile") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Navigate back")
                    }
                },
            )
        },
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            contentAlignment = Alignment.Center,
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Text(
                    text = "Profile not found",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.SemiBold,
                )
                Text(
                    text = "This therapist profile could not be loaded.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-composables
// ─────────────────────────────────────────────────────────────────────────────

@Composable
private fun QuickStat(
    icon: ImageVector,
    value: String,
    label: String,
    iconTint: Color,
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(2.dp),
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = iconTint,
            modifier = Modifier.size(20.dp),
        )
        Text(
            text = value,
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
        )
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
        )
    }
}

@Composable
private fun ProfileSection(title: String, content: @Composable () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
        )
        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
        content()
    }
}

@Composable
private fun OutlinedSessionChip(label: String) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = Color.Transparent,
        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.primary),
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.primary,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
        )
    }
}

/**
 * Renders [approaches] in rows of 3, wrapping cleanly for any list length.
 * Uses plain Rows instead of a LazyVerticalGrid to avoid nested scroll issues.
 */
@Composable
private fun ApproachesGrid(approaches: List<String>) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        approaches.chunked(3).forEach { rowItems ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                rowItems.forEach { item ->
                    StatusTag(text = item, color = MaterialTheme.colorScheme.tertiary)
                }
            }
        }
    }
}

@Composable
private fun CredentialItem(icon: ImageVector, text: String) {
    Row(
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary,
            modifier = Modifier
                .size(18.dp)
                .padding(top = 2.dp),
        )
        Text(
            text = text,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurface,
        )
    }
}

@Composable
private fun ReviewCard(review: ClientReview) {
    Card(
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                // Reviewer avatar
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.secondaryContainer),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = review.initials,
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSecondaryContainer,
                    )
                }

                Column(modifier = Modifier.weight(1f)) {
                    // Star row
                    Row {
                        repeat(review.rating) {
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = null,
                                tint = Color(0xFFFFC107),
                                modifier = Modifier.size(14.dp),
                            )
                        }
                        repeat(5 - review.rating) {
                            Icon(
                                imageVector = Icons.Default.Star,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.outlineVariant,
                                modifier = Modifier.size(14.dp),
                            )
                        }
                    }
                    Text(
                        text = review.date,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            Text(
                text = review.comment,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurface,
                lineHeight = 22.sp,
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Previews
// ─────────────────────────────────────────────────────────────────────────────

@Preview(showBackground = true, showSystemUi = true)
@Composable
fun TherapistProfileScreenPreview() {
    MaterialTheme {
        TherapistProfileScreen(
            therapistId = "t001",
            onBack = {},
            onBookAppointment = {},
        )
    }
}

@Preview(showBackground = true)
@Composable
private fun ReviewCardPreview() {
    MaterialTheme {
        ReviewCard(
            review = ClientReview(
                initials = "JM",
                rating = 5,
                date = "Jan 2025",
                comment = "Excellent experience — highly recommended.",
            ),
        )
    }
}