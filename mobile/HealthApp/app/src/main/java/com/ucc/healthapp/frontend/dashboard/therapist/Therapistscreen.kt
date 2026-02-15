package com.ucc.healthapp.frontend.dashboard.therapist

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun TherapistScreen() {
    var selectedFilter by remember { mutableIntStateOf(0) }
    val filters = listOf("All", "Online", "In-Person", "Available Today")

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(20.dp)
    ) {
        // Header
        item {
            TherapistHeader()
        }

        // Search Bar
        item {
            SearchBar()
        }

        // Filters
        item {
            FilterChips(
                filters = filters,
                selectedFilter = selectedFilter,
                onFilterSelected = { selectedFilter = it }
            )
        }

        // Emergency Resources
        item {
            EmergencyResourcesCard()
        }

        // Featured Therapists
        item {
            Text(
                text = "Featured Therapists",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }

        // Therapist Cards
        items(5) { index ->
            TherapistCard(
                name = when(index) {
                    0 -> "Dr. Sarah Mitchell"
                    1 -> "Dr. James Chen"
                    2 -> "Dr. Emily Rodriguez"
                    3 -> "Dr. Michael Thompson"
                    else -> "Dr. Lisa Anderson"
                },
                specialty = when(index) {
                    0 -> "Anxiety & Depression"
                    1 -> "Trauma & PTSD"
                    2 -> "Relationships & Family"
                    3 -> "Stress Management"
                    else -> "Life Transitions"
                },
                rating = when(index) {
                    0 -> 4.9
                    1 -> 4.8
                    2 -> 4.9
                    3 -> 4.7
                    else -> 4.8
                },
                reviewCount = when(index) {
                    0 -> 127
                    1 -> 94
                    2 -> 156
                    3 -> 78
                    else -> 103
                },
                price = when(index) {
                    0 -> 120
                    1 -> 150
                    2 -> 130
                    3 -> 110
                    else -> 140
                },
                available = index % 2 == 0,
                isOnline = index != 2
            )
        }

        // Support Groups
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "Support Groups",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
        }

        item {
            SupportGroupsCard()
        }
    }
}

@Composable
private fun TherapistHeader() {
    Column {
        Text(
            text = "Find a Therapist",
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Connect with licensed mental health professionals",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun SearchBar() {
    OutlinedTextField(
        value = "",
        onValueChange = {},
        modifier = Modifier.fillMaxWidth(),
        placeholder = { Text("Search by name, specialty, or location...") },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search"
            )
        },
        trailingIcon = {
            IconButton(onClick = { /* Advanced filters */ }) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Filters"
                )
            }
        },
        shape = RoundedCornerShape(12.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = MaterialTheme.colorScheme.primary,
            unfocusedBorderColor = MaterialTheme.colorScheme.outline
        )
    )
}

@Composable
private fun FilterChips(
    filters: List<String>,
    selectedFilter: Int,
    onFilterSelected: (Int) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        filters.forEachIndexed { index, filter ->
            FilterChip(
                selected = selectedFilter == index,
                onClick = { onFilterSelected(index) },
                label = { Text(filter) },
                leadingIcon = if (selectedFilter == index) {
                    {
                        Icon(
                            imageVector = Icons.Default.Check,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                } else null
            )
        }
    }
}

@Composable
private fun EmergencyResourcesCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFFFEBEE)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFD32F2F)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.AccountBox,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(24.dp)
                )
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = "Crisis Support",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFB71C1C)
                )
                Text(
                    text = "Available 24/7 for immediate help",
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFFB71C1C).copy(alpha = 0.8f)
                )
            }

            Button(
                onClick = { /* Call crisis line */ },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFFD32F2F)
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(text = "Call")
            }
        }
    }
}

@Composable
private fun TherapistCard(
    name: String,
    specialty: String,
    rating: Double,
    reviewCount: Int,
    price: Int,
    available: Boolean,
    isOnline: Boolean
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { /* View therapist profile */ },
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top
            ) {
                // Profile Picture Placeholder
                Box(
                    modifier = Modifier
                        .size(60.dp)
                        .clip(CircleShape)
                        .background(MaterialTheme.colorScheme.primaryContainer),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = name.split(" ").map { it.first() }.joinToString(""),
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )

                    Text(
                        text = specialty,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = null,
                            tint = Color(0xFFFFC107),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "$rating",
                            style = MaterialTheme.typography.bodySmall,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = " ($reviewCount reviews)",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = "$$price",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "per session",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Tags
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                if (isOnline) {
                    Tag(text = "Online", color = Color(0xFF2196F3))
                } else {
                    Tag(text = "In-Person", color = Color(0xFF4CAF50))
                }

                if (available) {
                    Tag(text = "Available Today", color = Color(0xFF4CAF50))
                }

                Tag(text = "Licensed", color = MaterialTheme.colorScheme.tertiary)
            }

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = { /* View profile */ },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(text = "View Profile")
                }

                Button(
                    onClick = { /* Book appointment */ },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(text = "Book Now")
                }
            }
        }
    }
}

@Composable
private fun Tag(
    text: String,
    color: Color
) {
    Surface(
        shape = RoundedCornerShape(6.dp),
        color = color.copy(alpha = 0.1f)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
private fun SupportGroupsCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Text(
                text = "Join a Support Group",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "Connect with others who understand what you're going through",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(16.dp))

            listOf(
                Triple("Anxiety Support Circle", "Tuesdays, 6 PM", "12 members"),
                Triple("Depression Recovery Group", "Thursdays, 7 PM", "8 members"),
                Triple("Stress Management Workshop", "Saturdays, 10 AM", "15 members")
            ).forEach { (name, time, members) ->
                SupportGroupItem(name, time, members)
                Spacer(modifier = Modifier.height(12.dp))
            }

            Button(
                onClick = {},
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "Browse All Groups")
            }
        }
    }
}

@Composable
private fun SupportGroupItem(
    name: String,
    time: String,
    members: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
            .clickable { /* View group details */ }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Person,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier.size(20.dp)
            )
        }

        Spacer(modifier = Modifier.width(12.dp))

        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = name,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium
            )
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = time,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.width(12.dp))
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = members,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        Icon(
            imageVector = Icons.Default.ArrowForward,
            contentDescription = "View",
            tint = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}