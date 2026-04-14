package kz.saphena.api.exception

import jakarta.persistence.EntityExistsException
import jakarta.persistence.EntityNotFoundException
import org.springframework.http.HttpStatus
import org.springframework.security.core.AuthenticationException
import org.springframework.web.HttpRequestMethodNotSupportedException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException
import java.sql.SQLException


@RestControllerAdvice
class ControllerExceptionHandler {

    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatusException(e: ResponseStatusException) =
        ResponseStatusException(e.statusCode, e.message)

    @ExceptionHandler(AuthenticationException::class)
    fun handleAuthenticationExceptions(e: RuntimeException) =
        ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication failed: ${e.message}")

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleMethodArgumentNotValidException(e: MethodArgumentNotValidException) =
        ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "MethodArgumentNotValidException: ${e.bindingResult.fieldErrors}"
        )

    @ExceptionHandler(EntityExistsException::class)
    fun handleEntityExistsException(e: EntityExistsException) =
        ResponseStatusException(HttpStatus.CONFLICT, "EntityExistsException: ${e.message}")

    @ExceptionHandler(EntityNotFoundException::class)
    fun handleEntityNotFoundException(e: EntityNotFoundException) =
        ResponseStatusException(HttpStatus.NOT_FOUND, "EntityNotFoundException: ${e.message}")

    @ExceptionHandler(SQLException::class)
    fun handleSQLException(e: SQLException) =
        ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "SQLException: ${e.message}")

    @ExceptionHandler(HttpRequestMethodNotSupportedException::class)
    fun handleHttpRequestMethodNotSupportedException(e: HttpRequestMethodNotSupportedException) =
        ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED, "MethodNotSupportedException: ${e.message}")

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgumentException(e: IllegalArgumentException) =
        ResponseStatusException(HttpStatus.BAD_REQUEST, "IllegalArgumentException: ${e.message}")

    @ExceptionHandler(NotificationClientException::class)
    fun handleNotificationClientException(e: NotificationClientException) =
        ResponseStatusException(e.status, "NotificationClientException: ${e.message}")

    @ExceptionHandler(SmsCooldownException::class)
    fun handleSmsCooldownException(e: SmsCooldownException) =
        ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "SmsCooldownException: ${e.message}")

    @ExceptionHandler(IllegalStateException::class)
    fun handleIllegalStateException(e: IllegalStateException) =
        ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "IllegalStateException: ${e.message}")

}
