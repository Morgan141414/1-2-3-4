package kz.saphena.api.repository

import kz.saphena.api.model.Mkb10
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface Mkb10Repository : JpaRepository<Mkb10, UUID> {

}
