package com.ucc.healthapp.frontend.dashboard.paula

import android.annotation.SuppressLint
import android.graphics.Bitmap
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView

private const val PAULA_URL = "https://mental-health-app-cyan.vercel.app/paula/"

// ─── Main Screen ──────────────────────────────────────────────────────────────

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun PaulaWebViewScreen(onClose: () -> Unit = {}) {

    var webView by remember { mutableStateOf<WebView?>(null) }
    var isLoading by remember { mutableStateOf(true) }
    var loadError by remember { mutableStateOf(false) }
    var pageTitle by remember { mutableStateOf("Paula") }
    var loadProgress by remember { mutableStateOf(0) }
    var canGoBack by remember { mutableStateOf(false) }

    // Handle hardware back button — navigate in WebView first, then close
    BackHandler(enabled = canGoBack) {
        webView?.goBack()
    }

    Scaffold(
        topBar = {
            PaulaTopBar(
                title = pageTitle,
                isLoading = isLoading,
                canGoBack = canGoBack,
                onBack = { webView?.goBack() },
                onRefresh = { webView?.reload() },
                onClose = onClose
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            when {
                loadError -> PaulaErrorView(onRetry = {
                    loadError = false
                    isLoading = true
                    webView?.reload()
                })

                else -> {
                    // ── WebView ───────────────────────────────────────────────
                    AndroidView(
                        factory = { ctx ->
                            WebView(ctx).apply {
                                settings.apply {
                                    javaScriptEnabled = true
                                    domStorageEnabled = true
                                    loadWithOverviewMode = true
                                    useWideViewPort = true
                                    setSupportZoom(false)
                                    builtInZoomControls = false
                                    displayZoomControls = false
                                    allowFileAccess = false
                                    mixedContentMode =
                                        android.webkit.WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
                                }

                                webViewClient = object : WebViewClient() {
                                    override fun onPageStarted(view: WebView, url: String, favicon: Bitmap?) {
                                        isLoading = true
                                        loadError = false
                                        canGoBack = view.canGoBack()
                                    }

                                    override fun onPageFinished(view: WebView, url: String) {
                                        isLoading = false
                                        canGoBack = view.canGoBack()
                                    }

                                    override fun onReceivedError(
                                        view: WebView, request: WebResourceRequest, error: WebResourceError
                                    ) {
                                        if (request.isForMainFrame) {
                                            isLoading = false
                                            loadError = true
                                        }
                                    }
                                }

                                webChromeClient = object : WebChromeClient() {
                                    override fun onReceivedTitle(view: WebView, title: String?) {
                                        // Strip the app name prefix if present
                                        pageTitle = title
                                            ?.removePrefix("HopePath - ")
                                            ?.trim()
                                            ?.takeIf { it.isNotBlank() } ?: "Paula"
                                    }

                                    override fun onProgressChanged(view: WebView, newProgress: Int) {
                                        loadProgress = newProgress
                                    }
                                }

                                loadUrl(PAULA_URL)
                                webView = this
                            }
                        },
                        modifier = Modifier.fillMaxSize()
                    )

                    // ── Linear progress bar ───────────────────────────────────
                    AnimatedVisibility(
                        visible = isLoading,
                        enter = fadeIn(),
                        exit = fadeOut(),
                        modifier = Modifier.align(Alignment.TopCenter)
                    ) {
                        LinearProgressIndicator(
                            progress = { loadProgress / 100f },
                            modifier = Modifier.fillMaxWidth().height(3.dp),
                            color = MaterialTheme.colorScheme.primary,
                            trackColor = MaterialTheme.colorScheme.primaryContainer
                        )
                    }

                    // ── Loading overlay on first load ─────────────────────────
                    AnimatedVisibility(
                        visible = isLoading && loadProgress < 30,
                        enter = fadeIn(),
                        exit = fadeOut(tween(400)),
                        modifier = Modifier.fillMaxSize()
                    ) {
                        PaulaLoadingOverlay()
                    }
                }
            }
        }
    }
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun PaulaTopBar(
    title: String,
    isLoading: Boolean,
    canGoBack: Boolean,
    onBack: () -> Unit,
    onRefresh: () -> Unit,
    onClose: () -> Unit
) {
    TopAppBar(
        title = {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                // Paula avatar dot
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(28.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text("P", style = MaterialTheme.typography.labelMedium,
                            fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }
                Column {
                    Text(title, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold,
                        maxLines = 1)
                    Text(
                        if (isLoading) "Connecting…" else "HopePath Companion",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 10.sp
                    )
                }
            }
        },
        navigationIcon = {
            if (canGoBack) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, "Back")
                }
            } else {
                IconButton(onClick = onClose) {
                    Icon(Icons.Default.Close, "Close")
                }
            }
        },
        actions = {
            IconButton(onClick = onRefresh) {
                Icon(Icons.Default.Refresh, "Refresh",
                    tint = if (isLoading) MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant)
            }
            IconButton(onClick = onClose) {
                Icon(Icons.Default.Close, "Close Paula")
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    )
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────

@Composable
private fun PaulaLoadingOverlay() {
    val pulseAnim = remember { Animatable(0.92f) }
    LaunchedEffect(Unit) {
        while (true) {
            pulseAnim.animateTo(1.05f, tween(700, easing = FastOutSlowInEasing))
            pulseAnim.animateTo(0.92f, tween(700, easing = FastOutSlowInEasing))
        }
    }
    val scale by pulseAnim.asState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Surface(
                shape = CircleShape,
                modifier = Modifier.size(80.dp).scale(scale),
                color = Color.Transparent
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.radialGradient(
                                listOf(
                                    MaterialTheme.colorScheme.primary,
                                    MaterialTheme.colorScheme.tertiary.copy(alpha = 0.7f)
                                )
                            ),
                            CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text("P", style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold, color = Color.White)
                }
            }
            Spacer(Modifier.height(20.dp))
            Text("Loading Paula…", style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onBackground)
            Spacer(Modifier.height(6.dp))
            Text("Your mental health companion", style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.height(24.dp))
            CircularProgressIndicator(
                modifier = Modifier.size(24.dp), strokeWidth = 2.dp,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

// ─── Error View ───────────────────────────────────────────────────────────────

@Composable
private fun PaulaErrorView(onRetry: () -> Unit) {
    Box(modifier = Modifier.fillMaxSize().background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(40.dp)) {
            Surface(shape = CircleShape, color = MaterialTheme.colorScheme.errorContainer,
                modifier = Modifier.size(72.dp)) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.WifiOff, null, tint = MaterialTheme.colorScheme.onErrorContainer,
                        modifier = Modifier.size(36.dp))
                }
            }
            Spacer(Modifier.height(20.dp))
            Text("Couldn't reach Paula", style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            Text("Please check your internet connection and try again.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = androidx.compose.ui.text.style.TextAlign.Center)
            Spacer(Modifier.height(28.dp))
            Button(onClick = onRetry, shape = RoundedCornerShape(12.dp),
                modifier = Modifier.fillMaxWidth()) {
                Icon(Icons.Default.Refresh, null, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Try Again")
            }
        }
    }
}