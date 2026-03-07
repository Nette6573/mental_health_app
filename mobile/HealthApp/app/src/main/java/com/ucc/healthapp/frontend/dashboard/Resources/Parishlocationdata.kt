package com.ucc.healthapp.frontend.dashboard.resources

import androidx.compose.ui.graphics.Color

// ─── Model ───────────────────────────────────────────────────────────────────

data class ParishLocation(
    val name: String,
    val county: String,
    val latitude: Double,
    val longitude: Double,
    val resourceCount: Int,
    val accentColor: Color
)

// ─── Jamaica Parishes ─────────────────────────────────────────────────────────

val jamaicaParishes = listOf(
    ParishLocation("Kingston",      "Surrey",    17.9970, -76.7936, 14, Color(0xFF1565C0)),
    ParishLocation("St. Andrew",    "Surrey",    18.0747, -76.7956, 11, Color(0xFF1976D2)),
    ParishLocation("St. Thomas",    "Surrey",    17.9341, -76.3412, 6,  Color(0xFF1E88E5)),
    ParishLocation("Portland",      "Surrey",    18.1745, -76.4597, 8,  Color(0xFF2196F3)),
    ParishLocation("St. Mary",      "Middlesex", 18.3672, -76.9108, 7,  Color(0xFF26A69A)),
    ParishLocation("St. Ann",       "Middlesex", 18.4348, -77.2013, 9,  Color(0xFF00897B)),
    ParishLocation("Trelawny",      "Middlesex", 18.3523, -77.6068, 5,  Color(0xFF2E7D32)),
    ParishLocation("St. James",     "Cornwall",  18.4735, -77.9195, 12, Color(0xFF43A047)),
    ParishLocation("Hanover",       "Cornwall",  18.4078, -78.1338, 4,  Color(0xFF558B2F)),
    ParishLocation("Westmoreland",  "Cornwall",  18.2965, -78.1458, 7,  Color(0xFF827717)),
    ParishLocation("St. Elizabeth", "Cornwall",  17.9998, -77.7380, 6,  Color(0xFFE65100)),
    ParishLocation("Manchester",    "Middlesex", 18.0456, -77.5082, 8,  Color(0xFFBF360C)),
    ParishLocation("Clarendon",     "Middlesex", 17.9641, -77.2411, 7,  Color(0xFF6A1B9A)),
    ParishLocation("St. Catherine", "Middlesex", 17.9938, -77.1017, 10, Color(0xFF4527A0))
)