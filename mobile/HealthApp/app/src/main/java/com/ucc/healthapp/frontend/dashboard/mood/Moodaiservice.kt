package com.ucc.healthapp.frontend.dashboard.mood

import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

// ─── Mood AI Service ──────────────────────────────────────────────────────────
// Calls the Anthropic API to analyse mood + journal and return:
//   - A prediction of what might be driving the mood
//   - A relevant philosophical quote
//   - Warm personalised encouragement
//   - 2-3 actionable suggestions

object MoodAiService {

    private const val API_URL = "https://api.anthropic.com/v1/messages"
    private const val MODEL   = "claude-sonnet-4-20250514"

    suspend fun analyseEntry(
        moodName: String,
        moodDescription: String,
        journalText: String,
        recentMoods: List<String>   // last 3-5 mood names for context
    ): Result<MoodAiInsight> = withContext(Dispatchers.IO) {
        try {
            val recentContext = if (recentMoods.isNotEmpty())
                "Recent mood history (newest first): ${recentMoods.joinToString(", ")}."
            else ""

            val journalContext = if (journalText.isNotBlank())
                "The user wrote: \"$journalText\""
            else
                "The user did not add a journal note."

            val prompt = """
You are a compassionate mental wellness companion. A user just logged their mood.

Current mood: $moodName ($moodDescription)
$journalContext
$recentContext

Respond ONLY with a valid JSON object — no markdown, no preamble. Use this exact structure:
{
  "prediction": "A 1-2 sentence empathetic insight into what might be driving this mood",
  "philosophicalQuote": "An appropriate philosophical or literary quote (under 30 words)",
  "philosopher": "Author's name",
  "encouragement": "2-3 sentences of warm, personalised encouragement tailored to the mood and journal",
  "suggestedActions": ["First practical suggestion", "Second practical suggestion", "Third practical suggestion"]
}
""".trimIndent()

            val requestBody = JSONObject().apply {
                put("model", MODEL)
                put("max_tokens", 600)
                put("messages", JSONArray().apply {
                    put(JSONObject().apply {
                        put("role", "user")
                        put("content", prompt)
                    })
                })
            }.toString()

            val url = URL(API_URL)
            val connection = (url.openConnection() as HttpURLConnection).apply {
                requestMethod = "POST"
                setRequestProperty("Content-Type", "application/json")
                setRequestProperty("anthropic-version", "2023-06-01")
                doOutput = true
                connectTimeout = 15_000
                readTimeout = 30_000
            }

            OutputStreamWriter(connection.outputStream).use { it.write(requestBody) }

            val responseCode = connection.responseCode
            val responseText = if (responseCode == 200) {
                connection.inputStream.bufferedReader().readText()
            } else {
                connection.errorStream?.bufferedReader()?.readText() ?: "Unknown error"
            }

            if (responseCode != 200) {
                return@withContext Result.failure(Exception("API error $responseCode: $responseText"))
            }

            // Parse Anthropic response envelope → extract text content
            val contentArray = JSONObject(responseText)
                .getJSONArray("content")
            val rawText = contentArray.getJSONObject(0).getString("text").trim()

            // Parse the inner JSON
            val json = JSONObject(rawText)
            val insight = MoodAiInsight(
                prediction          = json.getString("prediction"),
                philosophicalQuote  = json.getString("philosophicalQuote"),
                philosopher         = json.getString("philosopher"),
                encouragement       = json.getString("encouragement"),
                suggestedActions    = buildList {
                    val arr = json.getJSONArray("suggestedActions")
                    for (i in 0 until arr.length()) add(arr.getString(i))
                }
            )
            Result.success(insight)

        } catch (e: Exception) {
            Log.e("MoodAiService", "Analysis failed", e)
            Result.failure(e)
        }
    }
}