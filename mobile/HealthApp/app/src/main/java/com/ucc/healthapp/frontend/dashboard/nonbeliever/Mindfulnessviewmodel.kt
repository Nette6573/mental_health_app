package com.ucc.healthapp.frontend.dashboard.nonbeliever

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class MindfulnessViewModel(
    private val repository: MindfulnessRepository = MindfulnessRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MindfulnessUiState(isLoading = true))
    val uiState: StateFlow<MindfulnessUiState> = _uiState.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        viewModelScope.launch {
            try {
                val (quote, author) = repository.getDailyQuote()
                _uiState.value = MindfulnessUiState(
                    meditations     = repository.getMeditations(),
                    exercises       = repository.getExercises(),
                    philosophySchools = repository.getPhilosophySchools(),
                    books           = repository.getBooks(),
                    dailyQuote      = quote,
                    dailyQuoteAuthor = author,
                    isLoading       = false
                )
            } catch (e: Exception) {
                _uiState.value = MindfulnessUiState(
                    isLoading = false,
                    error = e.message ?: "Failed to load content"
                )
            }
        }
    }

    fun retry() = loadData()
}