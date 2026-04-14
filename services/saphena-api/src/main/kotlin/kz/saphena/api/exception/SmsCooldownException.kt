package kz.saphena.api.exception

class SmsCooldownException(
    val secondsLeft: Long,
) : RuntimeException("SMS cooldown: $secondsLeft seconds left")
