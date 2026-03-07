package com.ucc.healthapp.frontend.dashboard.resources

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.ucc.healthapp.R

// ─── Data Models ────────────────────────────────────────────────────────────

data class Article(
    val id: Int,
    val title: String,
    val duration: String,
    val author: String,
    val category: String,
    val iconRes: Int,
    val isSaved: Boolean = false
)

data class VideoResource(
    val id: Int,
    val title: String,
    val duration: String,
    val instructor: String,
    val category: String,
    val iconRes: Int
)

data class PodcastEpisode(
    val id: Int,
    val title: String,
    val duration: String,
    val episode: String,
    val isPlaying: Boolean = false
)

data class BookResource(
    val id: Int,
    val title: String,
    val author: String,
    val isSaved: Boolean = false
)

data class ResourceCategory(
    val label: String,
    val count: String,
    val color: Color,
    val iconRes: Int
)

// ─── Sample Data ─────────────────────────────────────────────────────────────

private val sampleArticles = listOf(
    Article(1, "5 Breathing Techniques for Stress Relief", "8 min read", "Dr. Emma Clarke", "Anxiety", R.drawable.ic_breathing),
    Article(2, "How to Build a Morning Routine", "10 min read", "James Osei", "Lifestyle", R.drawable.ic_mindfulness),
    Article(3, "Understanding Your Emotions", "12 min read", "Dr. Sarah Mitchell", "Mental Health", R.drawable.ic_mood_check),
    Article(4, "CBT Techniques for Everyday Life", "15 min read", "Dr. Nkechi Obi", "Therapy", R.drawable.ic_breathing),
    Article(5, "Sleep Hygiene: A Practical Guide", "9 min read", "Dr. Samuel Arhin", "Sleep", R.drawable.ic_mindfulness)
)

private val sampleVideos = listOf(
    VideoResource(1, "Guided Meditation", "15 min", "Dr. Emma Clarke", "Mindfulness", R.drawable.ic_mic),
    VideoResource(2, "Yoga for Anxiety", "20 min", "Adwoa Mensah", "Anxiety", R.drawable.ic_mic),
    VideoResource(3, "Body Scan Relaxation", "18 min", "Dr. Sarah Mitchell", "Relaxation", R.drawable.ic_mic),
    VideoResource(4, "Breathing Masterclass", "12 min", "James Osei", "Breathwork", R.drawable.ic_mic)
)

private val samplePodcasts = listOf(
    PodcastEpisode(1, "Finding Peace in Chaos", "32 min", "Ep. 14"),
    PodcastEpisode(2, "The Science of Happiness", "28 min", "Ep. 13"),
    PodcastEpisode(3, "Overcoming Fear Step by Step", "45 min", "Ep. 12"),
    PodcastEpisode(4, "Rewiring Anxious Thoughts", "37 min", "Ep. 11"),
    PodcastEpisode(5, "Self-Compassion Practices", "29 min", "Ep. 10")
)

private val sampleBooks = listOf(
    BookResource(1, "The Anxiety Toolkit", "Dr. Alice Boyes"),
    BookResource(2, "Atomic Habits", "James Clear"),
    BookResource(3, "The Body Keeps the Score", "Bessel van der Kolk"),
    BookResource(4, "Feeling Good", "Dr. David D. Burns"),
    BookResource(5, "Lost Connections", "Johann Hari")
)

private val sampleCategories = listOf(
    ResourceCategory("Anxiety", "24", Color(0xFFFF9800), R.drawable.ic_breathing),
    ResourceCategory("Depression", "18", Color(0xFF2196F3), R.drawable.ic_mood_check),
    ResourceCategory("Mindfulness", "32", Color(0xFF9C27B0), R.drawable.ic_mindfulness),
    ResourceCategory("Sleep", "15", Color(0xFF4CAF50), R.drawable.ic_headphones),
    ResourceCategory("Stress", "21", Color(0xFFE91E63), R.drawable.ic_breathing),
    ResourceCategory("Therapy", "12", Color(0xFF00BCD4), R.drawable.ic_book)
)

// ─── Main Screen ─────────────────────────────────────────────────────────────

@Composable
fun ResourcesScreen() {
    var selectedTab by remember { mutableIntStateOf(0) }
    var searchQuery by remember { mutableStateOf("") }
    var isGridView by remember { mutableStateOf(false) }
    var savedArticles by remember { mutableStateOf(setOf<Int>()) }
    var savedBooks by remember { mutableStateOf(setOf<Int>()) }
    var playingPodcast by remember { mutableStateOf<Int?>(null) }

    val tabs = listOf("All", "Articles", "Videos", "Podcasts", "Books", "Parishes")

    val filteredArticles = remember(searchQuery, selectedTab) {
        sampleArticles.filter { article ->
            (searchQuery.isBlank() || article.title.contains(searchQuery, ignoreCase = true)) &&
                    (selectedTab == 0 || selectedTab == 1)
        }
    }

    val filteredVideos = remember(searchQuery, selectedTab) {
        sampleVideos.filter { video ->
            (searchQuery.isBlank() || video.title.contains(searchQuery, ignoreCase = true)) &&
                    (selectedTab == 0 || selectedTab == 2)
        }
    }

    val filteredPodcasts = remember(searchQuery, selectedTab) {
        samplePodcasts.filter { podcast ->
            (searchQuery.isBlank() || podcast.title.contains(searchQuery, ignoreCase = true)) &&
                    (selectedTab == 0 || selectedTab == 3)
        }
    }

    val filteredBooks = remember(searchQuery, selectedTab) {
        sampleBooks.filter { book ->
            (searchQuery.isBlank() || book.title.contains(searchQuery, ignoreCase = true)) &&
                    (selectedTab == 0 || selectedTab == 4)
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        // Header
        item {
            ResourcesHeader(
                isGridView = isGridView,
                onToggleView = { isGridView = !isGridView }
            )
        }

        // Search Bar
        item {
            SearchBar(
                query = searchQuery,
                onQueryChange = { searchQuery = it },
                modifier = Modifier.padding(horizontal = 20.dp)
            )
        }

        // Category Tabs
        item {
            ScrollableTabRow(
                selectedTabIndex = selectedTab,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                edgePadding = 0.dp,
                containerColor = Color.Transparent,
                divider = {}
            ) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = {
                            Text(
                                text = title,
                                fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal,
                                fontSize = 14.sp
                            )
                        }
                    )
                }
            }
        }

        // Featured Resource — visible in All / Articles
        if (selectedTab == 0 || selectedTab == 1) {
            item {
                FeaturedResourceCard(
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }
        }

        // Popular Categories — visible in All only
        if (selectedTab == 0) {
            item {
                PopularCategoriesCard(
                    categories = sampleCategories,
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }
        }

        // Articles
        if (filteredArticles.isNotEmpty()) {
            item {
                RecentArticlesCard(
                    articles = filteredArticles,
                    isGridView = isGridView,
                    savedSet = savedArticles,
                    onToggleSave = { id ->
                        savedArticles = if (savedArticles.contains(id))
                            savedArticles - id else savedArticles + id
                    },
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }
        }

        // Videos
        if (filteredVideos.isNotEmpty()) {
            item {
                VideoResourcesCard(
                    videos = filteredVideos,
                    isGridView = isGridView,
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }
        }

        // Podcasts
        if (filteredPodcasts.isNotEmpty()) {
            item {
                PodcastEpisodesCard(
                    episodes = filteredPodcasts,
                    playingId = playingPodcast,
                    onPlayToggle = { id ->
                        playingPodcast = if (playingPodcast == id) null else id
                    },
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }
        }

        // Books
        if (filteredBooks.isNotEmpty()) {
            item {
                RecommendedBooksCard(
                    books = filteredBooks,
                    savedSet = savedBooks,
                    onToggleSave = { id ->
                        savedBooks = if (savedBooks.contains(id))
                            savedBooks - id else savedBooks + id
                    },
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }
        }

        // Community Resources
        if (selectedTab == 0) {
            item {
                CommunityResourcesCard(
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }
        }

        // ── Parish Locations ──────────────────────────────────────────────────
        // Visible on All tab and dedicated Parishes tab (index 5)
        if (selectedTab == 0 || selectedTab == 5) {
            item {
                ParishLocationsCard(
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }
        }

        // Empty State
        if (filteredArticles.isEmpty() && filteredVideos.isEmpty()
            && filteredPodcasts.isEmpty() && filteredBooks.isEmpty()
            && selectedTab != 5  // don't show empty state on Parishes tab
        ) {
            item {
                EmptyState(
                    query = searchQuery,
                    modifier = Modifier.padding(horizontal = 20.dp)
                )
            }
        }
    }
}

// ─── Header ──────────────────────────────────────────────────────────────────

@Composable
private fun ResourcesHeader(
    isGridView: Boolean,
    onToggleView: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 20.dp, end = 12.dp, top = 20.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "Resources",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = "Learn and grow at your own pace",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        Row {
            IconButton(onClick = onToggleView) {
                Icon(
                    imageVector = if (isGridView) Icons.Default.List else Icons.Default.GridView,
                    contentDescription = if (isGridView) "Switch to List View" else "Switch to Grid View",
                    tint = MaterialTheme.colorScheme.primary
                )
            }
            IconButton(onClick = { /* Navigate to Saved */ }) {
                Icon(
                    imageVector = Icons.Default.Favorite,
                    contentDescription = "Saved Resources",
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

@Composable
private fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier.fillMaxWidth(),
        placeholder = { Text("Search articles, videos, podcasts...") },
        leadingIcon = {
            Icon(imageVector = Icons.Default.Search, contentDescription = "Search")
        },
        trailingIcon = {
            AnimatedVisibility(visible = query.isNotEmpty(), enter = fadeIn(), exit = fadeOut()) {
                IconButton(onClick = { onQueryChange("") }) {
                    Icon(imageVector = Icons.Default.Clear, contentDescription = "Clear")
                }
            }
        },
        singleLine = true,
        shape = RoundedCornerShape(12.dp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedBorderColor = MaterialTheme.colorScheme.primary,
            unfocusedBorderColor = MaterialTheme.colorScheme.outline
        )
    )
}

// ─── Featured Resource ────────────────────────────────────────────────────────

@Composable
private fun FeaturedResourceCard(modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = MaterialTheme.colorScheme.primary
                ) {
                    Text(
                        text = "FEATURED",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        fontWeight = FontWeight.Bold
                    )
                }
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = Color(0xFF4CAF50).copy(alpha = 0.15f)
                ) {
                    Text(
                        text = "NEW",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color(0xFF2E7D32),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "Understanding Anxiety: A Complete Guide",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Learn evidence-based strategies to manage anxiety and find peace in your daily life. Covers CBT, breathing techniques, and lifestyle changes.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_book),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "12 min read",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "Dr. Sarah Mitchell",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = Color(0xFFFFC107),
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "4.9",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = {},
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(text = "Read Now")
                }
                OutlinedButton(
                    onClick = {},
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.FavoriteBorder,
                        contentDescription = "Save",
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}

// ─── Popular Categories ───────────────────────────────────────────────────────

@Composable
private fun PopularCategoriesCard(
    categories: List<ResourceCategory>,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Popular Categories",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                TextButton(onClick = {}) { Text("See All") }
            }

            Spacer(modifier = Modifier.height(16.dp))

            LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                items(categories) { category ->
                    CategoryChip(
                        label = category.label,
                        count = category.count,
                        color = category.color,
                        iconRes = category.iconRes
                    )
                }
            }
        }
    }
}

@Composable
private fun CategoryChip(
    label: String,
    count: String,
    color: Color,
    iconRes: Int
) {
    Surface(
        modifier = Modifier
            .width(100.dp)
            .height(90.dp)
            .clickable { /* Navigate to category */ },
        shape = RoundedCornerShape(12.dp),
        color = color.copy(alpha = 0.1f)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                painter = painterResource(id = iconRes),
                contentDescription = label,
                tint = color,
                modifier = Modifier.size(22.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = label,
                style = MaterialTheme.typography.labelMedium,
                fontWeight = FontWeight.Bold,
                color = color
            )
            Text(
                text = "$count items",
                style = MaterialTheme.typography.labelSmall,
                color = color.copy(alpha = 0.7f)
            )
        }
    }
}

// ─── Recent Articles ──────────────────────────────────────────────────────────

@Composable
private fun RecentArticlesCard(
    articles: List<Article>,
    isGridView: Boolean,
    savedSet: Set<Int>,
    onToggleSave: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Recent Articles",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                TextButton(onClick = {}) { Text("See All") }
            }

            Spacer(modifier = Modifier.height(12.dp))

            if (isGridView) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    articles.chunked(2).forEach { rowItems ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            rowItems.forEach { article ->
                                ArticleGridItem(
                                    article = article,
                                    isSaved = savedSet.contains(article.id),
                                    onToggleSave = { onToggleSave(article.id) },
                                    modifier = Modifier.weight(1f)
                                )
                            }
                            if (rowItems.size == 1) {
                                Spacer(modifier = Modifier.weight(1f))
                            }
                        }
                    }
                }
            } else {
                articles.forEachIndexed { index, article ->
                    ArticleListItem(
                        article = article,
                        isSaved = savedSet.contains(article.id),
                        onToggleSave = { onToggleSave(article.id) }
                    )
                    if (index < articles.lastIndex) {
                        HorizontalDivider(
                            modifier = Modifier.padding(vertical = 8.dp),
                            color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ArticleListItem(
    article: Article,
    isSaved: Boolean,
    onToggleSave: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { /* Open article */ }
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            modifier = Modifier.size(52.dp),
            shape = RoundedCornerShape(12.dp),
            color = MaterialTheme.colorScheme.primaryContainer
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    painter = painterResource(id = article.iconRes),
                    contentDescription = article.title,
                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                    modifier = Modifier.size(26.dp)
                )
            }
        }

        Spacer(modifier = Modifier.width(14.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = article.title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = article.author,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = " · ${article.duration}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            Surface(
                modifier = Modifier.padding(top = 4.dp),
                shape = RoundedCornerShape(4.dp),
                color = MaterialTheme.colorScheme.secondaryContainer
            ) {
                Text(
                    text = article.category,
                    style = MaterialTheme.typography.labelSmall,
                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                    color = MaterialTheme.colorScheme.onSecondaryContainer
                )
            }
        }

        Spacer(modifier = Modifier.width(8.dp))

        IconButton(onClick = onToggleSave, modifier = Modifier.size(36.dp)) {
            Icon(
                imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                contentDescription = if (isSaved) "Unsave" else "Save",
                tint = if (isSaved) Color(0xFFE91E63) else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

@Composable
private fun ArticleGridItem(
    article: Article,
    isSaved: Boolean,
    onToggleSave: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.clickable { /* Open article */ },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Surface(
                    modifier = Modifier.size(44.dp),
                    shape = RoundedCornerShape(10.dp),
                    color = MaterialTheme.colorScheme.primaryContainer
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            painter = painterResource(id = article.iconRes),
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onPrimaryContainer,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
                IconButton(
                    onClick = onToggleSave,
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = null,
                        tint = if (isSaved) Color(0xFFE91E63) else MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = article.title,
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.SemiBold,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = article.duration,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

// ─── Video Resources ──────────────────────────────────────────────────────────

@Composable
private fun VideoResourcesCard(
    videos: List<VideoResource>,
    isGridView: Boolean,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Video Guides",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                TextButton(onClick = {}) { Text("See All") }
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (isGridView) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    videos.chunked(2).forEach { rowItems ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            rowItems.forEach { video ->
                                VideoCard(video = video, modifier = Modifier.weight(1f))
                            }
                            if (rowItems.size == 1) Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                }
            } else {
                LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    items(videos) { video ->
                        VideoCard(video = video, modifier = Modifier.width(160.dp))
                    }
                }
            }
        }
    }
}

@Composable
private fun VideoCard(
    video: VideoResource,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.clickable { /* Play video */ },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(90.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(
                        Brush.linearGradient(
                            listOf(
                                MaterialTheme.colorScheme.primaryContainer,
                                MaterialTheme.colorScheme.secondaryContainer
                            )
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.9f),
                    modifier = Modifier.size(36.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = "Play",
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text(
                text = video.title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(4.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Person,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(12.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = video.instructor,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Text(
                text = video.duration,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

// ─── Podcast Episodes ─────────────────────────────────────────────────────────

@Composable
private fun PodcastEpisodesCard(
    episodes: List<PodcastEpisode>,
    playingId: Int?,
    onPlayToggle: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_headphones),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSecondaryContainer,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Latest Podcast Episodes",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSecondaryContainer
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            episodes.forEachIndexed { index, episode ->
                val isPlaying = playingId == episode.id
                val bgColor by animateColorAsState(
                    targetValue = if (isPlaying) MaterialTheme.colorScheme.secondary.copy(alpha = 0.15f)
                    else Color.Transparent,
                    animationSpec = tween(300),
                    label = "podcastBg"
                )

                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(10.dp))
                        .clickable { onPlayToggle(episode.id) },
                    color = bgColor,
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 10.dp, horizontal = 6.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = if (isPlaying) MaterialTheme.colorScheme.secondary
                                else MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.15f),
                                modifier = Modifier.size(36.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                                        contentDescription = if (isPlaying) "Pause" else "Play",
                                        tint = if (isPlaying) MaterialTheme.colorScheme.onSecondary
                                        else MaterialTheme.colorScheme.onSecondaryContainer,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = episode.episode,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.6f),
                                    fontWeight = FontWeight.Medium
                                )
                                Text(
                                    text = episode.title,
                                    style = MaterialTheme.typography.bodyMedium,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.onSecondaryContainer,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = episode.duration,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.7f)
                                )
                            }
                        }
                    }
                }

                if (index < episodes.lastIndex) {
                    HorizontalDivider(
                        modifier = Modifier.padding(horizontal = 6.dp),
                        color = MaterialTheme.colorScheme.onSecondaryContainer.copy(alpha = 0.12f)
                    )
                }
            }
        }
    }
}

// ─── Recommended Books ────────────────────────────────────────────────────────

@Composable
private fun RecommendedBooksCard(
    books: List<BookResource>,
    savedSet: Set<Int>,
    onToggleSave: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Recommended Reading",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                TextButton(onClick = {}) { Text("See All") }
            }

            Spacer(modifier = Modifier.height(16.dp))

            books.forEachIndexed { index, book ->
                BookItem(
                    book = book,
                    isSaved = savedSet.contains(book.id),
                    onToggleSave = { onToggleSave(book.id) }
                )
                if (index < books.lastIndex) {
                    HorizontalDivider(
                        modifier = Modifier.padding(vertical = 8.dp),
                        color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f)
                    )
                }
            }
        }
    }
}

@Composable
private fun BookItem(
    book: BookResource,
    isSaved: Boolean,
    onToggleSave: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { /* View book details */ }
            .padding(vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            modifier = Modifier.size(52.dp),
            shape = RoundedCornerShape(8.dp),
            color = MaterialTheme.colorScheme.tertiaryContainer
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_book),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onTertiaryContainer,
                    modifier = Modifier.size(26.dp)
                )
            }
        }

        Spacer(modifier = Modifier.width(16.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = book.title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "by ${book.author}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        Spacer(modifier = Modifier.width(8.dp))

        IconButton(onClick = onToggleSave, modifier = Modifier.size(36.dp)) {
            Icon(
                imageVector = if (isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                contentDescription = if (isSaved) "Unsave" else "Save",
                tint = if (isSaved) Color(0xFFE91E63) else MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

// ─── Community Resources ──────────────────────────────────────────────────────

@Composable
private fun CommunityResourcesCard(modifier: Modifier = Modifier) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9)),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = "Join Our Community",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF2E7D32)
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Connect with others on a similar journey and share resources",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color(0xFF2E7D32).copy(alpha = 0.8f)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Group,
                        contentDescription = null,
                        tint = Color(0xFF4CAF50),
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "2,400+ members",
                        style = MaterialTheme.typography.labelSmall,
                        color = Color(0xFF4CAF50),
                        fontWeight = FontWeight.Medium
                    )
                }
            }
            Spacer(modifier = Modifier.width(12.dp))
            Button(
                onClick = {},
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4CAF50)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text(text = "Join")
            }
        }
    }
}

// ─── Empty State ──────────────────────────────────────────────────────────────

@Composable
private fun EmptyState(
    query: String,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth().padding(vertical = 40.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = Icons.Outlined.SearchOff,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f),
            modifier = Modifier.size(56.dp)
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = if (query.isNotBlank()) "No results for \"$query\"" else "No resources available",
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = "Try a different search term or browse categories",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
        )
    }
}