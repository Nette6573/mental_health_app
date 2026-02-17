package com.ucc.healthapp.frontend.components.logo

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.ucc.healthapp.R
import com.ucc.healthapp.frontend.theme.HealthAppTheme

/**
 * Logo size variants for different use cases
 */
enum class LogoSize(val logoSizeDp: Dp, val spacing: Dp) {
    SMALL(40.dp, 4.dp),
    MEDIUM(80.dp, 8.dp),
    LARGE(120.dp, 12.dp),
    XLARGE(160.dp, 16.dp)
}

/**
 * Logo style variants
 */
enum class LogoStyle {
    DEFAULT,           // Just the logo image
    WITH_BACKGROUND,   // Logo with circular background
    WITH_TINT          // Logo with color tint applied
}

/**
 * Main HopePath Logo Component
 *
 * @param modifier Modifier for the logo container
 * @param size Size variant (SMALL, MEDIUM, LARGE, XLARGE)
 * @param style Style variant (DEFAULT, WITH_BACKGROUND, WITH_TINT)
 * @param showText Whether to show "HopePath" text below logo
 * @param textColor Custom color for the text (null uses theme primary)
 * @param backgroundColor Background color for WITH_BACKGROUND style
 * @param tintColor Tint color for WITH_TINT style
 * @param tagline Optional tagline text below the app name
 */
@Composable
fun HopePathLogo(
    modifier: Modifier = Modifier,
    size: LogoSize = LogoSize.MEDIUM,
    style: LogoStyle = LogoStyle.DEFAULT,
    showText: Boolean = true,
    textColor: Color? = null,
    backgroundColor: Color? = null,
    tintColor: Color? = null,
    tagline: String? = null
) {
    val finalTextColor = textColor ?: MaterialTheme.colorScheme.primary
    val finalBackgroundColor = backgroundColor ?: MaterialTheme.colorScheme.primaryContainer

    val textStyle = when (size) {
        LogoSize.SMALL -> MaterialTheme.typography.titleSmall
        LogoSize.MEDIUM -> MaterialTheme.typography.titleLarge
        LogoSize.LARGE -> MaterialTheme.typography.headlineLarge
        LogoSize.XLARGE -> MaterialTheme.typography.displaySmall
    }

    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Logo Image with style
        when (style) {
            LogoStyle.DEFAULT -> {
                DefaultLogo(
                    size = size.logoSizeDp
                )
            }
            LogoStyle.WITH_BACKGROUND -> {
                LogoWithBackground(
                    size = size.logoSizeDp,
                    backgroundColor = finalBackgroundColor
                )
            }
            LogoStyle.WITH_TINT -> {
                LogoWithTint(
                    size = size.logoSizeDp,
                    tintColor = tintColor ?: finalTextColor
                )
            }
        }

        // App Name Text
        if (showText) {
            Spacer(modifier = Modifier.height(size.spacing))

            Text(
                text = "HopePath",
                style = textStyle.copy(fontWeight = FontWeight.Bold),
                color = finalTextColor,
                textAlign = TextAlign.Center
            )
        }

        // Optional Tagline
        tagline?.let {
            Spacer(modifier = Modifier.height(size.spacing / 2))
            Text(
                text = it,
                style = when (size) {
                    LogoSize.SMALL -> MaterialTheme.typography.bodySmall
                    LogoSize.MEDIUM -> MaterialTheme.typography.bodyMedium
                    LogoSize.LARGE, LogoSize.XLARGE -> MaterialTheme.typography.bodyLarge
                },
                color = finalTextColor.copy(alpha = 0.7f),
                textAlign = TextAlign.Center
            )
        }
    }
}

/**
 * Default logo without any styling
 */
@Composable
private fun DefaultLogo(size: Dp) {
    Image(
        painter = painterResource(id = R.drawable.hopepath),
        contentDescription = "HopePath Logo",
        modifier = Modifier.size(size),
        contentScale = ContentScale.Fit
    )
}

/**
 * Logo with circular background
 */
@Composable
private fun LogoWithBackground(
    size: Dp,
    backgroundColor: Color
) {
    Box(
        modifier = Modifier
            .size(size)
            .clip(CircleShape)
            .background(backgroundColor),
        contentAlignment = Alignment.Center
    ) {
        Image(
            painter = painterResource(id = R.drawable.hopepath),
            contentDescription = "HopePath Logo",
            modifier = Modifier.size(size * 0.6f),
            contentScale = ContentScale.Fit
        )
    }
}

/**
 * Logo with color tint applied
 */
@Composable
private fun LogoWithTint(
    size: Dp,
    tintColor: Color
) {
    Image(
        painter = painterResource(id = R.drawable.hopepath),
        contentDescription = "HopePath Logo",
        modifier = Modifier.size(size),
        contentScale = ContentScale.Fit,
        colorFilter = ColorFilter.tint(tintColor)
    )
}

/**
 * Preset: Logo with tagline
 */
@Composable
fun LogoWithTagline(
    modifier: Modifier = Modifier,
    size: LogoSize = LogoSize.LARGE,
    style: LogoStyle = LogoStyle.DEFAULT,
    tagline: String = "Your Mental Health Companion"
) {
    HopePathLogo(
        modifier = modifier,
        size = size,
        style = style,
        showText = true,
        tagline = tagline
    )
}

/**
 * Preset: Compact logo (just image, no text)
 */
@Composable
fun CompactLogo(
    modifier: Modifier = Modifier,
    size: LogoSize = LogoSize.SMALL,
    style: LogoStyle = LogoStyle.DEFAULT
) {
    HopePathLogo(
        modifier = modifier,
        size = size,
        style = style,
        showText = false
    )
}

/**
 * Preset: Branded logo (with background for splash/auth screens)
 */
@Composable
fun BrandedLogo(
    modifier: Modifier = Modifier,
    size: LogoSize = LogoSize.LARGE,
    showText: Boolean = true,
    tagline: String? = null
) {
    HopePathLogo(
        modifier = modifier,
        size = size,
        style = LogoStyle.WITH_BACKGROUND,
        showText = showText,
        tagline = tagline
    )
}

// ============================================================================
// PREVIEWS
// ============================================================================

@Preview(showBackground = true, backgroundColor = 0xFFFFFFFF)
@Composable
fun HopePathLogoPreview() {
    HealthAppTheme {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Default styles
            HopePathLogo(size = LogoSize.SMALL, style = LogoStyle.DEFAULT)
            HopePathLogo(size = LogoSize.MEDIUM, style = LogoStyle.DEFAULT)
            HopePathLogo(size = LogoSize.LARGE, style = LogoStyle.DEFAULT)

            Spacer(modifier = Modifier.height(16.dp))

            // With background
            HopePathLogo(
                size = LogoSize.MEDIUM,
                style = LogoStyle.WITH_BACKGROUND
            )

            // With tagline
            LogoWithTagline()
        }
    }
}

@Preview(showBackground = true, backgroundColor = 0xFF1F2937)
@Composable
fun HopePathLogoDarkPreview() {
    HealthAppTheme {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            HopePathLogo(
                size = LogoSize.LARGE,
                style = LogoStyle.WITH_BACKGROUND,
                showText = true,
                textColor = Color.White,
                tagline = "Your Mental Health Companion"
            )
        }
    }
}