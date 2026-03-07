package com.ucc.healthapp.frontend.dashboard.nonbeliever

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

// ─── Screen ───────────────────────────────────────────────────────────────────
// Thin layer: collect state, pass real data down to cards.

@Composable
fun NonBelieverScreen(
    vm: MindfulnessViewModel = viewModel()
) {
    val state by vm.uiState.collectAsState()

    when {
        state.isLoading -> LoadingView()
        state.error != null -> ErrorView(message = state.error!!, onRetry = vm::retry)
        else -> MindfulnessContent(state = state)
    }
}

// ─── Content ──────────────────────────────────────────────────────────────────

@Composable
private fun MindfulnessContent(state: MindfulnessUiState) {
    LazyColumn(
        modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(20.dp)
    ) {
        item {
            Column {
                Text(
                    text = "Mindfulness & Well-being",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "Secular practices for mental wellness",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }

        item { WelcomeCard() }

        item {
            MeditationCard(
                meditations = state.meditations,
                onSessionClick = { /* TODO: navigate to player */ },
                onViewAll = { /* TODO: navigate to full list */ }
            )
        }

        item {
            ExercisesCard(
                exercises = state.exercises,
                onStartExercise = { /* TODO: start exercise flow */ }
            )
        }

        item {
            PhilosophyCard(
                schools = state.philosophySchools,
                quote = state.dailyQuote,
                quoteAuthor = state.dailyQuoteAuthor,
                onSchoolClick = { /* TODO: filter by school */ },
                onReadArticles = { /* TODO: navigate to articles */ }
            )
        }

        item { StressReliefCard(onStart = { /* TODO: launch breathing exercise */ }) }

        item {
            CommunityCard(
                onGroups = { /* TODO: navigate to groups */ },
                onFindBuddy = { /* TODO: navigate to buddy matching */ }
            )
        }

        item {
            BooksCard(
                books = state.books,
                onBookClick = { /* TODO: navigate to book detail */ },
                onViewAll = { /* TODO: navigate to full reading list */ }
            )
        }
    }
}

// ─── Loading / Error ──────────────────────────────────────────────────────────

@Composable
private fun LoadingView() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
private fun ErrorView(message: String, onRetry: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize().padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Something went wrong", style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(8.dp))
        Text(text = message, style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onRetry) { Text("Retry") }
    }
}