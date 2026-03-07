package com.ucc.healthapp.frontend.dashboard.overview

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// ─── Mood Line Chart ──────────────────────────────────────────────────────────
// SAFE: Single Animatable at composable scope. No InfiniteTransition anywhere.

@Composable
fun MoodLineChart(
    points: List<WeeklyMoodPoint>,
    lineColor: Color,
    modifier: Modifier = Modifier
) {
    val progressAnim = remember { Animatable(0f) }
    LaunchedEffect(Unit) {
        progressAnim.animateTo(1f, tween(900, easing = FastOutSlowInEasing))
    }
    val progress by progressAnim.asState()
    val fillColor = lineColor.copy(alpha = 0.13f)

    Canvas(modifier = modifier) {
        if (points.size < 2) return@Canvas
        val padV = 12.dp.toPx()
        val padH = 6.dp.toPx()
        val chartW = size.width - padH * 2
        val chartH = size.height - padV * 2

        val xs = points.indices.map { i -> padH + i.toFloat() * chartW / (points.size - 1) }
        val ys = points.map { p -> padV + (1f - p.intensity) * chartH }
        val clipRight = padH + chartW * progress

        val linePath = Path().apply {
            points.forEachIndexed { i, _ ->
                if (i == 0) moveTo(xs[0], ys[0])
                else {
                    val cpX = (xs[i - 1] + xs[i]) / 2f
                    cubicTo(cpX, ys[i - 1], cpX, ys[i], xs[i], ys[i])
                }
            }
        }
        val fillPath = Path().apply {
            addPath(linePath)
            lineTo(xs.last(), size.height)
            lineTo(xs.first(), size.height)
            close()
        }
        clipRect(right = clipRight) {
            drawPath(fillPath, Brush.verticalGradient(listOf(fillColor, Color.Transparent)))
            drawPath(
                linePath, color = lineColor,
                style = Stroke(2.8f.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
            )
        }
        points.forEachIndexed { i, _ ->
            if (xs[i] <= clipRight) {
                drawCircle(Color.White, 4.5f.dp.toPx(), Offset(xs[i], ys[i]))
                drawCircle(lineColor, 3f.dp.toPx(), Offset(xs[i], ys[i]))
            }
        }
    }
}

// ─── Day Labels ───────────────────────────────────────────────────────────────

@Composable
fun MoodChartDayLabels(points: List<WeeklyMoodPoint>, modifier: Modifier = Modifier) {
    Row(modifier = modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
        points.forEach { p ->
            Text(p.day, style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 10.sp)
        }
    }
}

// ─── Wellness Rings ───────────────────────────────────────────────────────────
// SAFE: Fixed number of Animatables declared unconditionally at composable scope.
// Supports exactly 3 rings — extend a0/a1/a2 if you need more.

@Composable
fun WellnessRingsChart(rings: List<WellnessRingData>, modifier: Modifier = Modifier) {
    val a0 = remember { Animatable(0f) }
    val a1 = remember { Animatable(0f) }
    val a2 = remember { Animatable(0f) }

    LaunchedEffect(rings.getOrNull(0)?.label) {
        a0.animateTo(rings.getOrNull(0)?.value ?: 0f, tween(900, easing = FastOutSlowInEasing))
    }
    LaunchedEffect(rings.getOrNull(1)?.label) {
        a1.animateTo(rings.getOrNull(1)?.value ?: 0f, tween(950, easing = FastOutSlowInEasing))
    }
    LaunchedEffect(rings.getOrNull(2)?.label) {
        a2.animateTo(rings.getOrNull(2)?.value ?: 0f, tween(1000, easing = FastOutSlowInEasing))
    }

    val v0 by a0.asState()
    val v1 by a1.asState()
    val v2 by a2.asState()
    val values = listOf(v0, v1, v2)

    Box(modifier = modifier, contentAlignment = Alignment.Center) {
        Canvas(Modifier.fillMaxSize()) {
            val cx = size.width / 2f
            val cy = size.height / 2f
            val strokeW = 10.dp.toPx()
            val gap = 12.dp.toPx()
            val maxR = minOf(cx, cy) - strokeW / 2f - 4.dp.toPx()

            rings.forEachIndexed { i, ring ->
                val r = maxR - i * (strokeW + gap)
                val sweep = values.getOrElse(i) { 0f } * 360f
                drawCircle(ring.color.copy(alpha = 0.12f), r, Offset(cx, cy), style = Stroke(strokeW))
                drawArc(
                    color = ring.color,
                    startAngle = -90f, sweepAngle = sweep, useCenter = false,
                    topLeft = Offset(cx - r, cy - r), size = Size(r * 2, r * 2),
                    style = Stroke(strokeW, cap = StrokeCap.Round)
                )
            }
        }
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            val avg = rings.mapIndexed { i, _ -> values.getOrElse(i) { 0f } }.average().toFloat()
            Text("${(avg * 100).toInt()}%", style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
            Text("Overall", style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

// ─── Ring Legend ──────────────────────────────────────────────────────────────

@Composable
fun RingLegend(rings: List<WellnessRingData>, modifier: Modifier = Modifier) {
    Column(modifier = modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        rings.forEach { ring ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                Canvas(Modifier.size(10.dp)) { drawCircle(ring.color) }
                Spacer(Modifier.width(6.dp))
                Text(ring.label, style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.weight(1f))
                Text("${(ring.value * 100).toInt()}%", style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold, color = ring.color)
            }
        }
    }
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
// SAFE: 7 Animatables declared unconditionally (one per day of the week).

@Composable
fun MiniBarChart(
    bars: List<Pair<String, Float>>,
    barColor: Color,
    modifier: Modifier = Modifier,
    barWidthDp: Dp = 16.dp
) {
    val a0 = remember { Animatable(0f) }; val a1 = remember { Animatable(0f) }
    val a2 = remember { Animatable(0f) }; val a3 = remember { Animatable(0f) }
    val a4 = remember { Animatable(0f) }; val a5 = remember { Animatable(0f) }
    val a6 = remember { Animatable(0f) }
    val allAnims = listOf(a0, a1, a2, a3, a4, a5, a6)

    bars.forEachIndexed { i, (label, target) ->
        LaunchedEffect(label) {
            allAnims.getOrNull(i)?.animateTo(target, tween(700, easing = FastOutSlowInEasing))
        }
    }

    val v0 by a0.asState(); val v1 by a1.asState(); val v2 by a2.asState()
    val v3 by a3.asState(); val v4 by a4.asState(); val v5 by a5.asState()
    val v6 by a6.asState()
    val values = listOf(v0, v1, v2, v3, v4, v5, v6)

    Column(modifier = modifier) {
        Row(
            modifier = Modifier.fillMaxWidth().height(60.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.Bottom
        ) {
            bars.forEachIndexed { i, _ ->
                val frac = values.getOrElse(i) { 0f }.coerceIn(0.04f, 1f)
                Canvas(Modifier.width(barWidthDp).fillMaxHeight(frac)) {
                    drawRoundRect(barColor, cornerRadius = CornerRadius(6.dp.toPx()), size = size)
                }
            }
        }
        Spacer(Modifier.height(4.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
            bars.forEach { (label, _) ->
                Text(label, style = MaterialTheme.typography.labelSmall, fontSize = 9.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}