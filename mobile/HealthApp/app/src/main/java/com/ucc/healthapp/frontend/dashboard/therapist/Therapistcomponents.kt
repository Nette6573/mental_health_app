package com.ucc.healthapp.frontend.dashboard.therapist

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI components
//
// These composables are intentionally package-private (no public modifier
// needed since all screens live in the same package). Extract to a :ui module
// and make them public once you introduce a multi-module structure.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Small pill-shaped tag used across the list, profile, and booking screens.
 *
 * Renders [text] in [color] against a 12 % alpha tinted background of the
 * same colour, giving a consistent, accessible look regardless of theme.
 *
 * @param text   Label displayed inside the chip.
 * @param color  Foreground (and tinted background) colour for the tag.
 */
@Composable
internal fun StatusTag(text: String, color: Color) {
    Surface(
        shape = RoundedCornerShape(6.dp),
        color = color.copy(alpha = 0.12f),
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp),
        )
    }
}