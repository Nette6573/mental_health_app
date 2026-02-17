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
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
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
fun SignupScreen(
    navController: NavController = rememberNavController(),
    onSignupSuccess: () -> Unit = {},
    onLoginClick: () -> Unit = { navController.navigate("login") }
) {
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var acceptTerms by remember { mutableStateOf(false) }
    var newsletter by remember { mutableStateOf(false) }
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
            // Gradient Background
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(250.dp)
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
                SignupHeader()

                Spacer(modifier = Modifier.height(32.dp))

                // Main Form Card
                SignupFormCard(
                    firstName = firstName,
                    onFirstNameChange = { firstName = it },
                    lastName = lastName,
                    onLastNameChange = { lastName = it },
                    email = email,
                    onEmailChange = { email = it },
                    password = password,
                    onPasswordChange = { password = it },
                    confirmPassword = confirmPassword,
                    onConfirmPasswordChange = { confirmPassword = it },
                    acceptTerms = acceptTerms,
                    onAcceptTermsChange = { acceptTerms = it },
                    newsletter = newsletter,
                    onNewsletterChange = { newsletter = it },
                    errorMessage = errorMessage,
                    isLoading = isLoading,
                    onSignupClick = {
                        // Validation
                        when {
                            firstName.isBlank() || lastName.isBlank() -> {
                                errorMessage = "Please enter your full name"
                            }
                            email.isBlank() || !email.contains("@") -> {
                                errorMessage = "Please enter a valid email address"
                            }
                            password.length < 6 -> {
                                errorMessage = "Password must be at least 6 characters"
                            }
                            password != confirmPassword -> {
                                errorMessage = "Passwords do not match"
                            }
                            !acceptTerms -> {
                                errorMessage = "Please accept the Terms and Privacy Policy"
                            }
                            else -> {
                                scope.launch {
                                    isLoading = true
                                    errorMessage = null
                                    kotlinx.coroutines.delay(1500)
                                    isLoading = false
                                    onSignupSuccess()
                                }
                            }
                        }
                    },
                    onGoogleSignupClick = {
                        scope.launch {
                            isLoading = true
                            errorMessage = null
                            kotlinx.coroutines.delay(1500)
                            isLoading = false
                            onSignupSuccess()
                        }
                    },
                    onFacebookSignupClick = {
                        scope.launch {
                            isLoading = true
                            errorMessage = null
                            kotlinx.coroutines.delay(1500)
                            isLoading = false
                            onSignupSuccess()
                        }
                    }
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Login Section
                LoginSection(onLoginClick = onLoginClick)

                Spacer(modifier = Modifier.height(12.dp))

                // Footer
                SignupFooter()

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Composable
private fun SignupHeader() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 48.dp, bottom = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Logo using BrandedLogo component
        BrandedLogo(
            size = LogoSize.MEDIUM,
            showText = false
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Title
        Text(
            text = "Create Account",
            style = MaterialTheme.typography.headlineMedium.copy(
                fontWeight = FontWeight.Bold
            ),
            color = MaterialTheme.colorScheme.onBackground
        )

        Spacer(modifier = Modifier.height(6.dp))

        // Subtitle
        Text(
            text = "Start your wellness journey with HopePath",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun SignupFormCard(
    firstName: String,
    onFirstNameChange: (String) -> Unit,
    lastName: String,
    onLastNameChange: (String) -> Unit,
    email: String,
    onEmailChange: (String) -> Unit,
    password: String,
    onPasswordChange: (String) -> Unit,
    confirmPassword: String,
    onConfirmPasswordChange: (String) -> Unit,
    acceptTerms: Boolean,
    onAcceptTermsChange: (Boolean) -> Unit,
    newsletter: Boolean,
    onNewsletterChange: (Boolean) -> Unit,
    errorMessage: String?,
    isLoading: Boolean,
    onSignupClick: () -> Unit,
    onGoogleSignupClick: () -> Unit,
    onFacebookSignupClick: () -> Unit
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
                .padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Error Banner
            if (errorMessage != null) {
                ErrorBanner(message = errorMessage)
            }

            // Name Fields
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                TextInput(
                    value = firstName,
                    onValueChange = onFirstNameChange,
                    label = "First Name",
                    placeholder = "John",
                    leadingIcon = Icons.Default.Person,
                    isError = false,
                    modifier = Modifier.weight(1f)
                )

                TextInput(
                    value = lastName,
                    onValueChange = onLastNameChange,
                    label = "Last Name",
                    placeholder = "Doe",
                    leadingIcon = Icons.Default.Person,
                    isError = false,
                    modifier = Modifier.weight(1f)
                )
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
                modifier = Modifier.fillMaxWidth()
            )

            // Password Input
            TextInput(
                value = password,
                onValueChange = onPasswordChange,
                label = "Password",
                placeholder = "Min. 6 characters",
                isPassword = true,
                leadingIcon = Icons.Default.Lock,
                isError = false,
                modifier = Modifier.fillMaxWidth()
            )

            // Confirm Password Input
            TextInput(
                value = confirmPassword,
                onValueChange = onConfirmPasswordChange,
                label = "Confirm Password",
                placeholder = "Re-enter password",
                isPassword = true,
                leadingIcon = Icons.Default.Lock,
                isError = false,
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Terms Checkbox
            CheckboxInput(
                checked = acceptTerms,
                onCheckedChange = onAcceptTermsChange,
                label = {
                    Text(
                        text = buildAnnotatedString {
                            append("I agree to the ")
                            withStyle(
                                style = SpanStyle(
                                    color = MaterialTheme.colorScheme.primary,
                                    fontWeight = FontWeight.SemiBold
                                )
                            ) {
                                append("Terms")
                            }
                            append(" & ")
                            withStyle(
                                style = SpanStyle(
                                    color = MaterialTheme.colorScheme.primary,
                                    fontWeight = FontWeight.SemiBold
                                )
                            ) {
                                append("Privacy Policy")
                            }
                        },
                        style = MaterialTheme.typography.bodySmall
                    )
                },
                modifier = Modifier.fillMaxWidth()
            )

            // Newsletter Checkbox
            CheckboxInput(
                checked = newsletter,
                onCheckedChange = onNewsletterChange,
                label = "Get mental health tips & updates",
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Create Account Button
            PrimaryButton(
                text = if (isLoading) "Creating Account..." else "Create Account",
                onClick = onSignupClick,
                isLoading = isLoading,
                enabled = firstName.isNotBlank() && lastName.isNotBlank() &&
                        email.isNotBlank() && password.isNotBlank() &&
                        confirmPassword.isNotBlank() && acceptTerms && !isLoading,
                modifier = Modifier.fillMaxWidth()
            )

            // Divider
            DividerWithText(text = "Or sign up with")

            // Social Login Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                SocialLoginButton(
                    provider = SocialLoginProvider.GOOGLE,
                    onClick = onGoogleSignupClick,
                    isLoading = isLoading,
                    enabled = !isLoading,
                    modifier = Modifier.weight(1f)
                )

                SocialLoginButton(
                    provider = SocialLoginProvider.FACEBOOK,
                    onClick = onFacebookSignupClick,
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
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Info,
                contentDescription = "Error",
                tint = MaterialTheme.colorScheme.error,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(10.dp))
            Text(
                text = message,
                style = MaterialTheme.typography.bodySmall,
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
            modifier = Modifier.padding(horizontal = 12.dp)
        )
        HorizontalDivider(
            modifier = Modifier.weight(1f),
            thickness = 1.dp,
            color = MaterialTheme.colorScheme.outlineVariant
        )
    }
}

@Composable
private fun LoginSection(onLoginClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp)
            .clickable(onClick = onLoginClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.3f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Already have an account? ",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                text = "Sign In",
                style = MaterialTheme.typography.bodyMedium.copy(
                    fontWeight = FontWeight.Bold
                ),
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
private fun SignupFooter() {
    Text(
        text = buildAnnotatedString {
            append("By signing up, you agree to our ")
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
fun SignupScreenPreview() {
    HealthAppTheme {
        SignupScreen()
    }
}

@Preview(
    showBackground = true,
    showSystemUi = true,
    uiMode = android.content.res.Configuration.UI_MODE_NIGHT_YES
)
@Composable
fun SignupScreenDarkPreview() {
    HealthAppTheme {
        SignupScreen()
    }
}