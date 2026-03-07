package com.ucc.healthapp.frontend.dashboard.resources

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Map
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ─── Open Map Intent ─────────────────────────────────────────────────────────

fun openMap(context: Context, parish: ParishLocation) {
    // Opens Google Maps (or any installed map app) at the parish coordinates
    // with a labelled pin
    val uri = Uri.parse(
        "geo:${parish.latitude},${parish.longitude}?q=${parish.latitude},${parish.longitude}(${
            Uri.encode(parish.name + " Parish, Jamaica")
        })"
    )
    val intent = Intent(Intent.ACTION_VIEW, uri).apply {
        setPackage("com.google.android.apps.maps") // prefer Google Maps
    }
    // Fallback: if Google Maps not installed, open with any maps app
    if (intent.resolveActivity(context.packageManager) != null) {
        context.startActivity(intent)
    } else {
        val fallback = Intent(Intent.ACTION_VIEW, uri)
        context.startActivity(Intent.createChooser(fallback, "Open map with…"))
    }
}

// ─── Parish Locations Card ───────────────────────────────────────────────────

@Composable
fun ParishLocationsCard(
    parishes: List<ParishLocation> = jamaicaParishes,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var selectedCounty by remember { mutableStateOf("All") }

    val counties = listOf("All", "Surrey", "Middlesex", "Cornwall")

    val filtered = remember(selectedCounty) {
        if (selectedCounty == "All") parishes
        else parishes.filter { it.county == selectedCounty }
    }

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            // ── Header ────────────────────────────────────────────────────────
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Map,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = "Resources by Parish",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "Jamaica — tap a parish to open map",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ── County Filter Chips ───────────────────────────────────────────
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                counties.forEach { county ->
                    val selected = selectedCounty == county
                    FilterChip(
                        selected = selected,
                        onClick = { selectedCounty = county },
                        label = {
                            Text(
                                text = county,
                                style = MaterialTheme.typography.labelSmall,
                                fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // ── Parish Grid ───────────────────────────────────────────────────
            // Fixed height so LazyVerticalGrid works inside LazyColumn
            val gridHeight = (((filtered.size + 1) / 2) * 90 + ((filtered.size + 1) / 2) * 10).dp

            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(gridHeight),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                userScrollEnabled = false // outer LazyColumn handles scroll
            ) {
                items(filtered, key = { it.name }) { parish ->
                    ParishChip(
                        parish = parish,
                        onClick = { openMap(context, parish) }
                    )
                }
            }
        }
    }
}

// ─── Individual Parish Chip ───────────────────────────────────────────────────

@Composable
private fun ParishChip(
    parish: ParishLocation,
    onClick: () -> Unit
) {
    var pressed by remember { mutableStateOf(false) }

    val bgColor by animateColorAsState(
        targetValue = if (pressed) parish.accentColor.copy(alpha = 0.18f)
        else parish.accentColor.copy(alpha = 0.10f),
        animationSpec = tween(200),
        label = "chipBg_${parish.name}"
    )

    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .height(80.dp)
            .clip(RoundedCornerShape(12.dp))
            .clickable {
                pressed = true
                onClick()
            },
        shape = RoundedCornerShape(12.dp),
        color = bgColor
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Pin icon circle
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(parish.accentColor.copy(alpha = 0.20f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = null,
                    tint = parish.accentColor,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.width(10.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = parish.name,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = parish.accentColor,
                    fontSize = 13.sp
                )
                Text(
                    text = "${parish.resourceCount} resources",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}