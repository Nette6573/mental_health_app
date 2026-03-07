package com.ucc.healthapp.frontend.dashboard.mood

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class MoodUiState(
    val selectedMood: Mood? = null,
    val journalEntry: String = "",
    val aiState: MoodAiState = MoodAiState.Idle,
    val savedEntries: List<MoodEntry> = emptyList()
)

class MoodViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(MoodUiState())
    val uiState: StateFlow<MoodUiState> = _uiState.asStateFlow()

    fun selectMood(mood: Mood) {
        _uiState.value = _uiState.value.copy(
            selectedMood = mood,
            aiState = MoodAiState.Idle   // reset previous insight
        )
    }

    fun updateJournal(text: String) {
        _uiState.value = _uiState.value.copy(journalEntry = text)
    }

    // Called when user taps "Analyse My Mood"
    fun analyseWithAi() {
        val mood = _uiState.value.selectedMood ?: return
        _uiState.value = _uiState.value.copy(aiState = MoodAiState.Loading)

        viewModelScope.launch {
            val recentMoodNames = sampleHistory.take(4).map { it.second }
            val result = MoodAiService.analyseEntry(
                moodName        = mood.name,
                moodDescription = mood.description,
                journalText     = _uiState.value.journalEntry,
                recentMoods     = recentMoodNames
            )
            _uiState.value = _uiState.value.copy(
                aiState = result.fold(
                    onSuccess = { MoodAiState.Success(it) },
                    onFailure = { MoodAiState.Error(it.message ?: "Something went wrong") }
                )
            )
        }
    }

    // Save entry and reset
    fun saveEntry() {
        val mood = _uiState.value.selectedMood ?: return
        val insight = (_uiState.value.aiState as? MoodAiState.Success)?.insight

        val entry = MoodEntry(
            id       = System.currentTimeMillis().toString(),
            mood     = mood,
            journal  = _uiState.value.journalEntry,
            aiInsight = insight
        )

        _uiState.value = _uiState.value.copy(
            savedEntries = listOf(entry) + _uiState.value.savedEntries,
            selectedMood = null,
            journalEntry = "",
            aiState      = MoodAiState.Idle
        )
    }

    fun retryAnalysis() = analyseWithAi()

    fun dismissInsight() {
        _uiState.value = _uiState.value.copy(aiState = MoodAiState.Idle)
    }
}