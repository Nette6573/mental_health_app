package com.ucc.healthapp.frontend.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.ucc.healthapp.frontend.components.buttons.PrimaryButton
import com.ucc.healthapp.frontend.components.buttons.SocialLoginButton
import com.ucc.healthapp.frontend.components.buttons.SocialLoginProvider
import com.ucc.healthapp.frontend.components.inputs.CheckboxInput
import com.ucc.healthapp.frontend.components.inputs.TextInput
import com.ucc.healthapp.frontend.components.logo.BrandedLogo
import com.ucc.healthapp.frontend.components.logo.LogoSize
import com.ucc.healthapp.frontend.theme.HealthAppTheme
import kotlinx.coroutines.launch

@Composable
fun SignupScreen(
    onSignupSuccess: () -> Unit = {},
    onLoginClick: () -> Unit = {}
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

    Scaffold(containerColor = MaterialTheme.colorScheme.background) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
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
                // Header
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 48.dp, bottom = 8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    BrandedLogo(size = LogoSize.MEDIUM, showText = false)
                    Spacer(modifier = Modifier.height(20.dp))
                    Text(
                        text = "Create Account",
                        style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Start your wellness journey with HopePath",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )
                }

                Spacer(modifier = Modifier.height(32.dp))

                // Form Card
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        if (errorMessage != null) {
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
                                        text = errorMessage!!,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.error,
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                            }
                        }

                        // Name Row
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            TextInput(
                                value = firstName,
                                onValueChange = { firstName = it },
                                label = "First Name",
                                placeholder = "John",
                                leadingIcon = Icons.Default.Person,
                                isError = false,
                                modifier = Modifier.weight(1f)
                            )
                            TextInput(
                                value = lastName,
                                onValueChange = { lastName = it },
                                label = "Last Name",
                                placeholder = "Doe",
                                leadingIcon = Icons.Default.Person,
                                isError = false,
                                modifier = Modifier.weight(1f)
                            )
                        }

                        TextInput(
                            value = email,
                            onValueChange = { email = it },
                            label = "Email",
                            placeholder = "your.email@example.com",
                            keyboardType = androidx.compose.ui.text.input.KeyboardType.Email,
                            leadingIcon = Icons.Default.Email,
                            isError = false,
                            modifier = Modifier.fillMaxWidth()
                        )

                        TextInput(
                            value = password,
                            onValueChange = { password = it },
                            label = "Password",
                            placeholder = "Min. 6 characters",
                            isPassword = true,
                            leadingIcon = Icons.Default.Lock,
                            isError = false,
                            modifier = Modifier.fillMaxWidth()
                        )

                        TextInput(
                            value = confirmPassword,
                            onValueChange = { confirmPassword = it },
                            label = "Confirm Password",
                            placeholder = "Re-enter password",
                            isPassword = true,
                            leadingIcon = Icons.Default.Lock,
                            isError = false,
                            modifier = Modifier.fillMaxWidth()
                        )

                        CheckboxInput(
                            checked = acceptTerms,
                            onCheckedChange = { acceptTerms = it },
                            label = {
                                Text(
                                    text = buildAnnotatedString {
                                        append("I agree to the ")
                                        withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)) {
                                            append("Terms")
                                        }
                                        append(" & ")
                                        withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)) {
                                            append("Privacy Policy")
                                        }
                                    },
                                    style = MaterialTheme.typography.bodySmall
                                )
                            },
                            modifier = Modifier.fillMaxWidth()
                        )

                        CheckboxInput(
                            checked = newsletter,
                            onCheckedChange = { newsletter = it },
                            label = "Get mental health tips & updates",
                            modifier = Modifier.fillMaxWidth()
                        )

                        PrimaryButton(
                            text = if (isLoading) "Creating Account..." else "Create Account",
                            onClick = {
                                when {
                                    firstName.isBlank() || lastName.isBlank() -> errorMessage = "Please enter your full name"
                                    email.isBlank() || !email.contains("@") -> errorMessage = "Please enter a valid email address"
                                    password.length < 6 -> errorMessage = "Password must be at least 6 characters"
                                    password != confirmPassword -> errorMessage = "Passwords do not match"
                                    !acceptTerms -> errorMessage = "Please accept the Terms and Privacy Policy"
                                    else -> scope.launch {
                                        isLoading = true
                                        errorMessage = null
                                        kotlinx.coroutines.delay(1500)
                                        isLoading = false
                                        onSignupSuccess()
                                    }
                                }
                            },
                            isLoading = isLoading,
                            enabled = firstName.isNotBlank() && lastName.isNotBlank() &&
                                    email.isNotBlank() && password.isNotBlank() &&
                                    confirmPassword.isNotBlank() && acceptTerms && !isLoading,
                            modifier = Modifier.fillMaxWidth()
                        )

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            HorizontalDivider(modifier = Modifier.weight(1f), thickness = 1.dp, color = MaterialTheme.colorScheme.outlineVariant)
                            Text(
                                text = "Or sign up with",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.padding(horizontal = 12.dp)
                            )
                            HorizontalDivider(modifier = Modifier.weight(1f), thickness = 1.dp, color = MaterialTheme.colorScheme.outlineVariant)
                        }

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            SocialLoginButton(
                                provider = SocialLoginProvider.GOOGLE,
                                onClick = {
                                    scope.launch {
                                        isLoading = true
                                        kotlinx.coroutines.delay(1500)
                                        isLoading = false
                                        onSignupSuccess()
                                    }
                                },
                                isLoading = isLoading,
                                enabled = !isLoading,
                                modifier = Modifier.weight(1f)
                            )
                            SocialLoginButton(
                                provider = SocialLoginProvider.FACEBOOK,
                                onClick = {
                                    scope.launch {
                                        isLoading = true
                                        kotlinx.coroutines.delay(1500)
                                        isLoading = false
                                        onSignupSuccess()
                                    }
                                },
                                isLoading = isLoading,
                                enabled = !isLoading,
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Login Link
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
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = buildAnnotatedString {
                        append("By signing up, you agree to our ")
                        withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Medium)) {
                            append("Terms of Service")
                        }
                        append(" and ")
                        withStyle(style = SpanStyle(color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Medium)) {
                            append("Privacy Policy")
                        }
                    },
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 40.dp)
                )

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

@Preview(showBackground = true, showSystemUi = true)
@Composable
fun SignupScreenPreview() {
    HealthAppTheme { SignupScreen() }
}