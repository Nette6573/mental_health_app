package com.ucc.healthapp.data.repository

import android.content.Context
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.FacebookAuthProvider
import com.google.firebase.firestore.FirebaseFirestore
import com.ucc.healthapp.data.models.User
import kotlinx.coroutines.tasks.await
import java.util.Date

class AuthRepository(
    private val auth: FirebaseAuth = FirebaseAuth.getInstance(),
    private val db: FirebaseFirestore = FirebaseFirestore.getInstance()
) {
    suspend fun login(email: String, password: String): Result<User> {
        return try {
            val authResult = auth.signInWithEmailAndPassword(email, password).await()
            val user = getUserFromFirebase(authResult.user!!)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signup(
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        newsletter: Boolean
    ): Result<User> {
        return try {
            // Create user in Firebase Auth
            val authResult = auth.createUserWithEmailAndPassword(email, password).await()
            val firebaseUser = authResult.user!!

            // Update profile
            val profileUpdates = com.google.firebase.auth.UserProfileChangeRequest.Builder()
                .setDisplayName("$firstName $lastName".trim())
                .build()
            firebaseUser.updateProfile(profileUpdates).await()

            // Save to Firestore
            val user = User(
                id = firebaseUser.uid,
                firstName = firstName,
                lastName = lastName,
                email = email,
                joinDate = Date(),
                newsletter = newsletter
            )

            db.collection("users").document(firebaseUser.uid).set(user).await()

            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun loginWithGoogle(idToken: String): Result<User> {
        return try {
            val credential = GoogleAuthProvider.getCredential(idToken, null)
            val authResult = auth.signInWithCredential(credential).await()
            val user = getUserFromFirebase(authResult.user!!)

            // Check if user exists in Firestore, create if not
            val userDoc = db.collection("users").document(user.id).get().await()
            if (!userDoc.exists()) {
                val newUser = user.copy(
                    joinDate = Date(),
                    newsletter = true
                )
                db.collection("users").document(user.id).set(newUser).await()
                Result.success(newUser)
            } else {
                Result.success(user)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun loginWithFacebook(token: String): Result<User> {
        return try {
            val credential = FacebookAuthProvider.getCredential(token)
            val authResult = auth.signInWithCredential(credential).await()
            val user = getUserFromFirebase(authResult.user!!)

            val userDoc = db.collection("users").document(user.id).get().await()
            if (!userDoc.exists()) {
                val newUser = user.copy(
                    joinDate = Date(),
                    newsletter = true
                )
                db.collection("users").document(user.id).set(newUser).await()
                Result.success(newUser)
            } else {
                Result.success(user)
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun resetPassword(email: String): Result<Unit> {
        return try {
            auth.sendPasswordResetEmail(email).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout() {
        auth.signOut()
    }

    suspend fun updateProfile(user: User, updates: Map<String, Any>): Result<User> {
        return try {
            // Update Firestore
            db.collection("users").document(user.id).update(updates).await()

            // Update Firebase Auth display name if needed
            val currentUser = auth.currentUser
            if (currentUser != null && (updates.containsKey("firstName") || updates.containsKey("lastName"))) {
                val firstName = updates["firstName"] as? String ?: user.firstName
                val lastName = updates["lastName"] as? String ?: user.lastName
                val profileUpdates = com.google.firebase.auth.UserProfileChangeRequest.Builder()
                    .setDisplayName("$firstName $lastName".trim())
                    .build()
                currentUser.updateProfile(profileUpdates).await()
            }

            val updatedUser = user.copy(
                firstName = updates["firstName"] as? String ?: user.firstName,
                lastName = updates["lastName"] as? String ?: user.lastName
            )

            Result.success(updatedUser)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun getUserFromFirebase(firebaseUser: com.google.firebase.auth.FirebaseUser): User {
        val displayName = firebaseUser.displayName ?: ""
        val nameParts = displayName.split(" ")

        return User(
            id = firebaseUser.uid,
            firstName = nameParts.firstOrNull() ?: "",
            lastName = nameParts.drop(1).joinToString(" "),
            email = firebaseUser.email ?: "",
            avatar = firebaseUser.photoUrl?.toString(),
            joinDate = Date(firebaseUser.metadata?.creationTimestamp ?: System.currentTimeMillis())
        )
    }
}