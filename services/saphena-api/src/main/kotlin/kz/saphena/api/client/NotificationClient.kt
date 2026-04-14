package kz.saphena.api.client

import com.fasterxml.jackson.databind.ObjectMapper
import kz.saphena.api.exception.NotificationClientException
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.HttpServerErrorException
import org.springframework.web.client.RestClientResponseException
import org.springframework.web.client.RestTemplate

/**
 * Implementation of NotificationClient that sends HTTP requests to an external notification service
 */
@Component
class NotificationClient(
    private val restTemplate: RestTemplate,
    private val objectMapper: ObjectMapper,
    @Value("\${notification.service.url:http://localhost:3000}")
    private val serviceUrl: String
) {
    private val logger = LoggerFactory.getLogger(NotificationClient::class.java)
    private val sendMessageEndpoint = "/api/send-message"
    private val clientsEndpoint = "/api/clients"
    
    /**
     * Handles RestClientResponseException by parsing the response body and throwing a NotificationClientException
     * 
     * @param e The RestClientResponseException to handle
     * @param clientId The client identifier
     * @param operationName The name of the operation that failed (for logging)
     * @throws NotificationClientException with the parsed error details
     */
    private fun handleRestClientException(e: RestClientResponseException, clientId: String, operationName: String) {
        logger.error("Failed to $operationName: ${e.message}", e)
        try {
            val responseBody = parseErrorResponse(e.responseBodyAsString, e.statusCode.toString(), e.message)
            throw NotificationClientException(e.statusCode, clientId, responseBody)
        } catch (ex: Exception) {
            logger.error("Failed to parse error response: ${ex.message}", ex)
            val errorMap = mapOf("error" to "Client error", "message" to (e.message ?: "Unknown error"))
            throw NotificationClientException(e.statusCode, clientId, errorMap)
        }
    }
    
    /**
     * Handles general exceptions by creating an error map and throwing a NotificationClientException
     * 
     * @param e The Exception to handle
     * @param clientId The client identifier
     * @param operationName The name of the operation that failed (for logging)
     * @throws NotificationClientException with the error details
     */
    private fun handleGeneralException(e: Exception, clientId: String, operationName: String) {
        logger.error("Failed to $operationName: ${e.message}", e)
        val errorMap = mapOf("error" to "Unknown error", "message" to (e.message ?: "Unknown error"))
        throw NotificationClientException(HttpStatus.INTERNAL_SERVER_ERROR, clientId, errorMap)
    }
    
    /**
     * Parses an error response body into a Map
     * 
     * @param responseBody The response body as a string
     * @param statusCode The HTTP status code as a string
     * @param errorMessage The error message
     * @return A Map containing the parsed error details
     */
    @Suppress("UNCHECKED_CAST")
    private fun parseErrorResponse(responseBody: String, statusCode: String, errorMessage: String?): Map<String, Any> {
        return responseBody.let { 
            if (it.isNotBlank()) {
                // Try to parse the response body as JSON
                objectMapper.readValue(it, Map::class.java) as Map<String, Any>
            } else {
                mapOf("error" to "Client error: $statusCode", "message" to (errorMessage ?: "Unknown error"))
            }
        }
    }
    
    /**
     * Creates HTTP headers with JSON content type
     * 
     * @return HttpHeaders configured for JSON content
     */
    private fun createJsonHeaders(): HttpHeaders {
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON
        return headers
    }

    /**
     * Creates a new notification client
     * 
     * @param clientId The client identifier
     * @return true if the client was created successfully
     * @throws NotificationClientException if there's an error communicating with the notification service
     */
    fun createClient(clientId: String): Boolean {
        try {
            val requestBody = mapOf(
                "clientId" to clientId
            )

            val request = HttpEntity(requestBody, createJsonHeaders())
            val url = "$serviceUrl$clientsEndpoint"

            logger.info("Creating client with ID $clientId at $url")
            val response = restTemplate.postForEntity(url, request, Map::class.java)

            logger.info("Client creation response: ${response.statusCode}")
            return response.statusCode.is2xxSuccessful
        } catch (e: RestClientResponseException) {
            handleRestClientException(e, clientId, "create client")
            throw IllegalStateException("This code should never be reached")
        } catch (e: Exception) {
            handleGeneralException(e, clientId, "create client")
            throw IllegalStateException("This code should never be reached")
        }
    }

    /**
     * Deletes a notification client
     * 
     * @param clientId The client identifier
     * @return true if the client was deleted successfully
     * @throws NotificationClientException if there's an error communicating with the notification service
     */
    fun deleteClient(clientId: String): Boolean {
        try {
            val url = "$serviceUrl$clientsEndpoint/$clientId"

            logger.info("Deleting client with ID $clientId at $url")
            restTemplate.delete(url)

            logger.info("Client deleted successfully")
            return true
        } catch (e: RestClientResponseException) {
            handleRestClientException(e, clientId, "delete client")
            throw IllegalStateException("This code should never be reached")
        } catch (e: Exception) {
            handleGeneralException(e, clientId, "delete client")
            throw IllegalStateException("This code should never be reached")
        }
    }

    /**
     * Retrieves the QR code for binding a WhatsApp number for a specific client
     * 
     * @param clientId The client identifier
     * @return String representation of the QR code
     * @throws NotificationClientException if there's an error communicating with the notification service
     */
    fun getQrCode(clientId: String): String {
        try {
            val url = "$serviceUrl$clientsEndpoint/$clientId/qr"

            logger.info("Requesting QR code for client $clientId from $url")
            val response = restTemplate.getForObject(url, Map::class.java)

            logger.info("QR code retrieved successfully")
            return response?.get("qr") as String? ?: ""
        } catch (e: RestClientResponseException) {
            handleRestClientException(e, clientId, "retrieve QR code")
            throw IllegalStateException("This code should never be reached")
        } catch (e: Exception) {
            handleGeneralException(e, clientId, "retrieve QR code")
            throw IllegalStateException("This code should never be reached")
        }
    }

    /**
     * Gets the status of a client
     * 
     * @param clientId The client identifier
     * @return The client status as a Map for successful responses
     * @throws NotificationClientException if there's an error communicating with the notification service
     */
    fun getClientStatus(clientId: String): Map<String, Any> {
        val url = "$serviceUrl$clientsEndpoint/$clientId/status"
        logger.info("Requesting status for client $clientId from $url")

        try {
            val requestEntity = HttpEntity<Any>(createJsonHeaders())
            val response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, Map::class.java)

            logger.info("Client status retrieved successfully with status code: ${response.statusCode}")
            @Suppress("UNCHECKED_CAST")
            return response.body as? Map<String, Any> ?: emptyMap<String, Any>()
        } catch (e: HttpClientErrorException) {
            // Both HttpClientErrorException and HttpServerErrorException are subclasses of RestClientResponseException
            handleRestClientException(e, clientId, "retrieve client status")
            throw IllegalStateException("This code should never be reached")
        } catch (e: HttpServerErrorException) {
            handleRestClientException(e, clientId, "retrieve client status")
            throw IllegalStateException("This code should never be reached")
        } catch (e: Exception) {
            handleGeneralException(e, clientId, "retrieve client status")
            throw IllegalStateException("This code should never be reached")
        }
    }

    /**
     * Sends a notification message to the specified phone number via a specific client
     * 
     * @param clientId The client identifier
     * @param phoneNumber The recipient's phone number
     * @param message The message content to send
     * @param delayMs Optional delay in milliseconds
     * @return true if the message was sent successfully
     * @throws NotificationClientException if there's an error communicating with the notification service
     */
    fun sendMessage(clientId: String, phoneNumber: String, message: String, delayMs: Long = 1000): Boolean {
        try {
            val requestBody = mapOf(
                "clientId" to clientId,
                "number" to phoneNumber,
                "message" to message,
                "delay" to delayMs
            )

            val request = HttpEntity(requestBody, createJsonHeaders())
            val url = "$serviceUrl$sendMessageEndpoint"

            logger.info("Sending notification request to $url for client $clientId")
            val response = restTemplate.postForEntity(url, request, Map::class.java)

            logger.info("Notification service response: ${response.statusCode}")
            return response.statusCode.is2xxSuccessful
        } catch (e: RestClientResponseException) {
            handleRestClientException(e, clientId, "send notification")
            throw IllegalStateException("This code should never be reached")
        } catch (e: Exception) {
            handleGeneralException(e, clientId, "send notification")
            throw IllegalStateException("This code should never be reached")
        }
    }
}
