package kz.saphena.api.exception

import org.springframework.http.HttpStatusCode

/**
 * Exception thrown when there's an error communicating with the notification service
 */
class NotificationClientException(
    val status: HttpStatusCode,
    val clientId: String,
    val responseBody: Map<String, Any>,
    msg: String
) : RuntimeException(msg) {
    constructor(status: HttpStatusCode, clientId: String, responseBody: Map<String, Any>) : this(
        status,
        clientId,
        responseBody,
        "Error communicating with notification service for client $clientId: ${responseBody["message"] ?: "Unknown error"}"
    )
}
