package com.ucc.healthapp.frontend.components.buttons

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ucc.healthapp.R

enum class SocialLoginProvider {
    GOOGLE,
    FACEBOOK,
    APPLE,
    TWITTER
}

data class SocialLoginConfig(
    val iconRes: Int,
    val text: String,
    val containerColor: Color,
    val contentColor: Color,
    val borderColor: Color
)

@Composable
fun SocialLoginButton(
    provider: SocialLoginProvider,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    val config = when (provider) {
        SocialLoginProvider.GOOGLE -> SocialLoginConfigs.googleConfig
        SocialLoginProvider.FACEBOOK -> SocialLoginConfigs.facebookConfig
        SocialLoginProvider.APPLE -> SocialLoginConfigs.appleConfig
        SocialLoginProvider.TWITTER -> SocialLoginConfigs.twitterConfig
    }

    SocialLoginButton(
        text = config.text,
        onClick = onClick,
        modifier = modifier,
        iconPainter = painterResource(id = config.iconRes),
        isLoading = isLoading,
        enabled = enabled,
        containerColor = config.containerColor,
        contentColor = config.contentColor,
        borderColor = config.borderColor
    )
}

@Composable
fun SocialLoginButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector? = null,
    iconPainter: Painter? = null,
    isLoading: Boolean = false,
    enabled: Boolean = true,
    containerColor: Color = Color.White,
    contentColor: Color = MaterialTheme.colorScheme.onSurface,
    borderColor: Color = MaterialTheme.colorScheme.outline
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = containerColor,
            contentColor = contentColor,
            disabledContainerColor = containerColor.copy(alpha = 0.5f),
            disabledContentColor = contentColor.copy(alpha = 0.5f)
        ),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, borderColor),
        enabled = enabled && !isLoading,
        elevation = ButtonDefaults.buttonElevation(
            defaultElevation = 0.dp,
            pressedElevation = 2.dp,
            disabledElevation = 0.dp
        )
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier
                        .size(20.dp)
                        .padding(end = 12.dp),
                    strokeWidth = 2.dp,
                    color = contentColor
                )
            } else {
                when {
                    icon != null -> {
                        Icon(
                            imageVector = icon,
                            contentDescription = null,
                            modifier = Modifier
                                .size(20.dp)
                                .padding(end = 12.dp),
                            tint = contentColor
                        )
                    }
                    iconPainter != null -> {
                        Icon(
                            painter = iconPainter,
                            contentDescription = null,
                            modifier = Modifier
                                .size(20.dp)
                                .padding(end = 12.dp),
                            tint = Color.Unspecified
                        )
                    }
                }
            }

            Text(
                text = if (isLoading) "Connecting..." else text,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = contentColor,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
fun GoogleLoginButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    SocialLoginButton(
        provider = SocialLoginProvider.GOOGLE,
        onClick = onClick,
        modifier = modifier,
        isLoading = isLoading,
        enabled = enabled
    )
}

@Composable
fun FacebookLoginButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    SocialLoginButton(
        provider = SocialLoginProvider.FACEBOOK,
        onClick = onClick,
        modifier = modifier,
        isLoading = isLoading,
        enabled = enabled
    )
}

@Composable
fun AppleLoginButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    SocialLoginButton(
        provider = SocialLoginProvider.APPLE,
        onClick = onClick,
        modifier = modifier,
        isLoading = isLoading,
        enabled = enabled
    )
}

@Composable
fun TwitterLoginButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    SocialLoginButton(
        provider = SocialLoginProvider.TWITTER,
        onClick = onClick,
        modifier = modifier,
        isLoading = isLoading,
        enabled = enabled
    )
}

object SocialLoginConfigs {
    val googleConfig = SocialLoginConfig(
        iconRes = R.drawable.ic_google,
        text = "Continue with Google",
        containerColor = Color(0xFFFFFFFF),
        contentColor = Color(0xFF3C4043),
        borderColor = Color(0xFFDADCE0)
    )

    val facebookConfig = SocialLoginConfig(
        iconRes = R.drawable.ic_facebook,
        text = "Continue with Facebook",
        containerColor = Color(0xFF1877F2),
        contentColor = Color(0xFFFFFFFF),
        borderColor = Color(0xFF1877F2)
    )

    val appleConfig = SocialLoginConfig(
        iconRes = R.drawable.ic_apple,
        text = "Continue with Apple",
        containerColor = Color(0xFF000000),
        contentColor = Color(0xFFFFFFFF),
        borderColor = Color(0xFF000000)
    )

    val twitterConfig = SocialLoginConfig(
        iconRes = R.drawable.ic_twitter,
        text = "Continue with Twitter",
        containerColor = Color(0xFF1DA1F2),
        contentColor = Color(0xFFFFFFFF),
        borderColor = Color(0xFF1DA1F2)
    )
}

@Composable
fun SocialLoginButtonsRow(
    onGoogleClick: () -> Unit,
    onFacebookClick: () -> Unit,
    onAppleClick: (() -> Unit)? = null,
    onTwitterClick: (() -> Unit)? = null,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Google
        Button(
            onClick = onGoogleClick,
            modifier = Modifier
                .weight(1f)
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.White,
                contentColor = Color.Black
            ),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, Color(0xFFDADCE0)),
            enabled = !isLoading
        ) {
            Icon(
                painter = painterResource(id = R.drawable.ic_google),
                contentDescription = "Google",
                modifier = Modifier.size(20.dp)
            )
        }

        // Facebook
        Button(
            onClick = onFacebookClick,
            modifier = Modifier
                .weight(1f)
                .height(52.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = Color(0xFF1877F2),
                contentColor = Color.White
            ),
            shape = RoundedCornerShape(12.dp),
            enabled = !isLoading
        ) {
            Icon(
                painter = painterResource(id = R.drawable.ic_facebook),
                contentDescription = "Facebook",
                modifier = Modifier.size(20.dp)
            )
        }

        // Apple (optional)
        onAppleClick?.let {
            Button(
                onClick = it,
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.Black,
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp),
                enabled = !isLoading
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_apple),
                    contentDescription = "Apple",
                    modifier = Modifier.size(20.dp)
                )
            }
        }

        // Twitter (optional)
        onTwitterClick?.let {
            Button(
                onClick = it,
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF1DA1F2),
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(12.dp),
                enabled = !isLoading
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_twitter),
                    contentDescription = "Twitter",
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SocialLoginButtonPreview() {
    MaterialTheme {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            SocialLoginButton(
                provider = SocialLoginProvider.GOOGLE,
                onClick = { },
                isLoading = false
            )

            SocialLoginButton(
                provider = SocialLoginProvider.FACEBOOK,
                onClick = { },
                isLoading = true
            )

            SocialLoginButton(
                provider = SocialLoginProvider.APPLE,
                onClick = { }
            )

            SocialLoginButton(
                provider = SocialLoginProvider.TWITTER,
                onClick = { }
            )

            SocialLoginButtonsRow(
                onGoogleClick = { },
                onFacebookClick = { },
                onAppleClick = { },
                onTwitterClick = { }
            )
        }
    }
}