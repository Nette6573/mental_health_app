package com.ucc.healthapp.frontend.dashboard.layout

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState

// ─── All nav items (scrollable) ───────────────────────────────────────────────

val allNavItems = listOf(
    DashboardScreens.Overview,
    DashboardScreens.Faith,
    DashboardScreens.Mood,
    DashboardScreens.Resources,
    DashboardScreens.Therapist,
    DashboardScreens.NonBeliever,
    DashboardScreens.Settings,
)

// ─── Scrollable Bottom Navigation Bar ────────────────────────────────────────

@Composable
fun BottomNavigationBar(
    navController: NavController,
    items: List<DashboardScreens> = allNavItems
) {
    val currentBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = currentBackStackEntry?.destination?.route

    Surface(
        tonalElevation = 3.dp,
        shadowElevation = 8.dp,
        color = MaterialTheme.colorScheme.surface
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .selectableGroup()
                .navigationBarsPadding()
                .height(72.dp)
                .padding(horizontal = 4.dp),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.CenterVertically
        ) {
            items.forEach { screen ->
                val selected = currentRoute == screen.route

                ScrollableNavItem(
                    screen = screen,
                    selected = selected,
                    onClick = {
                        if (!selected) {
                            navController.navigate(screen.route) {
                                // Pop up to the start destination to avoid
                                // building up a large back stack
                                popUpTo(DashboardScreens.Overview.route) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    }
                )
            }
        }
    }
}

// ─── Individual Nav Item ──────────────────────────────────────────────────────

@Composable
private fun ScrollableNavItem(
    screen: DashboardScreens,
    selected: Boolean,
    onClick: () -> Unit
) {
    val color = if (selected)
        MaterialTheme.colorScheme.primary
    else
        MaterialTheme.colorScheme.onSurfaceVariant

    Column(
        modifier = Modifier
            .selectable(
                selected = selected,
                onClick = onClick,
                role = Role.Tab
            )
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .widthIn(min = 60.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Active indicator pill
        if (selected) {
            Surface(
                shape = MaterialTheme.shapes.extraLarge,
                color = MaterialTheme.colorScheme.secondaryContainer,
                modifier = Modifier
                    .width(56.dp)
                    .height(28.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        painter = painterResource(id = screen.icon),
                        contentDescription = screen.title,
                        tint = MaterialTheme.colorScheme.onSecondaryContainer,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        } else {
            Icon(
                painter = painterResource(id = screen.icon),
                contentDescription = screen.title,
                tint = color,
                modifier = Modifier.size(24.dp)
            )
        }

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = screen.title,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            maxLines = 1
        )
    }
}