package kz.saphena.notification

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class NotificationApp

fun main(args: Array<String>) {
    runApplication<NotificationApp>(*args)
}
