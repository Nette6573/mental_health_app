package com.ucc.healthapp.frontend.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ColorFilter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.ucc.healthapp.R
import com.ucc.healthapp.frontend.components.buttons.PrimaryButton
import com.ucc.healthapp.frontend.components.buttons.SocialLoginButton
import com.ucc.healthapp.frontend.components.buttons.SocialLoginProvider
import com.ucc.healthapp.frontend.components.inputs.CheckboxInput
import com.ucc.healthapp.frontend.components.inputs.TextInput
import com.ucc.healthapp.frontend.components.logo.BrandedLogo
import com.ucc.healthapp.frontend.components.logo.LogoSize
import com.ucc.healthapp.frontend.theme.HealthAppTheme
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    navController: NavController = rememberNavController(),
    onLoginSuccess: () -> Unit = {},
    onSignupClick: () -> Unit = { navController.navigate("signup") },
    onForgotPasswordClick: () -> Unit = { navController.navigate("forgot-password") }
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var rememberMe by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val scope = rememberCoroutineScope()

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Gradient Background (Optional)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f),
                                MaterialTheme.colorScheme.background
                            )
                        )
                    )
            )

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState()),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header Section
                LoginHeader()

                Spacer(modifier = Modifier.height(20.dp))

                // Main Form Card
                LoginFormCard(
                    email = email,
                    onEmailChange = { email = it },
                    password = password,
                    onPasswordChange = { password = it },
                    rememberMe = rememberMe,
                    onRememberMeChange = { rememberMe = it },
                    errorMessage = errorMessage,
                    isLoading = isLoading,
                    onLoginClick = {
                        if (email.isBlank() || password.isBlank()) {
                            errorMessage = "Please enter both email and password"
                            return@LoginFormCard
                        }

                        scope.launch {
                            isLoading = true
                            errorMessage = null
                            // Simulate API call
                            kotlinx.coroutines.delay(1500)
                            isLoading = false

                            // Validate credentials (replace with actual validation)
                            if (email.contains("@") && password.length >= 6) {
                                onLoginSuccess()
                            } else {
                                errorMessage = "Invalid email or password. Please try again."
                            }
                        }
                    },
                    onForgotPasswordClick = onForgotPasswordClick,
                    onGoogleLoginClick = {
                        scope.launch {
                            isLoading = true
                            errorMessage = null
                            kotlinx.coroutines.delay(1500)
                            isLoading = false
                            onLoginSuccess()
                        }
                    },
                    onFacebookLoginClick = {
                        scope.launch {
                            isLoading = true
                            errorMessage = null
                            kotlinx.coroutines.delay(1500)
                            isLoading = false
                            onLoginSuccess()
                        }
                    }
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Sign Up Section
                SignUpSection(
                    onSignupClick = onSignupClick
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Footer
                LoginFooter()

                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}

@Composable
private fun LoginHeader() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 60.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Logo using BrandedLogo component
        BrandedLogo(
            size = LogoSize.LARGE,
            showText = false
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Welcome Text
        Text(
            text = "Welcome Back",
            style = MaterialTheme.typography.headlineLarge.copy(
                fontWeight = FontWeight.Bold
            ),
            color = MaterialTheme.colorScheme.onBackground
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "Continue your wellness journey with HopePath",
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(horizontal = 48.dp)
        )
    }
}


@Composable
private fun LoginFormCard(
    email: String,
    onEmailChange: (String) -> Unit,
    password: String,
    onPasswordChange: (String) -> Unit,
    rememberMe: Boolean,
    onRememberMeChange: (Boolean) -> Unit,
    errorMessage: String?,
    isLoading: Boolean,
    onLoginClick: () -> Unit,
    onForgotPasswordClick: () -> Unit,
    onGoogleLoginClick: () -> Unit,
    onFacebookLoginClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 4.dp
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(28.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Error Banner
            if (errorMessage != null) {
                ErrorBanner(message = errorMessage)
            }


            // Email Input
            TextInput(
                value = email,
                onValueChange = onEmailChange,
                label = "Email",
                placeholder = "your.email@example.com",
                keyboardType = androidx.compose.ui.text.input.KeyboardType.Email,
                leadingIcon = Icons.Default.Email,
                isError = false,
//                enabled = !isLoading,
                modifier = Modifier.fillMaxWidth()
            )

            // Password Input
            TextInput(
                value = password,
                onValueChange = onPasswordChange,
                label = "Password",
                placeholder = "Enter your password",
                isPassword = true,
                leadingIcon = Icons.Default.Lock,
                isError = false,
//                enabled = !isLoading,
                modifier = Modifier.fillMaxWidth()
            )

            // Remember Me & Forgot Password
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                CheckboxInput(
                    checked = rememberMe,
                    onCheckedChange = onRememberMeChange,
                    label = "Remember me",
                    enabled = !isLoading,
                    modifier = Modifier.weight(1f, fill = false)
                )

                TextButton(
                    onClick = onForgotPasswordClick,
                    enabled = !isLoading,
                    colors = ButtonDefaults.textButtonColors(
                        contentColor = MaterialTheme.colorScheme.primary
                    )
                ) {
                    Text(
                        text = "Forgot Password?",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            fontWeight = FontWeight.Medium
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            // Sign In Button
            PrimaryButton(
                text = if (isLoading) "Signing In..." else "Sign In",
                onClick = onLoginClick,
                isLoading = isLoading,
                enabled = email.isNotBlank() && password.isNotBlank() && !isLoading,
                modifier = Modifier.fillMaxWidth()
            )

            // Divider
            DividerWithText(text = "Or continue with")

            // Social Login Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                SocialLoginButton(
                    provider = SocialLoginProvider.GOOGLE,
                    onClick = onGoogleLoginClick,
                    isLoading = isLoading,
                    enabled = !isLoading,
                    modifier = Modifier.weight(1f)
                )

                SocialLoginButton(
                    provider = SocialLoginProvider.FACEBOOK,
                    onClick = onFacebookLoginClick,
                    isLoading = isLoading,
                    enabled = !isLoading,
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun ErrorBanner(message: String) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.15f)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Info,
                contentDescription = "Error",
                tint = MaterialTheme.colorScheme.error,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = message,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.weight(1f)
            )
        }
    }
}



@Composable
private fun DividerWithText(text: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        HorizontalDivider(
            modifier = Modifier.weight(1f),
            thickness = 1.dp,
            color = MaterialTheme.colorScheme.outlineVariant
        )
        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
        HorizontalDivider(
            modifier = Modifier.weight(1f),
            thickness = 1.dp,
            color = MaterialTheme.colorScheme.outlineVariant
        )
    }
}

@Composable
private fun SignUpSection(
    onSignupClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .clickable(onClick = onSignupClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.3f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Don't have an account? ",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = "Sign Up",
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Bold
                ),
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
private fun LoginFooter() {
    Text(
        text = buildAnnotatedString {
            append("By signing in, you agree to our ")
            withStyle(
                style = SpanStyle(
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Medium
                )
            ) {
                append("Terms of Service")
            }
            append(" and ")
            withStyle(
                style = SpanStyle(
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Medium
                )
            ) {
                append("Privacy Policy")
            }
        },
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        textAlign = TextAlign.Center,
        modifier = Modifier.padding(horizontal = 40.dp)
    )
}

// ============================================================================
// PREVIEWS
// ============================================================================

@Preview(showBackground = true, showSystemUi = true)
@Composable
fun LoginScreenPreview() {
    HealthAppTheme {
        LoginScreen()
    }
}

@Preview(
    showBackground = true,
    showSystemUi = true,
    uiMode = android.content.res.Configuration.UI_MODE_NIGHT_YES
)
@Composable
fun LoginScreenDarkPreview() {
    HealthAppTheme {
        LoginScreen()
    }
}