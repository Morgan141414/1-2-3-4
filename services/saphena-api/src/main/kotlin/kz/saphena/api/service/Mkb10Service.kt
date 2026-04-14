package kz.saphena.api.service

import kz.saphena.api.dto.Mkb10Response
import kz.saphena.api.model.Mkb10
import kz.saphena.api.repository.Mkb10Repository
import org.apache.poi.hssf.usermodel.HSSFWorkbook
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile

@Service
class Mkb10Service(
    private val mkb10Repository: Mkb10Repository
) {
    fun getMkb10Dictionary(): List<Mkb10Response> {
        return mkb10Repository.findAll()
            .map {
                Mkb10Response(
                    key = it.key,
                    name = it.name
                )
            }
    }

    @Transactional
    fun updateMkb10Dictionary(file: MultipartFile) {
        if (file.contentType != "application/vnd.ms-excel") {
            throw IllegalArgumentException("Разрешены только форматы: .xls")
        }

        val mkb10List = mutableListOf<Mkb10>()
        file.inputStream.use {
            val workbook = HSSFWorkbook(it)
            val sheet = workbook.getSheetAt(0)

            for (row in sheet) {
                val key = row.getCell(0)?.stringCellValue?.trim() ?: ""
                val name = row.getCell(1)?.stringCellValue?.trim() ?: ""

                mkb10List.add(
                    Mkb10(
                        key = key,
                        name = name
                    )
                )
            }
        }

        mkb10Repository.deleteAllInBatch()
        mkb10Repository.saveAll(mkb10List)
    }
}