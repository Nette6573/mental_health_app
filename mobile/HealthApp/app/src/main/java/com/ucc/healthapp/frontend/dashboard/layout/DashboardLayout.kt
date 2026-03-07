package com.ucc.healthapp.frontend.dashboard.layout

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.ucc.healthapp.R
import com.ucc.healthapp.frontend.dashboard.faith.FaithScreen
import com.ucc.healthapp.frontend.dashboard.mood.MoodScreen
import com.ucc.healthapp.frontend.dashboard.nonbeliever.NonBelieverScreen
import com.ucc.healthapp.frontend.dashboard.overview.OverviewScreen
import com.ucc.healthapp.frontend.dashboard.paula.PaulaFab
import com.ucc.healthapp.frontend.dashboard.resources.ResourcesScreen
import com.ucc.healthapp.frontend.dashboard.settings.SettingsScreen
import com.ucc.healthapp.frontend.dashboard.therapist.TherapistScreen

// ─── Screen Definitions ───────────────────────────────────────────────────────

sealed class DashboardScreens(val route: String, val title: String, val icon: Int) {
    object Overview    : DashboardScreens("overview",    "Overview",    R.drawable.ic_home)
    object Faith       : DashboardScreens("faith",       "Faith",       R.drawable.ic_faith)
    object Mood        : DashboardScreens("mood",        "Mood",        R.drawable.ic_mood)
    object Resources   : DashboardScreens("resources",   "Resources",   R.drawable.ic_resources)
    object Therapist   : DashboardScreens("therapist",   "Therapist",   R.drawable.ic_therapist)
    object Settings    : DashboardScreens("settings",    "Settings",    R.drawable.ic_settings)
    object NonBeliever : DashboardScreens("nonbeliever", "Philosophical", R.drawable.ic_mindfulness)
}

// ─── Layout ───────────────────────────────────────────────────────────────────

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardLayout(
    navController: NavHostController = rememberNavController(),
    onLogout: () -> Unit = {}
) {
    Scaffold(
        topBar = {
            DashboardTopBar(
                title = getCurrentScreenTitle(navController),
                onMenuClick = { /* open drawer */ },
                onNotificationClick = { /* notifications */ },
                onProfileClick = { navController.navigate(DashboardScreens.Settings.route) }
            )
        },
        bottomBar = {
            BottomNavigationBar(navController = navController)
        },
        // ── Paula FAB — visible on every screen ──────────────────────────────
        floatingActionButton = {
            PaulaFab()
        },
        floatingActionButtonPosition = FabPosition.End
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = DashboardScreens.Overview.route,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable(DashboardScreens.Overview.route) {
                OverviewScreen(onNavigateToFeature = { route -> navController.navigate(route) })
            }
            composable(DashboardScreens.Faith.route) {
                FaithScreen(onNavigateToPrayer = {}, onNavigateToMeditation = {})
            }
            composable(DashboardScreens.Mood.route) {
                MoodScreen(onMoodSelected = {})
            }
            composable(DashboardScreens.Resources.route) {
                ResourcesScreen()
            }
            composable(DashboardScreens.Therapist.route) {
                TherapistScreen()
            }
            composable(DashboardScreens.Settings.route) {
                SettingsScreen(onLogout = onLogout)
            }
            composable(DashboardScreens.NonBeliever.route) {
                NonBelieverScreen()
            }
        }
    }
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DashboardTopBar(
    title: String,
    onMenuClick: () -> Unit,
    onNotificationClick: () -> Unit,
    onProfileClick: () -> Unit
) {
    TopAppBar(
        title = { Text(title, style = MaterialTheme.typography.titleLarge) },
        navigationIcon = {
            IconButton(onClick = onMenuClick) { Icon(Icons.Default.Menu, "Menu") }
        },
        actions = {
            IconButton(onClick = onNotificationClick) { Icon(Icons.Default.Notifications, "Notifications") }
            IconButton(onClick = onProfileClick) { Icon(Icons.Default.AccountCircle, "Profile") }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surface,
            titleContentColor = MaterialTheme.colorScheme.onSurface
        )
    )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

@Composable
private fun getCurrentScreenTitle(navController: NavController): String {
    val entry by navController.currentBackStackEntryAsState()
    return when (entry?.destination?.route) {
        DashboardScreens.Overview.route    -> DashboardScreens.Overview.title
        DashboardScreens.Faith.route       -> DashboardScreens.Faith.title
        DashboardScreens.Mood.route        -> DashboardScreens.Mood.title
        DashboardScreens.Resources.route   -> DashboardScreens.Resources.title
        DashboardScreens.Therapist.route   -> DashboardScreens.Therapist.title
        DashboardScreens.Settings.route    -> DashboardScreens.Settings.title
        DashboardScreens.NonBeliever.route -> DashboardScreens.NonBeliever.title
        else -> "HopePath"
    }
}