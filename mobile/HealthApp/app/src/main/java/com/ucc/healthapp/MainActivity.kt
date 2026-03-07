package com.ucc.healthapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.ucc.healthapp.frontend.auth.AuthNavGraph
import com.ucc.healthapp.frontend.dashboard.layout.DashboardLayout
import com.ucc.healthapp.frontend.splash.SplashScreen
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

    NavHost(
        navController = navController,
        startDestination = "splash"
    ) {
        // 1. Splash — shown on launch, auto-redirects to auth
        composable("splash") {
            SplashScreen(
                onSplashComplete = {
                    navController.navigate("auth") {
                        popUpTo("splash") { inclusive = true }
                    }
                }
            )
        }

        // 2. Auth — login / signup / reset password
        composable("auth") {
            AuthNavGraph(
                onAuthComplete = {
                    navController.navigate("dashboard") {
                        popUpTo("auth") { inclusive = true }
                    }
                }
            )
        }

        // 3. Dashboard — main app
        composable("dashboard") {
            DashboardLayout(
                onLogout = {
                    navController.navigate("auth") {
                        popUpTo("dashboard") { inclusive = true }
                    }
                }
            )
        }
    }
}