package com.ucc.healthapp.frontend.dashboard.paula

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties

// ─── Paula FAB ────────────────────────────────────────────────────────────────
// Drop this on any screen. Tapping it opens Paula in a full-screen in-app dialog.

@Composable
fun PaulaFab(modifier: Modifier = Modifier) {
    var showPaula by remember { mutableStateOf(false) }

    // Spring-bounce scale on mount
    val scaleAnim = remember { Animatable(0f) }
    LaunchedEffect(Unit) {
        scaleAnim.animateTo(1f, spring(dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow))
    }
    val scale by scaleAnim.asState()

    // Pulse animation while idle
    val pulseAnim = remember { Animatable(1f) }
    LaunchedEffect(Unit) {
        while (true) {
            pulseAnim.animateTo(1.08f, tween(1000, easing = FastOutSlowInEasing))
            pulseAnim.animateTo(1f,    tween(1000, easing = FastOutSlowInEasing))
        }
    }
    val pulse by pulseAnim.asState()

    Box(modifier = modifier) {
        // Outer glow ring
        Surface(
            shape = CircleShape,
            color = Color.Transparent,
            modifier = Modifier
                .size(68.dp)
                .scale(scale * pulse)
                .align(Alignment.Center)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.radialGradient(
                            listOf(
                                Color(0xFF7C3AED).copy(alpha = 0.25f),
                                Color.Transparent
                            )
                        ),
                        CircleShape
                    )
            )
        }

        // Main FAB button
        FloatingActionButton(
            onClick = { showPaula = true },
            modifier = Modifier
                .size(56.dp)
                .scale(scale)
                .align(Alignment.Center),
            shape = CircleShape,
            containerColor = Color.Transparent,
            elevation = FloatingActionButtonDefaults.elevation(
                defaultElevation = 6.dp, pressedElevation = 10.dp
            )
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(
                        Brush.linearGradient(
                            listOf(Color(0xFF7C3AED), Color(0xFF4F46E5))
                        ),
                        CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    "P",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color.White,
                    fontSize = 20.sp
                )
            }
        }
    }

    // ── Full-screen Dialog hosting the WebView ────────────────────────────────
    if (showPaula) {
        Dialog(
            onDismissRequest = { showPaula = false },
            properties = DialogProperties(
                usePlatformDefaultWidth = false,
                dismissOnBackPress = true,
                dismissOnClickOutside = false
            )
        ) {
            Surface(
                modifier = Modifier.fillMaxSize(),
                shape = RoundedCornerShape(0.dp),
                color = MaterialTheme.colorScheme.background
            ) {
                PaulaWebViewScreen(onClose = { showPaula = false })
            }
        }
    }
}