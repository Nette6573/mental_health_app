package com.ucc.healthapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.ucc.healthapp.frontend.auth.LoginScreen
import com.ucc.healthapp.frontend.dashboard.layout.DashboardLayout
import com.ucc.healthapp.frontend.theme.HealthAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HealthAppTheme {
                HealthApp()
            }
        }
    }
}

@Composable
fun HealthApp() {
    val navController = rememberNavController()
    var isAuthenticated by remember { mutableStateOf(false) }

    NavHost(
        navController = navController,
        startDestination = if (isAuthenticated) "dashboard" else "login"
    ) {
        composable("login") {
            LoginScreen(
                navController = navController,
                onLoginSuccess = {
                    isAuthenticated = true
                    navController.navigate("dashboard") {
                        popUpTo("login") { inclusive = true }
                    }
                },
                onSignupClick = {
                    navController.navigate("signup")
                },
                onForgotPasswordClick = {
                    navController.navigate("forgot-password")
                }
            )
        }

        composable("dashboard") {
            DashboardLayout(
                onLogout = {
                    isAuthenticated = false
                    navController.navigate("login") {
                        popUpTo("dashboard") { inclusive = true }
                    }
                }
            )
        }

        // Add other destinations
        composable("signup") {
            // SignUpScreen()
        }

        composable("forgot-password") {
            // ForgotPasswordScreen()
        }
    }
}