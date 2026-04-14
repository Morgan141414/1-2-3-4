package kz.saphena.api.model

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Column
import jakarta.persistence.EntityListeners
import jakarta.persistence.MappedSuperclass
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedBy
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.io.Serializable
import java.time.LocalDateTime

@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
abstract class AbstractAuditableEntity : Serializable {

    @CreatedDate
    @Column(nullable = false, updatable = false)
    @JsonIgnore
    var createdAt: LocalDateTime? = null

    @CreatedBy
    @Column(nullable = false, updatable = false)
    @JsonIgnore
    var createdBy: String? = null

    @LastModifiedDate
    @Column
    @JsonIgnore
    var updatedAt: LocalDateTime? = null

    @LastModifiedBy
    @Column(nullable = false)
    @JsonIgnore
    var updatedBy: String? = null

    @Column(nullable = false)
    @JsonIgnore
    var deleted: Boolean = false

    fun markDeleted() {
        this.deleted = true
    }

    fun restore() {
        this.deleted = false
    }

}
