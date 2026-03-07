package com.ucc.healthapp.frontend.auth

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

@Composable
fun AuthNavGraph(
    onAuthComplete: () -> Unit
) {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = "login"
    ) {
        composable("login") {
            LoginScreen(
                onLoginSuccess = onAuthComplete,
                onSignupClick = { navController.navigate("signup") },
                onForgotPasswordClick = { navController.navigate("reset-password") }
            )
        }

        composable("signup") {
            SignupScreen(
                onSignupSuccess = onAuthComplete,
                onLoginClick = { navController.popBackStack() }
            )
        }

        composable("reset-password") {
            ResetPasswordScreen(
                onResetSuccess = { navController.popBackStack() },
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}